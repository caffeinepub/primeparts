import { Link } from '@tanstack/react-router';
import { Package, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetUserOrders } from '../hooks/useQueries';
import { formatPrice } from '../utils/format';

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useGetUserOrders();
  const sortedOrders = [...orders].sort((a, b) => Number(b.orderDate - a.orderDate));

  if (isLoading) {
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

  if (orders.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
          <Link to="/products">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-8">
          Your Orders
        </h1>

        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const orderDate = new Date(Number(order.orderDate) / 1000000);
            
            return (
              <Link key={order.id.toString()} to="/orders/$orderId" params={{ orderId: order.id.toString() }}>
                <Card className="hover:shadow-glow transition-all duration-300 border-border/60 hover:border-primary/40 group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-semibold">
                            Order #{order.id.toString()}
                          </h3>
                          <Badge variant="outline" className="font-mono text-xs">
                            {order.paymentStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {orderDate.toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="font-mono font-semibold text-primary text-lg">
                        {formatPrice(order.totalAmountInPaisa)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
