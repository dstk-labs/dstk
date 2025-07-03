import { Select } from '@mantine/core';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { LIMIT, type Limit, useLimitStore } from '@/stores/limitStore';

export const LimitSelector = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { limit, setLimit } = useLimitStore();

  useEffect(() => {
    const param = searchParams.get('first');
    const fromUrl = param ? parseInt(param, 10) : null;

    if (fromUrl && LIMIT.includes(fromUrl as Limit)) {
      setLimit(fromUrl as Limit);
    } else {
      const next = new URLSearchParams(searchParams);
      next.set('first', limit.toString());
      setSearchParams(next, { replace: true });
    }
  }, [limit, searchParams, setLimit, setSearchParams]);

  const handleChange = (value: null | string) => {
    if (!value) return;
    const parsed = parseInt(value, 10) as Limit;

    if (LIMIT.includes(parsed)) {
      setLimit(parsed);
      const next = new URLSearchParams(searchParams);
      next.set('first', value);
      setSearchParams(next, { replace: true });
    }
  };

  return (
    <Select
      checkIconPosition='right'
      data={LIMIT.map((val) => ({
        label: `${val.toString()} results per page`,
        value: val.toString(),
      }))}
      onChange={handleChange}
      value={limit.toString()}
      w={240}
    />
  );
};
