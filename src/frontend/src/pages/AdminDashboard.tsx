import { useState } from 'react';
import { Plus, Trash2, Edit2, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useGetAllOrders,
  useIsCallerAdmin,
} from '../hooks/useQueries';
import type { Product, ProductInput } from '../backend';
import { Category } from '../backend';
import { formatPrice, categoryLabels, toPaisa } from '../utils/format';
import { seedSampleProducts } from '../utils/seedProducts';

export default function AdminDashboard() {
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: products = [] } = useGetProducts();
  const { data: orders = [] } = useGetAllOrders();
  const createProduct = useCreateProduct();
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedProducts = async () => {
    setIsSeeding(true);
    try {
      await seedSampleProducts(createProduct.mutateAsync);
      toast.success('Sample products added successfully');
    } catch (error) {
      toast.error('Failed to add sample products');
    } finally {
      setIsSeeding(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-16 text-center">
        <h2 className="font-display text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage products, orders, and store settings
        </p>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display text-2xl font-semibold">Products</h2>
              <p className="text-sm text-muted-foreground">{products.length} total products</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleSeedProducts} 
                disabled={isSeeding}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isSeeding ? 'Adding...' : 'Seed Sample Products'}
              </Button>
              <ProductDialog mode="create" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id.toString()} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No products yet. Create your first product.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-semibold mb-1">Orders</h2>
            <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const orderDate = new Date(Number(order.orderDate) / 1000000);
                  return (
                    <TableRow key={order.id.toString()}>
                      <TableCell className="font-mono">#{order.id.toString()}</TableCell>
                      <TableCell>{orderDate.toLocaleDateString('en-IN')}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell className="font-mono">{formatPrice(order.totalAmountInPaisa)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {orders.length === 0 && (
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No orders yet.</p>
              </CardContent>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const deleteProduct = useDeleteProduct();
  const inStock = Number(product.stockQuantity) > 0;

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <Card>
      <div className="relative aspect-square bg-muted">
        {product.imageUrls[0] ? (
          <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-display font-semibold line-clamp-1">{product.name}</h3>
            <Badge variant="outline" className="mt-1">{categoryLabels[product.category]}</Badge>
          </div>
          <div className="flex gap-1">
            <ProductDialog mode="edit" product={product} />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="font-mono font-semibold text-primary">{formatPrice(product.priceInPaisa)}</span>
          <Badge variant={inStock ? 'default' : 'secondary'} className="font-mono text-xs">
            {product.stockQuantity.toString()} in stock
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductDialogProps {
  mode: 'create' | 'edit';
  product?: Product;
}

function ProductDialog({ mode, product }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product ? String(Number(product.priceInPaisa) / 100) : '');
  const [category, setCategory] = useState<Category>(product?.category || Category.accessory);
  const [stock, setStock] = useState(product ? String(product.stockQuantity) : '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrls[0] || '');

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input: ProductInput = {
      name: name.trim(),
      description: description.trim(),
      priceInPaisa: toPaisa(parseFloat(price)),
      category,
      stockQuantity: BigInt(stock),
      imageUrls: imageUrl ? [imageUrl] : [],
    };

    try {
      if (mode === 'create') {
        await createProduct.mutateAsync(input);
        toast.success('Product created');
      } else if (product) {
        await updateProduct.mutateAsync({ id: product.id, input });
        toast.success('Product updated');
      }
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error(`Failed to ${mode} product`);
    }
  };

  const resetForm = () => {
    if (mode === 'create') {
      setName('');
      setDescription('');
      setPrice('');
      setCategory(Category.accessory);
      setStock('');
      setImageUrl('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create' : 'Edit'} Product</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new product to your store' : 'Update product details'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="16GB DDR4 RAM"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-performance laptop memory module..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2500.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">Enter a direct image URL</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
              {mode === 'create' ? 'Create' : 'Update'} Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
