import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useGetCart, useGetProducts, useCreateCheckoutSession } from '../hooks/useQueries';
import { formatPrice, warrantyLabels, calculateWarrantyPrice } from '../utils/format';
import type { ShoppingItem } from '../backend';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartItems = [] } = useGetCart();
  const { data: products = [] } = useGetProducts();
  const createSession = useCreateCheckoutSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartWithProducts = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const total = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = calculateWarrantyPrice(item.product.priceInPaisa, item.warranty);
    return sum + (Number(price) * Number(item.quantity));
  }, 0);

  const handleCheckout = async () => {
    if (cartWithProducts.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const shoppingItems: ShoppingItem[] = cartWithProducts.map(item => ({
        productName: item.product!.name,
        productDescription: `${item.product!.description} - ${warrantyLabels[item.warranty]}`,
        priceInCents: BigInt(Math.round(Number(calculateWarrantyPrice(item.product!.priceInPaisa, item.warranty)))),
        quantity: item.quantity,
        currency: 'inr',
      }));

      const session = await createSession.mutateAsync(shoppingItems);
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session');
      setIsProcessing(false);
    }
  };

  if (cartWithProducts.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products before checking out</p>
        <Button onClick={() => navigate({ to: '/products' })}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-8">
          Checkout
        </h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Order Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartWithProducts.map((item) => {
                const product = item.product!;
                const price = calculateWarrantyPrice(product.priceInPaisa, item.warranty);
                const subtotal = Number(price) * Number(item.quantity);

                return (
                  <div key={`${product.id}-${item.warranty}`} className="flex justify-between py-2 border-b last:border-0">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {warrantyLabels[item.warranty]} × {item.quantity.toString()}
                      </div>
                    </div>
                    <div className="font-mono font-semibold">{formatPrice(BigInt(subtotal))}</div>
                  </div>
                );
              })}

              <div className="pt-3 border-t">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="font-display">Total</span>
                  <span className="font-mono text-primary">{formatPrice(BigInt(total))}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold mb-1">Secure Payment via Stripe</h3>
                  <p className="text-sm text-muted-foreground">
                    Your payment information is encrypted and secure. You'll be redirected to Stripe to complete your purchase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            size="lg" 
            className="w-full" 
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                Pay {formatPrice(BigInt(total))}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
