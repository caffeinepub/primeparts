import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetOrder, useGetProducts } from '../hooks/useQueries';
import { formatPrice, warrantyLabels } from '../utils/format';

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/orders/$orderId' });
  const { data: order, isLoading } = useGetOrder(BigInt(orderId));
  const { data: products = [] } = useGetProducts();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-muted rounded animate-pulse w-64 mb-8" />
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-32 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
        <Link to="/orders">
          <Button>View All Orders</Button>
        </Link>
      </div>
    );
  }

  const orderDate = new Date(Number(order.orderDate) / 1000000);

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/orders">
          <Button variant="ghost" className="mb-6 group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Orders
          </Button>
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              Order #{order.id.toString()}
            </h1>
            <p className="text-muted-foreground mt-1">
              Placed on {orderDate.toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <Badge variant="outline" className="font-mono">
            {order.paymentStatus}
          </Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                
                return (
                  <div key={idx} className="flex justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <div className="font-medium">
                        {product?.name || `Product ID: ${item.productId.toString()}`}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {warrantyLabels[item.warranty]} × {item.quantity.toString()}
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-right">
                      {formatPrice(item.priceInPaisa * item.quantity)}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatPrice(order.totalAmountInPaisa)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="font-display">Total</span>
                  <span className="font-mono text-primary">{formatPrice(order.totalAmountInPaisa)}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground pt-2">
                Stripe Session: <span className="font-mono text-xs">{order.stripeSessionId}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
