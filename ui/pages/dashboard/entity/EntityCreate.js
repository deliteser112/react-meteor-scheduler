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
import EntityNewForm from './EntityNewForm';

// queries
import { editEntity as editEntityQuery } from '../../../_queries/Entities.gql';
// ----------------------------------------------------------------------

export default function EntityCreate() {
  const { entityId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');

  const { data } = useQuery(editEntityQuery, { variables: { _id: entityId } });
  const currentEntity = (isEdit && data && data.entity) || {};
  return (
    <Page title="Entity">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Entities"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Entities', href: PATH_DASHBOARD.entity.root },
            { name: isEdit ? 'Edit Entity' : 'New Entity' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.entity.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <EntityNewForm currentEntity={currentEntity} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
