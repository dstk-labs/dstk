import { ModelRegistryData } from '@/features/model/components/ModelRegistryData';
import { Suspense, useState, useTransition } from 'react';
import { type Limit } from '@/types/filters';
import { ModelRegistrySkeleton } from './components/ModelRegistrySkeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button, Input } from '@/components/ui';
import { RiLayoutGridLine, RiListUnordered } from '@remixicon/react';

export const ModelRegistry = () => {
    const [continuationTokens, setContinuationTokens] = useState<(string | undefined)[]>([]);
    const [limit, setLimit] = useState<Limit>(10);
    const [isPending, startTransition] = useTransition();
    const [modelName, setModelName] = useState<string>();

    return (
        <Tabs defaultValue='grid'>
            <div className='flex flex-col gap-4'>
                <h3 className='text-xl tracking-tight font-medium text-gray-900 dark:text-gray-50'>
                    Models
                </h3>
                <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-center sm:justify-between'>
                    <Input
                        className='max-w-md'
                        onChange={(e) =>
                            startTransition(() => {
                                setModelName(e.target.value);
                            })
                        }
                        placeholder='Search for models...'
                        value={modelName ?? ''}
                    />
                    <div className='flex items-center gap-4'>
                        <div className='-mx-1'>
                            <TabsList variant='solid'>
                                <TabsTrigger value='grid'>
                                    <RiLayoutGridLine />
                                </TabsTrigger>
                                <TabsTrigger value='table'>
                                    <RiListUnordered />
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <Button size='lg'>Add Model</Button>
                    </div>
                </div>
            </div>
            <Suspense fallback={<ModelRegistrySkeleton numCards={9} />}>
                <ModelRegistryData
                    after={continuationTokens.at(-1)}
                    first={limit}
                    isPending={isPending}
                    modelName={modelName}
                    setContinuationTokens={setContinuationTokens}
                    setLimit={setLimit}
                    startTransition={startTransition}
                />
            </Suspense>
        </Tabs>
    );
};
