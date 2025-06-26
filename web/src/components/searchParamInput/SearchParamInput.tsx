import { TextInput } from '@mantine/core';
import { SearchIcon } from 'lucide-react';
import { SetURLSearchParams } from 'react-router';

type SearchParamTextInput = {
  param: string;
  placeholder?: string;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
};

export const SearchParamTextInput = ({
  param,
  placeholder = 'Search...',
  searchParams,
  setSearchParams,
}: SearchParamTextInput) => {
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
