import { Card, Divider, Skeleton } from '@/components/ui';

export type ModelRegistrySkeletonProps = {
    numCards: number;
};

export const ModelRegistrySkeleton = ({ numCards }: ModelRegistrySkeletonProps) => {
    return (
        <>
            <Divider className='my-4' />
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {[...Array(numCards).keys()].map((card) => (
                    <Card key={card}>
                        <div className='flex items-center justify-between gap-4'>
                            <Skeleton className='w-36 h-5' />
                            <Skeleton className='w-4 h-5' />
                        </div>
                        <div className='mt-3'>
                            <Skeleton className='w-44 h-6' />
                        </div>
                        <div className='mt-4'>
                            <Skeleton className='w-28 h-4' />
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
};
