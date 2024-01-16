import { Button } from '@/components/ui';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useCreateAPIKey } from '../api';

export const NoAPIKeysFound = () => {
    const [createAPIKey, { loading }] = useCreateAPIKey();

    return (
        <div className='flex items-center text-center border rounded-lg h-96'>
            <div className='flex flex-col items-center gap-3 w-full max-w-sm px-4 mx-auto'>
                <div className='p-3 mx-auto text-blue-500 bg-blue-100 rounded-full'>
                    <MagnifyingGlassIcon className='w-6 h-6' />
                </div>
                <h3 className='text-lg text-gray-800'>No Api Keys Found</h3>
                <Button className='max-w-fit' loading={loading} onClick={() => createAPIKey()}>
                    Create API Key
                </Button>
            </div>
        </div>
    );
};
