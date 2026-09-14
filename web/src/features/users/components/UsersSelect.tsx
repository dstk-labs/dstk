import { useQuery } from "@apollo/client";
import { Select } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useState } from "react";

import { gql } from "@/graphql";

const LIST_USERS_FOR_SELECT = gql(`
  query ListUsersForSelect($userName: String) {
    listUsers(userName: $userName, first: 25) {
      edges {
        node {
          email
          realName
          userId
          userName
        }
      }
    }
  }
`);

type UsersSelectProps = Omit<
  React.ComponentProps<typeof Select>,
  "data" | "searchable" | "searchValue" | "onSearchChange"
>;

export function UsersSelect({ disabled, ...props }: UsersSelectProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 250);

  const { data, loading } = useQuery(LIST_USERS_FOR_SELECT, {
    variables: { userName: debouncedSearch || null },
  });

  const users = (data?.listUsers?.edges ?? [])
    .map(edge => edge.node)
    .filter((user): user is NonNullable<typeof user> => Boolean(user));

  return (
    <Select
      data={users.map(user => ({
        label: `${user.realName ?? user.userName} (${user.email})`,
        value: user.userId ?? "",
      }))}
      disabled={disabled}
      nothingFoundMessage={loading ? "Searching…" : "No users found"}
      onSearchChange={setSearch}
      placeholder="Search by username"
      searchable
      searchValue={search}
      {...props}
    />
  );
}
