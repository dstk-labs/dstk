import { cn } from '@/lib/cn';

type TooltipProps = {
    children: React.ReactNode;
    isVisible: boolean;
    message: string;
};

export const Tooltip = ({ children, isVisible, message }: TooltipProps) => {
    return (
        <div className='relative w-max'>
            {children}
            <span
                className={cn(
                    'pointer-events-none absolute -top-7 left-0 w-max rounded bg-gray-900 px-2 py-1 text-sm font-medium text-gray-50 shadow transition-opacity',
                    isVisible ? 'opacity-100' : 'opacity-0',
                )}
            >
                {message}
            </span>
        </div>
    );
};
