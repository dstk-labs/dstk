import { Switch } from '@mantine/core';
import { useSearchParams } from 'react-router';

export const IncludeArchivedSwitch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const archived = searchParams.get('includeArchived') === 'true';

  const handleArchiveSwitch = () => {
    const next = new URLSearchParams(searchParams);
    next.set('includeArchived', String(!archived));
    setSearchParams(next, { replace: true });
  };

  return (
    <Switch
      checked={archived}
      label='Include Archived'
      labelPosition='left'
      onChange={handleArchiveSwitch}
    />
  );
};
