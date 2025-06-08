import type { GetUserQuery } from '@/graphql/types';
import { useReadQuery, type PreloadedQueryRef } from '@apollo/client';
import { useRouteLoaderData } from 'react-router';

export const useUser = () => {
  const queryRef = useRouteLoaderData('root') as PreloadedQueryRef<GetUserQuery, undefined>;

  const { data } = useReadQuery(queryRef);

  return {
    user: data.getUser,
  };
};
