import { PreloadedQueryRef, useReadQuery } from '@apollo/client';
import { Select } from '@mantine/core';
import { useRouteLoaderData } from 'react-router';

import { ListTeamsQuery } from '@/graphql/graphql';

export const TeamSelect = () => {
  const queryRef = useRouteLoaderData('dashboard') as PreloadedQueryRef<
    ListTeamsQuery,
    undefined
  >;
  const { data } = useReadQuery(queryRef);

  return (
    <Select
      data={data.listTeams?.map((team) => team.name ?? '')}
      mb='sm'
      size='sm'
    />
  );
};
