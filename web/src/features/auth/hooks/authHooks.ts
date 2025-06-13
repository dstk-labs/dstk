import { type PreloadedQueryRef, useReadQuery } from '@apollo/client';
import { useRouteLoaderData } from 'react-router';

import type { GetUserQuery } from '@/graphql/types';

export const useUser = () => {
  const queryRef = useRouteLoaderData('root') as PreloadedQueryRef<
    GetUserQuery,
    undefined
  >;

  const { data } = useReadQuery(queryRef);

  return {
    user: data.getUser,
  };
};
