import { Root } from '@radix-ui/react-tabs';

export type TabsProps = Omit<React.ComponentPropsWithoutRef<typeof Root>, 'orientation'>;

export const Tabs = ({ children, ...props }: TabsProps) => {
    return <Root {...props}>{children}</Root>;
};
