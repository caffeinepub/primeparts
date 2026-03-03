import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductInput {
    stockQuantity: bigint;
    imageUrls: Array<string>;
    name: string;
    priceInPaisa: bigint;
    description: string;
    category: Category;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface OrderItem {
    priceInPaisa: bigint;
    productId: bigint;
    quantity: bigint;
    warranty: Warranty;
}
export interface CartInput {
    productId: bigint;
    quantity: bigint;
    warranty: Warranty;
}
export interface Order {
    id: bigint;
    paymentStatus: string;
    totalAmountInPaisa: bigint;
    user: Principal;
    orderDate: Time;
    items: Array<OrderItem>;
    stripeSessionId: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
    warranty: Warranty;
}
export interface Product {
    id: bigint;
    stockQuantity: bigint;
    imageUrls: Array<string>;
    name: string;
    priceInPaisa: bigint;
    description: string;
    category: Category;
}
export enum Category {
    ram = "ram",
    ssd = "ssd",
    accessory = "accessory",
    screen = "screen",
    keyboard = "keyboard",
    battery = "battery"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Warranty {
    twelveMonths = "twelveMonths",
    sixMonths = "sixMonths"
}
export interface backendInterface {
    addToCart(input: CartInput): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrder(stripeSessionId: string): Promise<bigint>;
    createProduct(input: ProductInput): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getOrder(id: bigint): Promise<Order>;
    getProduct(id: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserOrders(): Promise<Array<Order>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    ordersCount(): Promise<bigint>;
    productCount(): Promise<bigint>;
    removeCartItem(productId: bigint, warranty: Warranty): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCartItem(productId: bigint, warranty: Warranty, quantity: bigint): Promise<void>;
    updateOrderStatus(id: bigint, status: string): Promise<void>;
    updateProduct(id: bigint, input: ProductInput): Promise<void>;
    uploadImage(): Promise<string>;
}
