import { Link } from '@tanstack/react-router';
import { ShoppingCart, User, Menu, Sun, Moon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCart } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { login, clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: cartItems = [] } = useGetCart();
  const cartItemCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      await login();
    }
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className="text-sm font-medium transition-colors hover:text-primary"
        activeProps={{ className: 'text-primary' }}
      >
        Home
      </Link>
      <Link
        to="/products"
        className="text-sm font-medium transition-colors hover:text-primary"
        activeProps={{ className: 'text-primary' }}
      >
        Products
      </Link>
      {isAuthenticated && (
        <>
          <Link
            to="/orders"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeProps={{ className: 'text-primary' }}
          >
            Orders
          </Link>
          <Link
            to="/admin"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeProps={{ className: 'text-primary' }}
          >
            Admin
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-sm group-hover:bg-primary/30 transition-colors" />
              <div className="relative flex h-8 w-8 items-center justify-center bg-primary rounded-sm">
                <ChevronRight className="h-5 w-5 text-primary-foreground" strokeWidth={3} />
              </div>
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Prime<span className="text-primary">Parts</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-mono"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleAuth}>
                {isAuthenticated ? 'Logout' : 'Login'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
