import { Modal as ModalPrimitive } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

type ModalProps = {
  disabled?: boolean;
} & Omit<
  React.ComponentProps<typeof ModalPrimitive>,
  'fullScreen' | 'transitionProps'
>;

export const Modal = ({ disabled = false, onClose, ...props }: ModalProps) => {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const handleClose = () => {
    if (!disabled && onClose) {
      onClose();
    }
  };

  return (
    <ModalPrimitive
      fullScreen={isSmallScreen}
      onClose={handleClose}
      transitionProps={
        isSmallScreen ? { duration: 200, transition: 'fade' } : {}
      }
      {...props}
    />
  );
};
