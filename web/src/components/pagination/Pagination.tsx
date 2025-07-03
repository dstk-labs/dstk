import { Group, Pagination as PaginationRoot } from '@mantine/core';
import { useSearchParams } from 'react-router';

type PaginationProps = {
  continuationTokens: (null | string)[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const Pagination = ({
  continuationTokens,
  hasNextPage,
  hasPreviousPage,
}: PaginationProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentAfter = searchParams.get('after') ?? null;
  const currentIndex = continuationTokens.indexOf(currentAfter);

  const goToPage = (token: null | string) => {
    const next = new URLSearchParams(searchParams);
    if (token) {
      next.set('after', token);
    } else {
      next.delete('after');
    }
    setSearchParams(next, { replace: true });
  };

  return (
    <PaginationRoot.Root total={0}>
      <Group gap={5}>
        <PaginationRoot.Previous
          disabled={hasPreviousPage === false}
          onClick={() => {
            const prevToken = continuationTokens[currentIndex - 1] ?? null;
            goToPage(prevToken);
          }}
        />
        <PaginationRoot.Next
          disabled={hasNextPage === false}
          onClick={() => {
            const nextToken = continuationTokens[currentIndex + 1];
            if (nextToken) {
              goToPage(nextToken);
            }
          }}
        />
      </Group>
    </PaginationRoot.Root>
  );
};
