import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Container, Button } from '@mui/material';

// graphql & collections
import { useQuery, useMutation } from '@apollo/react-hooks';

// import queries & mutations
import { users as usersQuery } from '../../../_queries/Users.gql';
import { removeUser as removeUserMutation } from '../../../_mutations/Users.gql';

// components
import Page from '../../../components/Page';
import UserList from './UserList';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// ----------------------------------------------------------------------

export default function Users() {
  const [removeUser] = useMutation(removeUserMutation);

  const { loading, data } = useQuery(usersQuery);

  const users = (data && data.users && data.users.users) || [];

  const handleDeleteUser = (_id) => {
    removeUser({
      variables: {
        _id
      },
      refetchQueries: [{ query: usersQuery }]
    });
  };

  return (
    <Page title="User">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Users"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Users' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Create User
            </Button>
          }
        />
        <UserList isLoading={loading} userList={users} onDeleteRow={handleDeleteUser} />
      </Container>
    </Page>
  );
}
