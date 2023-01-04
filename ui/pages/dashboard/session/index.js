import React from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

import { Cloudinary } from 'meteor/socialize:cloudinary';

// import queries
import { useQuery, useMutation } from '@apollo/react-hooks';
// @mui
import { Button, Container, IconButton } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';

// sections
import SessionList from './SessionList';

// queries & mutations
import { sessions as sessionsQuery } from '../../../_queries/Sessions.gql';
import { removeSession as removeSessionMutation } from '../../../_mutations/Sessions.gql';
// ----------------------------------------------------------------------

export default function Session() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeSession] = useMutation(removeSessionMutation);

  const { loading, data } = useQuery(sessionsQuery);

  const sessions = (data && data.sessions) || [];

  const deleteSession = (_id) => {
    const deleteSes = sessions.find((ses) => ses._id === _id);
    const public_id = deleteSes && deleteSes.cover && deleteSes.cover.public_id;
    removeSession({
      variables: {
        _id
      },
      refetchQueries: [{ query: sessionsQuery }]
    }).then(async (res) => {
      if (public_id) {
        await Cloudinary.delete(public_id);

        enqueueSnackbar('Deleted successfully!', {
          variant: 'success',
          autoHideDuration: 2500,
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          )
        });
      }
    });
  };

  return (
    <Page title="Document">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Sessions"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Sessions' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.session.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Session
            </Button>
          }
        />
        <SessionList isLoading={loading} sessionList={sessions} onDelete={(id) => deleteSession(id)} />
      </Container>
    </Page>
  );
}
