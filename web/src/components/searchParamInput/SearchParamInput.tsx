import { TextInput } from "@mantine/core";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "react-router";

type SearchParamTextInputProps = {
  param: string;
  placeholder?: string;
};

export function SearchParamTextInput({
  param,
  placeholder = "Search...",
}: SearchParamTextInputProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <TextInput
      defaultValue={searchParams.get(param) ?? ""}
      leftSection={<SearchIcon size={14} style={{ opacity: 0.6 }} />}
      onChange={(e) => {
        const next = new URLSearchParams(searchParams);
        if (e.target.value)
          next.set(param, e.target.value);
        else
          next.delete(param);
        next.delete("after");
        setSearchParams(next, { replace: true });
      }}
      placeholder={placeholder}
      style={{ flex: "1 1 240px", maxWidth: 360 }}
    />
  );
}
