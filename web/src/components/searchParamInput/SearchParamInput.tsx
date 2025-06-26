import { TextInput } from '@mantine/core';
import { SearchIcon } from 'lucide-react';
import { useSearchParams } from 'react-router';

type SearchParamTextInput = {
  param: string;
  placeholder?: string;
};

export const SearchParamTextInput = ({
  param,
  placeholder = 'Search...',
}: SearchParamTextInput) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <TextInput
      leftSection={<SearchIcon size={18} />}
      onChange={(e) => {
        const next = new URLSearchParams(searchParams);
        next.set(param, e.target.value);
        setSearchParams(next, { replace: true });
      }}
      placeholder={placeholder}
      rightSectionWidth={42}
    />
  );
};
