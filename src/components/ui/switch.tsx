import * as React from "react"
import { Switch as RNSwitch, SwitchProps as RNSwitchProps, View } from "react-native"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof RNSwitch>,
  RNSwitchProps & { className?: string }
>(({ className, ...props }, ref) => (
  <View className={cn("items-start", className)}>
    <RNSwitch
      ref={ref}
      trackColor={{ false: "#767577", true: "hsl(var(--primary))" }}
      thumbColor={"#f4f3f4"}
      {...props}
    />
  </View>
))
Switch.displayName = "Switch"

export { Switch }