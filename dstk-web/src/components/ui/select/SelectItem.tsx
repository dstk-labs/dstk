import { cn } from '@/lib/cn';

export type SelectItemProps = {
    children: React.ReactNode;
} & React.OptionHTMLAttributes<HTMLOptionElement>;

export const SelectItem = ({ children, className, ...props }: SelectItemProps) => {
    return (
        <option className={cn(className)} {...props}>
            {children}
        </option>
    );
};
