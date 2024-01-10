import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const NoModelsFound = () => {
    return (
        <div className='flex items-center mt-6 text-center border rounded-lg h-96'>
            <div className='flex flex-col w-full max-w-sm px-4 mx-auto'>
                <div className='p-3 mx-auto text-blue-500 bg-blue-100 rounded-full'>
                    <MagnifyingGlassIcon className='w-6 h-6' />
                </div>
                <h1 className='mt-3 text-lg text-gray-800'>No Models Found</h1>
                <p className='mt-2 text-gray-500'>
                    Please update the search criteria or create a new model.
                </p>
            </div>
        </div>
    );
};
