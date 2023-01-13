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
import ScheduleNewForm from './ScheduleNewForm';

// queries
import { editSchedule as editScheduleQuery } from '../../../_queries/Schedules.gql';
// ----------------------------------------------------------------------

export default function ScheduleCreate() {
  const { scheduleId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');

  const { data } = useQuery(editScheduleQuery, { variables: { _id: scheduleId } });
  const currentSchedule = (isEdit && data && data.schedule) || {};
  return (
    <Page title="Schedule">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Schedules"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Schedules', href: PATH_DASHBOARD.schedule.root },
            { name: isEdit ? 'Edit Schedule' : 'New Schedule' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.schedule.root}
              startIcon={<ArrowBackIosNewIcon />}
            >
              Back
            </Button>
          }
        />
        <ScheduleNewForm currentSchedule={currentSchedule} isEdit={isEdit} />
      </Container>
    </Page>
  );
}
