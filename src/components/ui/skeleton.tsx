import * as React from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

const AnimatedView = Animated.createAnimatedComponent(View);

const Skeleton = React.forwardRef<Animated.View, ViewProps & { className?: string }>(
  ({ className, ...props }, ref) => {
    const pulse = useSharedValue(0);

    React.useEffect(() => {
      // Create a looping animation that goes from 0 to 1 and back again
      pulse.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    }, [pulse]);

    const animatedStyle = useAnimatedStyle(() => {
      // This creates a gentle pulsing opacity effect
      const opacity = 0.6 + pulse.value * 0.4; // Varies between 0.6 and 1.0
      return {
        opacity: opacity,
      };
    });

    return (
      <AnimatedView
        ref={ref}
        className={cn('rounded-md bg-muted', className)}
        style={animatedStyle}
        {...props}
      />
    );
  },
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
