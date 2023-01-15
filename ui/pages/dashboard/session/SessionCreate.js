import React from 'react';
import { Link as RouterLink, useParams, useLocation } from 'react-router-dom';

// import queries
import { useQuery } from '@apollo/react-hooks';
// @mui
import { Button, Container } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// sections
import SessionNewForm from './SessionNewForm';

// queries
import { editSession as editSessionQuery } from '../../../_queries/Sessions.gql';
// ----------------------------------------------------------------------

export default function SessionCreate() {
  const { sessionId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');

  const { data } = useQuery(editSessionQuery, { variables: { _id: sessionId } });
  const currentSession = (isEdit && data && data.session) || {};

  return (
    <Page title="Session">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Sessions"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Sessions', href: PATH_DASHBOARD.session.root },
            { name: isEdit ? 'Edit Session' : 'New Session' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.session.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <SessionNewForm currentSession={currentSession} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
