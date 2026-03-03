import { Link } from '@tanstack/react-router';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PaymentFailure() {
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">Payment Failed</h1>
        <p className="text-muted-foreground mb-8">
          Your payment was not completed. Please try again or contact support if the issue persists.
        </p>
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              Your cart items have been saved. You can return to checkout when you're ready.
            </p>
          </CardContent>
        </Card>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/checkout">
            <Button size="lg">Try Again</Button>
          </Link>
          <Link to="/cart">
            <Button size="lg" variant="outline">View Cart</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
