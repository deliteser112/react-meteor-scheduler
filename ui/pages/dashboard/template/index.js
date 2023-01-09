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
import TemplateList from './TemplateList';

// queries & mutations
import { templates as templatesQuery } from '../../../_queries/Templates.gql';
import { removeTemplate as removeTemplateMutation } from '../../../_mutations/Templates.gql';
// ----------------------------------------------------------------------

export default function Template() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeTemplate] = useMutation(removeTemplateMutation);

  const { loading, data } = useQuery(templatesQuery);

  const templates = (data && data.templates) || [];

  const deleteTemplate = (_id) => {
    removeTemplate({
      variables: {
        _id
      },
      refetchQueries: [{ query: templatesQuery }]
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
    <Page title="Template">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Templates"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Template' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.template.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Template
            </Button>
          }
        />
        <TemplateList isLoading={loading} templateList={templates} onDelete={(id) => deleteTemplate(id)} />
      </Container>
    </Page>
  );
}
