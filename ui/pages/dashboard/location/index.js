import React from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

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
import LocationList from './LocationList';

// queries & mutations
import { locations as locationsQuery } from '../../../_queries/Locations.gql';
import { removeLocation as removeLocationMutation } from '../../../_mutations/Locations.gql';
// ----------------------------------------------------------------------

export default function Location() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeLocation] = useMutation(removeLocationMutation);

  const { loading, data } = useQuery(locationsQuery);

  const locations = (data && data.locations) || [];

  const deleteLocation = (_id) => {
    removeLocation({
      variables: {
        _id
      },
      refetchQueries: [{ query: locationsQuery }]
    }).then(async (res) => {
      enqueueSnackbar('Deleted successfully!', {
        variant: 'success',
        autoHideDuration: 2500,
        action: (key) => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <Iconify icon="eva:close-outline" />
          </IconButton>
        )
      });
    });
  };

  return (
    <Page title="Location">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Locations"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Location' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.location.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Location
            </Button>
          }
        />
        <LocationList isLoading={loading} locationList={locations} onDelete={(id) => deleteLocation(id)} />
      </Container>
    </Page>
  );
}
