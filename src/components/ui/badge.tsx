import * as React from 'react';
import { Text, View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5', {
  variants: {
    variant: {
      default: 'border-transparent bg-primary',
      secondary: 'border-transparent bg-secondary',
      destructive: 'border-transparent bg-destructive',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const badgeTextVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends ViewProps, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  const { children, ...viewProps } = props;
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...viewProps}>
      <Text className={cn(badgeTextVariants({ variant }))}>{children}</Text>
    </View>
  );
}

export { Badge, badgeVariants };
