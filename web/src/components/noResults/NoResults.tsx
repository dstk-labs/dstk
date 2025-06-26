import { Center, Stack, Table, Text } from '@mantine/core';
import { ChartNoAxesColumnIcon } from 'lucide-react';

type NoResultsProps = {
  colSpan: number;
};

export const NoResults = ({ colSpan }: NoResultsProps) => (
  <Table.Tr>
    <Table.Td colSpan={colSpan}>
      <Center py={20}>
        <Stack align='center' gap={2}>
          <ChartNoAxesColumnIcon size={22} />
          <Text c='dimmed' component='div' size='sm'>
            No Results
          </Text>
        </Stack>
      </Center>
    </Table.Td>
  </Table.Tr>
);
