import { useAtom } from 'jotai';

import { Button } from '@/components/ui';

import { listObjectsPaginationAtom } from '../atoms';

type FileExplorerPaginationProps = {
    continuationToken: string;
};

export const FileExplorerPagination = ({ continuationToken }: FileExplorerPaginationProps) => {
    const [inputs, setInputs] = useAtom(listObjectsPaginationAtom);

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
