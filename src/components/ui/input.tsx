import * as React from "react"
import { TextInput, TextInputProps } from "react-native"
import { cn } from "@/lib/utils"

export interface InputProps extends TextInputProps {
  className?: string;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )}
        // Ensure placeholder text color is applied correctly on native
        placeholderTextColor="hsl(var(--muted-foreground))"
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }