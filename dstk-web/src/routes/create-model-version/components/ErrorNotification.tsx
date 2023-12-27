export type ErrorNotificationProps = {
    message: string;
};

export const ErrorNotification = ({ message }: ErrorNotificationProps) => {
    return (
        <div className='p-1'>
            <p className='text-sm text-gray-500'>{message}</p>
        </div>
    );
};
