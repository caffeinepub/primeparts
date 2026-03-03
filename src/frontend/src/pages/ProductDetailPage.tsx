import { useState } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { Package, ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useGetProduct, useAddToCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { formatPrice, categoryLabels, warrantyLabels, calculateWarrantyPrice } from '../utils/format';
import { Warranty } from '../backend';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' });
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: product, isLoading } = useGetProduct(BigInt(productId));
  const addToCart = useAddToCart();

  const [selectedWarranty, setSelectedWarranty] = useState<Warranty>(Warranty.sixMonths);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const inStock = Number(product.stockQuantity) > 0;
  const maxQuantity = Math.min(Number(product.stockQuantity), 10);
  const finalPrice = calculateWarrantyPrice(product.priceInPaisa, selectedWarranty);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      await login();
      return;
    }

    if (!inStock) {
      toast.error('Product is out of stock');
      return;
    }

    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: BigInt(quantity),
        warranty: selectedWarranty,
      });
      toast.success('Added to cart');
      navigate({ to: '/cart' });
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error(error);
    }
  };

  return (
    <div className="container py-8">
      <Link to="/products">
        <Button variant="ghost" className="mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Products
        </Button>
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          {product.imageUrls.length > 0 ? (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="outline" className="mb-3">
              {categoryLabels[product.category]}
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              {product.name}
            </h1>
            <p className="text-muted-foreground text-lg">
              {product.description}
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-4xl font-bold text-primary">
              {formatPrice(finalPrice)}
            </span>
            {selectedWarranty === 'twelveMonths' && (
              <span className="text-sm text-muted-foreground line-through font-mono">
                {formatPrice(product.priceInPaisa)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={inStock ? 'default' : 'secondary'} className="font-mono">
              {inStock ? 'IN STOCK' : 'OUT OF STOCK'}
            </Badge>
            {inStock && (
              <span className="text-sm text-muted-foreground font-mono">
                {product.stockQuantity.toString()} units available
              </span>
            )}
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="font-display font-semibold">Select Warranty</Label>
                <RadioGroup
                  value={selectedWarranty}
                  onValueChange={(value) => setSelectedWarranty(value as Warranty)}
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors">
                    <RadioGroupItem value={Warranty.sixMonths} id="six" />
                    <Label htmlFor="six" className="flex-1 cursor-pointer">
                      <div className="font-medium">6 Months Warranty</div>
                      <div className="text-sm text-muted-foreground">
                        Base price - {formatPrice(product.priceInPaisa)}
                      </div>
                    </Label>
                    {selectedWarranty === Warranty.sixMonths && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors">
                    <RadioGroupItem value={Warranty.twelveMonths} id="twelve" />
                    <Label htmlFor="twelve" className="flex-1 cursor-pointer">
                      <div className="font-medium">12 Months Warranty</div>
                      <div className="text-sm text-muted-foreground">
                        +10% - {formatPrice(calculateWarrantyPrice(product.priceInPaisa, Warranty.twelveMonths))}
                      </div>
                    </Label>
                    {selectedWarranty === Warranty.twelveMonths && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="quantity" className="font-display font-semibold">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                  disabled={!inStock}
                />
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={!inStock || addToCart.isPending}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
