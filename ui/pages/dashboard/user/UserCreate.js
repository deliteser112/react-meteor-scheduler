import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// @mui
import { Button, Container } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// sections
import UserNewForm from './UserNewForm';

// ----------------------------------------------------------------------

export default function UserCreate() {
  return (
    <Page title="User">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Users"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Users', href: PATH_DASHBOARD.user.root },
            { name: 'New User' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.user.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <UserNewForm />
      </Container>
    </Page>
  );
}
