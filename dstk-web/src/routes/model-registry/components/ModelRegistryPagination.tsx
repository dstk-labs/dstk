import { useAtom } from 'jotai';

import { Button } from '@/components/ui';

import { modelRegistryPaginationAtom } from '../atoms';

type ModelRegistryPaginationProps = {
    continuationToken: string;
};

export const ModelRegistryPagination = ({ continuationToken }: ModelRegistryPaginationProps) => {
    const [inputs, setInputs] = useAtom(modelRegistryPaginationAtom);

    const handlePrevPage = () =>
        setInputs((values) => ({
            ...values,
            continuationTokens: values.continuationTokens.slice(0, -1),
        }));

    const handleNextPage = () =>
        setInputs((values) => ({
            ...values,
            continuationTokens: [...values.continuationTokens, continuationToken],
        }));

    return (
        <div className='flex items-center justify-end gap-x-3'>
            <Button
                variant='secondary'
                disabled={!inputs.hasPreviousPage}
                onClick={() => handlePrevPage()}
            >
                Previous
            </Button>
            <Button
                variant='secondary'
                disabled={!inputs.hasNextPage}
                onClick={() => handleNextPage()}
            >
                Next
            </Button>
        </div>
    );
};
