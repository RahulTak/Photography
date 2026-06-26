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
