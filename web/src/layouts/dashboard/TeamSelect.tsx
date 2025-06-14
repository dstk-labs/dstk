import { PreloadedQueryRef, useReadQuery } from '@apollo/client';
import { Select } from '@mantine/core';
import { useEffect } from 'react';
import { useRouteLoaderData } from 'react-router';

import { ListTeamsQuery } from '@/graphql/graphql';
import { useTeamStore } from '@/stores/teamStore';

export const TeamSelect = () => {
  const queryRef = useRouteLoaderData('dashboard') as PreloadedQueryRef<
    ListTeamsQuery,
    undefined
  >;
  const { data } = useReadQuery(queryRef);

  const { selectedTeam, setSelectedTeam } = useTeamStore();

  useEffect(() => {
    if (data?.listTeams) {
      const personalTeam = data.listTeams.find(
        (team) => team.name === 'Personal Team',
      );
      if (personalTeam && personalTeam.teamId) {
        setSelectedTeam(personalTeam.teamId);
      }
    }
  }, [data.listTeams, selectedTeam, setSelectedTeam]);

  return (
    <Select
      data={data.listTeams?.map((team) => ({
        label: team.name ?? '',
        value: team.teamId ?? '',
      }))}
      mb='sm'
      onChange={(value) => {
        if (value) setSelectedTeam(value);
      }}
      size='sm'
      value={selectedTeam}
    />
  );
};
