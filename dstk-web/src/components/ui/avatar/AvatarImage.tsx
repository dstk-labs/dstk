import { forwardRef } from 'react';
import { Image } from '@radix-ui/react-avatar';

import { cn } from '@/lib';

export type AvatarImageProps = React.ComponentPropsWithoutRef<typeof Image>;

export const AvatarImage = forwardRef<React.ElementRef<typeof Image>, AvatarImageProps>(
    ({ className, ...props }, ref) => (
        <Image className={cn('aspect-square h-full w-full', className)} ref={ref} {...props} />
    ),
);
AvatarImage.displayName = Image.displayName;
