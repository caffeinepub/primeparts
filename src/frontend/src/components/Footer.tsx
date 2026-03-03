import { Heart, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-2xl font-bold text-foreground">
              PrimeParts
            </h3>
            <div className="flex items-start justify-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <address className="not-italic text-sm leading-relaxed">
                308/2 Floor, Padmavati Plaza,<br />
                KPHB, Hyderabad
              </address>
            </div>
          </div>
          
          <div className="w-full max-w-xs border-t border-border/40 pt-6">
            <p className="text-sm text-muted-foreground">
              © 2026. Built with{' '}
              <Heart className="inline h-3 w-3 text-destructive fill-destructive" />{' '}
              using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
