import * as React from "react"
import { View, Text, Pressable, ViewProps, PressableProps } from "react-native"
import { cn } from "@/lib/utils"

// Context to share the active tab's value
interface TabsContextType {
  value: string
  setValue: (value: string) => void
}
const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

const useTabs = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("useTabs must be used within a Tabs component")
  }
  return context
}

// Root component that manages the state
const Tabs = ({
  defaultValue,
  ...props
}: ViewProps & { defaultValue: string }) => {
  const [value, setValue] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <View {...props} />
    </TabsContext.Provider>
  )
}

// A styled container for the tab buttons
const TabsList = React.forwardRef<React.ElementRef<typeof View>, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1",
        className
      )}
      style={{ flexDirection: 'row' }}
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

// The actual tab button
interface TabsTriggerProps extends Omit<PressableProps, "children"> {
  value: string
  children: React.ReactNode
}
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  TabsTriggerProps
>(({ className, value, children, ...props }, ref) => {
  const { value: activeValue, setValue } = useTabs()
  const isActive = activeValue === value

  return (
    <Pressable
      ref={ref}
      onPress={() => setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium",
        isActive && "bg-background shadow-sm",
        className
      )}
      {...props}
    >
      <Text className={cn("text-muted-foreground", isActive && "text-foreground")}>
        {children}
      </Text>
    </Pressable>
  )
})
TabsTrigger.displayName = "TabsTrigger"

// The content panel that shows when a tab is active
interface TabsContentProps extends ViewProps {
  value: string
}
const TabsContent = React.forwardRef<
  React.ElementRef<typeof View>,
  TabsContentProps
>(({ className, value, ...props }, ref) => {
  const { value: activeValue } = useTabs()
  const isActive = activeValue === value
  
  if (!isActive) return null
  
  return <View ref={ref} className={cn("mt-2", className)} {...props} />
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }