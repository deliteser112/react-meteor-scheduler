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
import ScheduleList from './ScheduleList';

// queries & mutations
import { schedules as schedulesQuery } from '../../../_queries/Schedules.gql';
import { removeSchedule as removeScheduleMutation } from '../../../_mutations/Schedules.gql';
// ----------------------------------------------------------------------

export default function Schedule() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeSchedule] = useMutation(removeScheduleMutation);

  const { loading, data } = useQuery(schedulesQuery);

  const schedules = (data && data.schedules) || [];

  const deleteSchedule = (_id) => {
    removeSchedule({
      variables: {
        _id
      },
      refetchQueries: [{ query: schedulesQuery }]
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
    <Page title="Schedule">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Schedules"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Schedule' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.schedule.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Schedule
            </Button>
          }
        />
        <ScheduleList isLoading={loading} scheduleList={schedules} onDelete={(id) => deleteSchedule(id)} />
      </Container>
    </Page>
  );
}
