import { BarLoader } from 'react-spinners';

import { UserNavigation } from '@/components/settings';

import { useListAPIKeys } from './api';
import { APIKeysHeader, APIKeysCard, ArchiveModal, NoAPIKeysFound } from './components';

export const APIKeys = () => {
    const { data, loading, error } = useListAPIKeys();

    if (error) {
        return <p>Failed loading the API keys.</p>;
    }

    if (loading) {
        return <BarLoader color='#2563eb' width='250px' />;
    }

    if (data && data.listApiKeys) {
        return (
            <>
                <div className='w-full flex flex-col gap-6'>
                    <APIKeysHeader />
                    <UserNavigation />
                    {data.listApiKeys.length === 0 ? (
                        <NoAPIKeysFound />
                    ) : (
                        <APIKeysCard apiKeys={data.listApiKeys} />
                    )}
                </div>
                <ArchiveModal />
            </>
        );
    } else {
        return null;
    }
};
