import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSetAtom } from 'jotai';

import type { Limit } from '@/types/Limit';
import { Input, Select, SelectItem } from '@/components/ui';

import { modelRegistryPaginationAtom } from '../atoms';

export const ModelRegistryFilters = () => {
    const setInputs = useSetAtom(modelRegistryPaginationAtom);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputs((values) => ({
            ...values,
            modelName: e.target.value,
        }));

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setInputs((values) => ({
            ...values,
            limit: parseInt(e.target.value) as Limit,
        }));

    return (
        <div className='flex items-center justify-between'>
            <div className='basis-1/4'>
                <Input
                    icon={MagnifyingGlassIcon}
                    onChange={(e) => handleInput(e)}
                    placeholder='Search Models'
                />
            </div>
            <Select className='basis-1/6' onChange={(e) => handleSelect(e)}>
                <SelectItem value='10'>10 Results</SelectItem>
                <SelectItem value='25'>25 Results</SelectItem>
                <SelectItem value='50'>50 Results</SelectItem>
            </Select>
        </div>
    );
};
