import { useAtom, useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

import { archiveModalOpenAtom, selectedModelAtom } from './atoms';
import { useListModels } from './api';
import {
    ArchiveModal,
    ModelRegistryFilters,
    ModelRegistryHeader,
    ModelRegistryPagination,
    ModelRegistryTable,
    NoModelsFound,
} from './components';

export const ModelRegistry = () => {
    const [archiveModalOpen, setArchiveModalOpen] = useAtom(archiveModalOpenAtom);
    const selectedModel = useAtomValue(selectedModelAtom);

    const navigate = useNavigate();

    const { data, loading, error } = useListModels();

    if (error) return <NoModelsFound />;

    return (
        <>
            <div className='w-full flex flex-col gap-12'>
                <ModelRegistryHeader navigateFn={navigate} />
                <div className='flex flex-col gap-4'>
                    <ModelRegistryFilters />
                    {!loading ? (
                        <div className='flex flex-col gap-6'>
                            {data!.listMLModels.edges.length === 0 ? (
                                <NoModelsFound />
                            ) : (
                                <ModelRegistryTable data={data!} navigateFn={navigate} />
                            )}
                            <ModelRegistryPagination
                                continuationToken={data!.listMLModels.pageInfo.continuationToken}
                            />
                        </div>
                    ) : (
                        <BarLoader color='#2563eb' width='250px' />
                    )}
                </div>
            </div>
            <ArchiveModal
                model={selectedModel}
                isOpen={archiveModalOpen}
                onClose={() => setArchiveModalOpen(false)}
            />
        </>
    );
};
