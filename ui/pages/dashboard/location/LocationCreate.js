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
import LocationNewForm from './LocationNewForm';

// queries
import { editLocation as editLocationQuery } from '../../../_queries/Locations.gql';
import { entities as entitiesQuery } from '../../../_queries/Entities.gql';
// ----------------------------------------------------------------------

export default function LocationCreate() {
  const { locationId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');

  const { data } = useQuery(editLocationQuery, { variables: { _id: locationId } });
  const currentLocation = (isEdit && data && data.location) || {};

  // get entities
  const eData = useQuery(entitiesQuery).data;
  const entities = (eData && eData.entities) || [];

  return (
    <Page title="Location">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Locations"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Locations', href: PATH_DASHBOARD.location.root },
            { name: isEdit ? 'Edit Location' : 'New Location' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.location.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <LocationNewForm currentLocation={currentLocation} entities={entities} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
