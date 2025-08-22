import * as React from 'react';
import { Text, TextProps } from 'react-native';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

const Label = React.forwardRef<React.ElementRef<typeof Text>, TextProps & { className?: string }>(
  ({ className, ...props }, ref) => (
    <Text ref={ref} className={cn(labelVariants(), className)} {...props} />
  ),
);
Label.displayName = 'Label';

export { Label };
