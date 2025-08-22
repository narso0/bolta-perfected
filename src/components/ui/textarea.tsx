import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextInputProps {
  className?: string;
}

const Textarea = React.forwardRef<TextInput, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2',
        className,
      )}
      style={{ textAlignVertical: 'top' }} // This aligns the text to the top, which is better for textareas
      multiline={true} // This is the key prop that allows multiple lines
      placeholderTextColor="hsl(var(--muted-foreground))"
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
