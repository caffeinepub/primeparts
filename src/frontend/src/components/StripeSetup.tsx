import { useEffect, useState } from 'react';
import { useIsStripeConfigured, useSetStripeConfiguration, useIsCallerAdmin } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function StripeSetup() {
  const { data: isConfigured, isLoading: checkingConfig } = useIsStripeConfigured();
  const { data: isAdmin } = useIsCallerAdmin();
  const setConfig = useSetStripeConfiguration();
  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('IN');

  useEffect(() => {
    if (!checkingConfig && isAdmin && isConfigured === false) {
      setOpen(true);
    }
  }, [isConfigured, isAdmin, checkingConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      toast.error('Please enter Stripe secret key');
      return;
    }

    try {
      await setConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries: countries.split(',').map(c => c.trim()).filter(Boolean),
      });
      toast.success('Stripe configuration saved');
      setOpen(false);
      setSecretKey('');
    } catch (error) {
      toast.error('Failed to save Stripe configuration');
      console.error(error);
    }
  };

  if (!isAdmin || isConfigured) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Stripe Payments</DialogTitle>
          <DialogDescription>
            Enter your Stripe secret key to enable payment processing for PrimeParts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              placeholder="sk_test_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
            <Input
              id="countries"
              placeholder="IN, US, GB"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use ISO 3166-1 alpha-2 country codes
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={setConfig.isPending}>
            {setConfig.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Configuration
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
