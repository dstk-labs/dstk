import { Modal as ModalPrimitive } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

type ModalProps = {
  disabled?: boolean;
} & Omit<
  React.ComponentProps<typeof ModalPrimitive>,
  "fullScreen" | "transitionProps"
>;

export function Modal({ disabled = false, onClose, size = 520, ...props }: ModalProps) {
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const handleClose = () => {
    if (!disabled && onClose) {
      onClose();
    }
  };

  return (
    <ModalPrimitive
      closeOnClickOutside={!disabled}
      closeOnEscape={!disabled}
      fullScreen={isSmallScreen}
      onClose={handleClose}
      size={size}
      transitionProps={
        isSmallScreen ? { duration: 200, transition: "fade" } : {}
      }
      {...props}
    />
  );
}
