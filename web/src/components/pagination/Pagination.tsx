import { Button } from "@mantine/core";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useSearchParams } from "react-router";

type PaginationProps = {
  continuationTokens: (null | string)[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function Pagination({
  continuationTokens,
  hasNextPage,
  hasPreviousPage,
}: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentAfter = searchParams.get("after") ?? null;
  const currentIndex = continuationTokens.indexOf(currentAfter);

  const goToPage = (token: null | string) => {
    const next = new URLSearchParams(searchParams);
    if (token) {
      next.set("after", token);
    }
    else {
      next.delete("after");
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <Button
        disabled={!hasPreviousPage}
        leftSection={<ChevronLeftIcon size={14} />}
        onClick={() => goToPage(continuationTokens[currentIndex - 1] ?? null)}
        radius="sm"
        size="compact"
        variant="default"
      >
        Prev
      </Button>
      <Button
        disabled={!hasNextPage}
        onClick={() => {
          const nextToken = continuationTokens[currentIndex + 1];
          if (nextToken)
            goToPage(nextToken);
        }}
        radius="sm"
        rightSection={<ChevronRightIcon size={14} />}
        size="compact"
        variant="default"
      >
        Next
      </Button>
    </>
  );
}
