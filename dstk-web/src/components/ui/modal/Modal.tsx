import { cn } from '@/lib';
import {
    Close,
    Content,
    Description,
    Overlay,
    Portal,
    Root,
    Title,
    Trigger,
} from '@radix-ui/react-dialog';
import { forwardRef } from 'react';

export type ModalProps = React.ComponentPropsWithoutRef<typeof Root>;

export const Modal = (props: ModalProps) => {
    return <Root {...props} />;
};
Modal.displayName = 'Modal';

export const ModalTrigger = Trigger;
ModalTrigger.displayName = 'ModalTrigger';

export const ModalClose = Close;
ModalClose.displayName = 'ModalClose';

export const ModalPortal = Portal;
ModalPortal.displayName = 'ModalPortal';

export type ModalOverlayProps = React.ComponentPropsWithoutRef<typeof Overlay>;

export const ModalOverlay = forwardRef<React.ElementRef<typeof Overlay>, ModalOverlayProps>(
    ({ className, ...props }, forwardedRef) => {
        return (
            <Overlay
                ref={forwardedRef}
                className={cn(
                    // base
                    'fixed inset-0 z-50 overflow-y-auto',
                    // background color
                    'bg-black/70',
                    // transition
                    'data-[state=open]:animate-dialogOverlayShow',
                    className,
                )}
                {...props}
            />
        );
    },
);
ModalOverlay.displayName = 'ModalOverlay';

export type ModalContentProps = React.ComponentPropsWithoutRef<typeof Content>;

export const ModalContent = forwardRef<React.ElementRef<typeof Content>, ModalContentProps>(
    ({ className, ...props }, forwardedRef) => {
        return (
            <ModalPortal>
                <ModalOverlay>
                    <Content
                        ref={forwardedRef}
                        className={cn(
                            // base
                            'fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md border p-6 shadow-lg',
                            // border color
                            'border-gray-200 dark:border-gray-900',
                            // background color
                            'bg-white dark:bg-[#090E1A]',
                            // transition
                            'data-[state=open]:animate-dialogContentShow',
                            // focus
                            'outline outline-offset-2 outline-0 focus-visible:outline-2',
                            // focus outline color
                            'outline outline-offset-2 outline-0 focus-visible:outline-2',
                            className,
                        )}
                        tremor-id='tremor-raw'
                        {...props}
                    />
                </ModalOverlay>
            </ModalPortal>
        );
    },
);
ModalContent.displayName = 'ModalContent';

export type ModalHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const ModalHeader = ({ className, ...props }: ModalHeaderProps) => {
    return <div className={cn('flex flex-col gap-y-1', className)} {...props} />;
};
ModalHeader.displayName = 'ModalHeader';

export type ModalTitleProps = React.ComponentPropsWithoutRef<typeof Title>;

export const ModalTitle = forwardRef<React.ElementRef<typeof Title>, ModalTitleProps>(
    ({ className, ...props }, forwardedRef) => (
        <Title
            ref={forwardedRef}
            className={cn(
                // base
                'text-lg font-semibold',
                // text color
                'text-gray-900 dark:text-gray-50',
                className,
            )}
            {...props}
        />
    ),
);
ModalTitle.displayName = 'ModalTitle';

export type ModalDescriptionProps = React.ComponentPropsWithoutRef<typeof Description>;

export const ModalDescription = forwardRef<
    React.ElementRef<typeof Description>,
    ModalDescriptionProps
>(({ className, ...props }, forwardedRef) => {
    return (
        <Description
            ref={forwardedRef}
            className={cn('text-gray-500 dark:text-gray-500', className)}
            {...props}
        />
    );
});
ModalDescription.displayName = 'ModalDescription';

export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const ModalFooter = ({ className, ...props }: ModalFooterProps) => {
    return (
        <div
            className={cn(
                'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
                className,
            )}
            {...props}
        />
    );
};
ModalFooter.displayName = 'DialogFooter';
