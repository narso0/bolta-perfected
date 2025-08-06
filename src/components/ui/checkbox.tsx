import * as React from "react"
import { Pressable, View, PressableProps } from "react-native"
import { Check } from "lucide-react-native"
import { cn } from "@/lib/utils"

interface CheckboxProps extends PressableProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
  iconClassName?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  CheckboxProps
>(({ className, checked, onCheckedChange, iconClassName, ...props }, ref) => (
  <Pressable
    ref={ref}
    onPress={() => onCheckedChange(!checked)}
    className={cn(
      "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      checked && "bg-primary",
      className
    )}
    {...props}
  >
    {checked && (
      <View className="flex items-center justify-center h-full w-full">
        <Check className={cn("h-4 w-4 text-primary-foreground", iconClassName)} />
      </View>
    )}
  </Pressable>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }