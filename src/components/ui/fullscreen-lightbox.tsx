import { X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FullscreenLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function FullscreenLightbox({ 
  isOpen, 
  onClose, 
  title, 
  children,
  actions 
}: FullscreenLightboxProps) {
  if (!isOpen) return null;

  return (
    <div className="fullscreen-lightbox animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Инструкция
            </Button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-8">
        {children}
      </div>

      {/* Actions footer */}
      {actions && (
        <div className="sticky bottom-0 bg-background border-t border-border py-4">
          <div className="max-w-5xl mx-auto px-8 flex justify-end gap-3">
            {actions}
          </div>
        </div>
      )}
    </div>
  );
}
