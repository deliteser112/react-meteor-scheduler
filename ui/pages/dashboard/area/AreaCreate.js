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
import AreaNewForm from './AreaNewForm';

// queries
import { editArea as editAreaQuery } from '../../../_queries/Areas.gql';
// ----------------------------------------------------------------------

export default function AreaCreate() {
  const { areaId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');

  const { data } = useQuery(editAreaQuery, { variables: { _id: areaId } });
  const currentArea = (isEdit && data && data.area) || {};
  return (
    <Page title="Area">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Areas"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Areas', href: PATH_DASHBOARD.area.root },
            { name: isEdit ? 'Edit Area' : 'New Area' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.area.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <AreaNewForm currentArea={currentArea} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
