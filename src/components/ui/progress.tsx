import * as React from "react"
import { View, ViewProps } from "react-native"
import { cn } from "@/lib/utils"

interface ProgressProps extends ViewProps {
  value?: number
}

const Progress = React.forwardRef<React.ElementRef<typeof View>, ProgressProps>(
  ({ className, value, ...props }, ref) => {
    const progressValue = value ? Math.max(0, Math.min(100, value)) : 0;
    
    return (
      <View
        ref={ref}
        className={cn("h-3 w-full overflow-hidden rounded-full bg-muted", className)}
        {...props}
      >
        <View
          className="h-full w-full flex-1 bg-primary"
          style={{ width: `${progressValue}%` }}
        />
      </View>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }