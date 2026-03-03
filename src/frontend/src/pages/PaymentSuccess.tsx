import { useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PaymentSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    console.log('Payment successful, session:', sessionId);
  }, []);

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Your order has been placed successfully. You'll receive a confirmation shortly.
        </p>
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              You can track your order status in your orders page.
            </p>
          </CardContent>
        </Card>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders">
            <Button size="lg">View Orders</Button>
          </Link>
          <Link to="/products">
            <Button size="lg" variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
