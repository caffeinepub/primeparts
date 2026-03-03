import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  Product, 
  ProductInput, 
  Category, 
  CartItem, 
  CartInput, 
  Order, 
  UserRole,
  StripeConfiguration,
  Warranty,
  ShoppingItem
} from '../backend';

// Products
export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetProductsByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useSearchProducts(searchTerm: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products', 'search', searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm) return [];
      return actor.searchProducts(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.length > 0,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProductInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: ProductInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUploadImage() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadImage();
    },
  });
}

// Cart
export function useGetCart() {
  const { actor, isFetching } = useActor();
  return useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CartInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, warranty, quantity }: { productId: bigint; warranty: Warranty; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCartItem(productId, warranty, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, warranty }: { productId: bigint; warranty: Warranty }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeCartItem(productId, warranty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

// Orders
export function useGetUserOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['orders', 'user'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['orders', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrder(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Order | null>({
    queryKey: ['order', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getOrder(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stripeSessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(stripeSessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Stripe
export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['stripe', 'configured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stripe'] });
    },
  });
}

// Auth
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) return 'guest' as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
