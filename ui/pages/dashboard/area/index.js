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
import AreaList from './AreaList';

// queries & mutations
import { areas as areasQuery } from '../../../_queries/Areas.gql';
import {
  removeArea as removeAreaMutation,
  removeMultiAreas as removeMultiAreasMutation
} from '../../../_mutations/Areas.gql';
// ----------------------------------------------------------------------

export default function Area() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeArea] = useMutation(removeAreaMutation);
  const [removeMultiAreas] = useMutation(removeMultiAreasMutation);

  const { loading, data } = useQuery(areasQuery);

  const areas = (data && data.areas) || [];

  const deleteArea = (_id) => {
    removeArea({
      variables: {
        _id
      },
      refetchQueries: [{ query: areasQuery }]
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

  const deleteMultiAreas = (ids) => {
    const _id = ids.toString();
    removeMultiAreas({
      variables: {
        _id
      },
      refetchQueries: [{ query: areasQuery }]
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
    <Page title="Area">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Areas"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Area' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.area.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Area
            </Button>
          }
        />
        <AreaList
          isLoading={loading}
          areaList={areas}
          onDelete={(id) => deleteArea(id)}
          onDeleteMultiRows={(ids) => deleteMultiAreas(ids)}
        />
      </Container>
    </Page>
  );
}
