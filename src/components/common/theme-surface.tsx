import React from "react";
import { getBgColor, getTextColor, getBorderColor } from "@/utils/theme-helpers";

interface ThemeSurfaceProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  variant?: 'background' | 'card' | 'secondary';
  textVariant?: 'foreground' | 'muted' | 'primary' | 'accent';
  withBorder?: boolean;
  as?: React.ElementType;
}

export function ThemeSurface({
  variant = 'background',
  textVariant = 'foreground',
  withBorder = false,
  as: Component = 'div',
  className = '',
  children,
  ...props
}: ThemeSurfaceProps) {
  const bgClass = getBgColor(variant);
  const textClass = getTextColor(textVariant);
  const borderClass = withBorder ? `border ${getBorderColor()}` : '';

  return (
    <Component
      className={`${bgClass} ${textClass} ${borderClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export default ThemeSurface;
