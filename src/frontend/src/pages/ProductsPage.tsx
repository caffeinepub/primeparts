import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetProducts } from '../hooks/useQueries';
import type { Product } from '../backend';
import { Category } from '../backend';
import { formatPrice, categoryLabels } from '../utils/format';

const categories: Category[] = [
  Category.ram,
  Category.ssd,
  Category.screen,
  Category.battery,
  Category.keyboard,
  Category.accessory,
];

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetProducts();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            All Products
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse our complete catalog of laptop parts and accessories
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-20 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider">
                  Categories
                </h3>
                <div className="space-y-1">
                  <Button
                    variant={selectedCategory === null ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Products
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {categoryLabels[category]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-square bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id.toString()} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
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
