import { Link } from '@tanstack/react-router';
import { ArrowRight, Package, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetProducts } from '../hooks/useQueries';
import type { Product } from '../backend';
import { formatPrice, categoryLabels } from '../utils/format';

export default function HomePage() {
  const { data: products = [], isLoading } = useGetProducts();
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">Premium Laptop Components</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Upgrade Your Laptop with{' '}
              <span className="text-primary">Quality Parts</span>
            </h1>
            <p className="text-lg text-muted-foreground text-balance max-w-2xl">
              From RAM to screens, batteries to keyboards - find authentic replacement parts
              for your laptop with warranty protection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link to="/products">
                <Button size="lg" className="group font-medium">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </section>

      <section className="py-16 border-b bg-gradient-to-b from-muted/20 to-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <Badge className="mb-4">Featured Category</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Quality Laptop Keyboards
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Wide selection of replacement keyboards for various laptop models. From ThinkPad to Dell, all keyboards come with quality assurance and your choice of 6 or 12-month warranty.
              </p>
              <Link to="/products">
                <Button size="lg" variant="outline" className="group">
                  Shop Keyboards
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative rounded-lg overflow-hidden shadow-xl border border-border/40">
                <img 
                  src="/assets/uploads/8o978-1.jpg" 
                  alt="Laptop Keyboard Collection"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Quick shipping across India for all orders
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold">6 & 12 Month Warranty</h3>
              <p className="text-sm text-muted-foreground">
                Choose your warranty period at checkout
              </p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold">Genuine Parts</h3>
              <p className="text-sm text-muted-foreground">
                Authentic components from trusted suppliers
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-1">
              <div className="relative rounded-lg overflow-hidden shadow-xl border border-border/40">
                <img 
                  src="/assets/uploads/df8g-1.jpg" 
                  alt="Laptop Screen Collection"
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="order-2">
              <Badge className="mb-4">Featured Category</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Premium Laptop Screens
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                High-quality replacement screens for all major laptop brands. Each display panel comes with precise specifications and your choice of 6 or 12-month warranty coverage.
              </p>
              <Link to="/products">
                <Button size="lg" variant="outline" className="group">
                  Shop Screens
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b bg-gradient-to-b from-muted/20 to-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <Badge className="mb-4">Featured Category</Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Reliable Laptop Batteries
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Long-lasting replacement batteries for all major laptop brands. Each battery is tested for quality and performance, backed by your choice of 6 or 12-month warranty for complete peace of mind.
              </p>
              <Link to="/products">
                <Button size="lg" variant="outline" className="group">
                  Shop Batteries
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative rounded-lg overflow-hidden shadow-xl border border-border/40">
                <img 
                  src="/assets/uploads/1761488567810-WEB_10-1-1.png" 
                  alt="Laptop Battery Collection"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="flex flex-col gap-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                  Featured Products
                </h2>
                <p className="text-muted-foreground mt-2">
                  Top picks from our inventory
                </p>
              </div>
              <Link to="/products">
                <Button variant="ghost" className="group">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const inStock = Number(product.stockQuantity) > 0;

  return (
    <Link to="/products/$productId" params={{ productId: product.id.toString() }}>
      <Card className="overflow-hidden group hover:shadow-glow transition-all duration-300 border-border/60 hover:border-primary/40">
        <div className="relative aspect-square bg-muted overflow-hidden">
          {product.imageUrls.length > 0 ? (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={inStock ? 'default' : 'secondary'} className="font-mono text-xs">
              {inStock ? 'IN STOCK' : 'OUT OF STOCK'}
            </Badge>
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {categoryLabels[product.category]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-display font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-mono text-lg font-semibold text-primary">
              {formatPrice(product.priceInPaisa)}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              QTY: {product.stockQuantity.toString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
