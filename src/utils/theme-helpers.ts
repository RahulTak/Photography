export function getTextColor(variant: 'foreground' | 'muted' | 'primary' | 'accent' = 'foreground'): string {
  switch (variant) {
    case 'muted':
      return 'text-muted';
    case 'primary':
      return 'text-primary';
    case 'accent':
      return 'text-accent';
    case 'foreground':
    default:
      return 'text-foreground';
  }
}

export function getBgColor(variant: 'background' | 'card' | 'secondary' = 'background'): string {
  switch (variant) {
    case 'card':
      return 'bg-card';
    case 'secondary':
      return 'bg-secondary';
    case 'background':
    default:
      return 'bg-background';
  }
}

export function getBorderColor(): string {
  return 'border-border';
}

export function getSurfaceClass(variant: 'background' | 'card' | 'secondary' = 'background'): string {
  return getBgColor(variant);
}

export function getTextClass(variant: 'foreground' | 'muted' | 'primary' | 'accent' = 'foreground'): string {
  return getTextColor(variant);
}

export function getBorderClass(): string {
  return 'border-border';
}

export function getInputClass(): string {
  return 'bg-background border border-border focus:border-accent text-foreground px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors placeholder:text-muted/50 w-full disabled:opacity-50 disabled:cursor-not-allowed';
}

export function getButtonClass(variant: 'primary' | 'secondary' | 'destructive' = 'primary'): string {
  switch (variant) {
    case 'secondary':
      return 'bg-secondary hover:bg-secondary/90 border border-border text-foreground font-semibold px-6 py-2.5 rounded-sm text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
    case 'destructive':
      return 'bg-red-600 hover:bg-red-700 text-white border border-transparent font-semibold px-6 py-2.5 rounded-sm text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
    case 'primary':
    default:
      return 'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-sm text-xs uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  }
}

