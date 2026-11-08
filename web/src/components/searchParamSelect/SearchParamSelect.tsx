import { Select } from "@mantine/core";
import { useSearchParams } from "react-router";

type SearchParamSelectProps = {
  data: { label: string; value: string }[];
  param: string;
  placeholder: string;
};

export function SearchParamSelect({ data, param, placeholder }: SearchParamSelectProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Select
      aria-label={placeholder}
      clearable
      data={data}
      onChange={(value) => {
        const next = new URLSearchParams(searchParams);
        if (value)
          next.set(param, value);
        else
          next.delete(param);
        next.delete("after");
        setSearchParams(next, { replace: true });
      }}
      placeholder={placeholder}
      style={{ width: 180 }}
      value={searchParams.get(param)}
    />
  );
}
