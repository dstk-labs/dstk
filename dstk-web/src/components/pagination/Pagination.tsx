import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import {
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui';
import { LIMITS } from '@/constants';
import type { Limit } from '@/types';

type PaginationProps = {
    continuationToken?: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isPending: boolean;
    limit: Limit;
    setContinuationTokens: React.Dispatch<React.SetStateAction<(string | undefined)[]>>;
    setLimit: React.Dispatch<React.SetStateAction<Limit>>;
    startTransition: React.TransitionStartFunction;
};

export const Pagination = ({
    continuationToken,
    hasNextPage,
    hasPreviousPage,
    isPending,
    limit,
    setContinuationTokens,
    setLimit,
    startTransition,
}: PaginationProps) => {
    return (
        <div className='flex items-center justify-between'>
            <div className='w-[175px]'>
                <Select
                    disabled={isPending}
                    onValueChange={(value) =>
                        startTransition(() => {
                            setLimit(parseInt(value) as Limit);
                        })
                    }
                    value={limit.toString()}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Select number of results' />
                    </SelectTrigger>
                    <SelectContent>
                        {LIMITS.map((limit) => (
                            <SelectItem key={limit} value={limit.toString()}>
                                {limit} Results
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='flex items-center gap-2'>
                <Button
                    disabled={!hasPreviousPage || isPending}
                    onClick={() =>
                        startTransition(() => {
                            setContinuationTokens((tokens) => tokens?.slice(0, -1));
                        })
                    }
                    variant='secondary'
                >
                    <RiArrowLeftSLine className='h-5 w-5' />
                </Button>
                <Button
                    disabled={!hasNextPage || isPending}
                    onClick={() =>
                        startTransition(() => {
                            setContinuationTokens((tokens) => [...tokens, continuationToken]);
                        })
                    }
                    variant='secondary'
                >
                    <RiArrowRightSLine className='h-5 w-5' />
                </Button>
            </div>
        </div>
    );
};
