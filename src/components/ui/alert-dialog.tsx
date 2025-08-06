import * as React from "react"
import { Modal, View, Text, Pressable } from "react-native"
import { Button } from "@/components/ui/button" // We'll use our native Button
import { cn } from "@/lib/utils"

// 1. Create a Context to share the modal's open/closed state
interface AlertDialogContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const AlertDialogContext = React.createContext<AlertDialogContextType | undefined>(undefined)

const useAlertDialog = () => {
  const context = React.useContext(AlertDialogContext)
  if (!context) {
    throw new Error("useAlertDialog must be used within an AlertDialog")
  }
  return context
}

// 2. Main component to provide the context
const AlertDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

// 3. The trigger component
const AlertDialogTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = useAlertDialog()
  // This clones the child (like a Button) and adds the onPress event to it
  const child = React.Children.only(children)
  return React.cloneElement(child as React.ReactElement, {
    onPress: () => setOpen(true),
  })
}

// 4. The content that appears in the modal
const AlertDialogContent = React.forwardRef<
  View,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useAlertDialog()

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        onPress={() => setOpen(false)}
        className="flex-1 justify-center items-center bg-black/60 p-4"
      >
        {/* This inner Pressable stops taps inside the modal from closing it */}
        <Pressable>
          <View
            ref={ref}
            className={cn(
              "w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg",
              className
            )}
            {...props}
          >
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
})
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View>) => (
  <View className={cn("flex flex-col space-y-2", className)} {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View>) => (
  <View
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) => (
  <Text
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
)
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Text>) => (
  <Text
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
)
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = ({
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) => <Button {...props} />
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = ({
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) => {
  const { setOpen } = useAlertDialog()
  return <Button variant="outline" onPress={() => setOpen(false)} {...props} />
}
AlertDialogCancel.displayName = "AlertDialogCancel"

// We don't need a Portal or Overlay as React Native's Modal handles this.
const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>
const AlertDialogOverlay = () => null

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogPortal,
  AlertDialogOverlay
}