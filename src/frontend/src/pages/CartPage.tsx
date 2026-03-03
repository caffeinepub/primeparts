import { Link } from '@tanstack/react-router';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useGetCart, useGetProducts, useUpdateCartItem, useRemoveCartItem } from '../hooks/useQueries';
import { formatPrice, warrantyLabels, calculateWarrantyPrice } from '../utils/format';

export default function CartPage() {
  const { data: cartItems = [], isLoading: cartLoading } = useGetCart();
  const { data: products = [] } = useGetProducts();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const cartWithProducts = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const total = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = calculateWarrantyPrice(item.product.priceInPaisa, item.warranty);
    return sum + (Number(price) * Number(item.quantity));
  }, 0);

  const handleUpdateQuantity = async (productId: bigint, warranty: any, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    try {
      await updateItem.mutateAsync({ productId, warranty, quantity: BigInt(newQty) });
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (productId: bigint, warranty: any) => {
    try {
      await removeItem.mutateAsync({ productId, warranty });
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (cartLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-muted rounded animate-pulse w-48 mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-24 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cartWithProducts.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started</p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartWithProducts.map((item) => {
              const product = item.product!;
              const price = calculateWarrantyPrice(product.priceInPaisa, item.warranty);
              const subtotal = Number(price) * Number(item.quantity);

              return (
                <Card key={`${product.id}-${item.warranty}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted rounded shrink-0 overflow-hidden">
                        {product.imageUrls[0] ? (
                          <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-display font-semibold">{product.name}</h3>
                            <Badge variant="outline" className="mt-1">
                              {warrantyLabels[item.warranty]}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(product.id, item.warranty)}
                            disabled={removeItem.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(product.id, item.warranty, Number(item.quantity), -1)}
                              disabled={Number(item.quantity) <= 1 || updateItem.isPending}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-mono w-12 text-center">{item.quantity.toString()}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(product.id, item.warranty, Number(item.quantity), 1)}
                              disabled={updateItem.isPending}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="font-mono font-semibold text-primary">
                              {formatPrice(BigInt(subtotal))}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {formatPrice(price)} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="font-display">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">{formatPrice(BigInt(total))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-mono">Calculated at checkout</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="font-display">Total</span>
                    <span className="font-mono text-primary text-xl">
                      {formatPrice(BigInt(total))}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/checkout" className="w-full">
                  <Button size="lg" className="w-full group">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
