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
import TemplateNewForm from './TemplateNewForm';

// queries
import { editTemplate as editTemplateQuery } from '../../../_queries/Templates.gql';
import { locations as locationsQuery } from '../../../_queries/Locations.gql';
import { sessions as sessionsQuery } from '../../../_queries/Sessions.gql';
import { areas as areasQuery } from '../../../_queries/Areas.gql';
import { users as usersQuery } from '../../../_queries/Users.gql';
// ----------------------------------------------------------------------

export default function TemplateCreate() {
  const { templateId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');

  const { data } = useQuery(editTemplateQuery, { variables: { _id: templateId } });
  const currentTemplate = (isEdit && data && data.template) || {};

  console.log('AAA:', currentTemplate);

  // get locations
  const eData = useQuery(locationsQuery).data;
  const locations = (eData && eData.locations) || [];

  // get sessions
  const sData = useQuery(sessionsQuery).data;
  const sessions = (sData && sData.sessions) || [];

  // get areas
  const aData = useQuery(areasQuery).data;
  const areas = (aData && aData.areas) || [];

  // get users
  const uData = useQuery(usersQuery).data;
  const users = (uData && uData.users && uData.users.users) || [];

  return (
    <Page title="Template">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Templates"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Templates', href: PATH_DASHBOARD.template.root },
            { name: isEdit ? 'Edit Template' : 'New Template' }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.template.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <TemplateNewForm
          currentTemplate={currentTemplate}
          locations={locations}
          sessions={sessions}
          areas={areas}
          users={users}
          isEdit={isEdit}
        />
      </Container>
    </Page>
  );
}
