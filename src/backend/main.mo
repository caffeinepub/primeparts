import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

import Stripe "stripe/stripe";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";

actor {
  // Types
  public type Category = {
    #ram;
    #ssd;
    #screen;
    #battery;
    #keyboard;
    #accessory;
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    priceInPaisa : Nat;
    category : Category;
    stockQuantity : Nat;
    imageUrls : [Text];
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  public type Warranty = {
    #sixMonths;
    #twelveMonths;
  };

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
    warranty : Warranty;
  };

  public type OrderItem = {
    productId : Nat;
    quantity : Nat;
    warranty : Warranty;
    priceInPaisa : Nat;
  };

  public type Order = {
    id : Nat;
    user : Principal;
    items : [OrderItem];
    totalAmountInPaisa : Nat;
    orderDate : Time.Time;
    paymentStatus : Text;
    stripeSessionId : Text;
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    priceInPaisa : Nat;
    category : Category;
    stockQuantity : Nat;
    imageUrls : [Text];
  };

  public type CartInput = {
    productId : Nat;
    quantity : Nat;
    warranty : Warranty;
  };

  // Mixins
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // State
  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;

  let userCarts = Map.empty<Principal, List.List<CartItem>>();
  let orders = Map.empty<Nat, Order>();
  var nextOrderId = 1;

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Product Management
  public shared ({ caller }) func createProduct(input : ProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };

    let id = nextProductId;
    let product : Product = {
      id;
      name = input.name;
      description = input.description;
      priceInPaisa = input.priceInPaisa;
      category = input.category;
      stockQuantity = input.stockQuantity;
      imageUrls = input.imageUrls;
    };

    products.add(id, product);
    nextProductId += 1;
  };

  public shared ({ caller }) func updateProduct(id : Nat, input : ProductInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    let product : Product = {
      id;
      name = input.name;
      description = input.description;
      priceInPaisa = input.priceInPaisa;
      category = input.category;
      stockQuantity = input.stockQuantity;
      imageUrls = input.imageUrls;
    };

    products.add(id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    products.remove(id);
  };

  public shared ({ caller }) func uploadImage() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upload images");
    };
    Runtime.trap("Store the image blob in the frontend. Store only the reference to the blob in the backend.");
  };

  // Product Queries
  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.category == category;
      }
    );
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let term = searchTerm.toLower();
    products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text term) or product.description.toLower().contains(#text term);
      }
    );
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Shopping Cart Management
  public shared ({ caller }) func addToCart(input : CartInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add to cart");
    };

    let cart = switch (userCarts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?cart) { cart };
    };

    // Check if item already exists
    let existingItem = cart.find(
      func(item) {
        item.productId == input.productId and item.warranty == input.warranty
      }
    );

    switch (existingItem) {
      case (null) {
        let newItem : CartItem = {
          productId = input.productId;
          quantity = input.quantity;
          warranty = input.warranty;
        };
        cart.add(newItem);
      };
      case (?item) {
        let updatedItem : CartItem = {
          productId = item.productId;
          quantity = item.quantity + input.quantity;
          warranty = item.warranty;
        };

        // Remove old item and add updated item
        let filteredCart = cart.filter(
          func(cartItem) {
            not (cartItem.productId == item.productId and cartItem.warranty == item.warranty);
          }
        );
        filteredCart.add(updatedItem);
        userCarts.add(caller, filteredCart);
        return;
      };
    };

    userCarts.add(caller, cart);
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, warranty : Warranty, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update cart items");
    };

    let cart = switch (userCarts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?cart) { cart };
    };

    let updatedCart = cart.map<CartItem, CartItem>(
      func(item) {
        if (item.productId == productId and item.warranty == warranty) {
          { productId; quantity; warranty };
        } else {
          item;
        };
      }
    );

    userCarts.add(caller, updatedCart);

  };

  public shared ({ caller }) func removeCartItem(productId : Nat, warranty : Warranty) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can remove cart items");
    };

    let cart = switch (userCarts.get(caller)) {
      case (null) { List.empty<CartItem>() };
      case (?cart) { cart };
    };

    let filteredCart = cart.filter(
      func(item) {
        not (item.productId == productId and item.warranty == warranty);
      }
    );

    userCarts.add(caller, filteredCart);
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view cart");
    };

    switch (userCarts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  // Order Management
  public shared ({ caller }) func createOrder(stripeSessionId : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create orders");
    };

    let cart = switch (userCarts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) { cart };
    };

    if (cart.isEmpty()) {
      Runtime.trap("Cart is empty");
    };

    // Calculate total amount
    var totalAmount : Nat = 0;
    let orderItems = List.empty<OrderItem>();

    for (cartItem in cart.values()) {
      let product = switch (products.get(cartItem.productId)) {
        case (null) { Runtime.trap("Product not found") };
        case (?product) { product };
      };

      totalAmount += product.priceInPaisa * cartItem.quantity;

      let orderItem : OrderItem = {
        productId = cartItem.productId;
        quantity = cartItem.quantity;
        warranty = cartItem.warranty;
        priceInPaisa = product.priceInPaisa;
      };

      orderItems.add(orderItem);
    };

    let order : Order = {
      id = nextOrderId;
      user = caller;
      items = orderItems.toArray();
      totalAmountInPaisa = totalAmount;
      orderDate = Time.now();
      paymentStatus = "pending";
      stripeSessionId;
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;

    // Clear cart
    userCarts.remove(caller);

    order.id;
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    let order = switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };

    let updatedOrder : Order = {
      id = order.id;
      user = order.user;
      items = order.items;
      totalAmountInPaisa = order.totalAmountInPaisa;
      orderDate = order.orderDate;
      paymentStatus = status;
      stripeSessionId = order.stripeSessionId;
    };

    orders.add(id, updatedOrder);
  };

  public query ({ caller }) func getOrder(id : Nat) : async Order {
    let order = switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };

    // Only the order owner or admins can view an order
    if (caller != order.user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };

    order;
  };

  public query ({ caller }) func getUserOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    orders.values().toArray().filter(
      func(order) {
        order.user == caller;
      }
    );
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };

    orders.values().toArray();
  };

  // Warranty System is integrated into CartItem and OrderItem types

  // Stripe Integration
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };

    stripeConfig := ?config;
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) {
        Runtime.trap("Stripe needs to be first configured");
      };
      case (?config) { config };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Helper functions
  public query ({ caller }) func productCount() : async Nat {
    products.size();
  };

  public query ({ caller }) func ordersCount() : async Nat {
    orders.size();
  };
};
