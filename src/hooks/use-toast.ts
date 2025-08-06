import Toast from 'react-native-toast-message';

type ToastVariant = 'default' | 'destructive';

interface ToastProps {
  variant?: ToastVariant;
  title: string;
  description?: string;
}

export const useToast = () => {
  const toast = ({ variant = 'default', title, description }: ToastProps) => {
    
    const type = variant === 'destructive' ? 'error' : 'success';

    Toast.show({
      type: type,
      text1: title,
      text2: description,
      position: 'bottom',
      visibilityTime: 4000,
    });
  };

  return { toast };
};