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
import EntityList from './EntityList';

// queries & mutations
import { entities as entitiesQuery } from '../../../_queries/Entities.gql';
import {
  removeEntity as removeEntityMutation,
  removeMultiEntities as removeMultiEntitiesMutation
} from '../../../_mutations/Entities.gql';
// ----------------------------------------------------------------------

export default function Entity() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeEntity] = useMutation(removeEntityMutation);
  const [removeMultiEntities] = useMutation(removeMultiEntitiesMutation);

  const { loading, data } = useQuery(entitiesQuery);

  const entities = (data && data.entities) || [];

  const deleteEntity = (_id) => {
    removeEntity({
      variables: {
        _id
      },
      refetchQueries: [{ query: entitiesQuery }]
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

  const deleteMultiEntities = (ids) => {
    const _id = ids.toString();
    removeMultiEntities({
      variables: {
        _id
      },
      refetchQueries: [{ query: entitiesQuery }]
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
    <Page title="Entity">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Entities"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Entity' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.entity.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Entity
            </Button>
          }
        />
        <EntityList
          isLoading={loading}
          entityList={entities}
          onDelete={(id) => deleteEntity(id)}
          onDeleteMultiRows={(ids) => deleteMultiEntities(ids)}
        />
      </Container>
    </Page>
  );
}
