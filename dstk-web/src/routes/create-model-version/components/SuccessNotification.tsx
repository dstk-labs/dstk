export type SuccessNotificationProps = {
    modelId: string;
    modelVersionId: string;
    numericVersion: number;
};

export const SuccessNotification = ({
    modelId,
    modelVersionId,
    numericVersion,
}: SuccessNotificationProps) => {
    return (
        <div className='pt-1 flex flex-col gap-3'>
            <p className='text-sm text-gray-500'>
                Model Version {numericVersion} successfully registered.
            </p>
            <a
                className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
                href={`/dashboard/models/${modelId}/${modelVersionId}/upload`}
            >
                Upload Artifacts
            </a>
        </div>
    );
};
