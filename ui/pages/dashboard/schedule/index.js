import { Roles } from 'meteor/alanning:roles';

import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

// import queries
import { useQuery, useMutation } from '@apollo/react-hooks';
// @mui
import { Button, Container, IconButton } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// hooks
import useAuth from '../../../hooks/useAuth';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';

import SchedulePreviewDialog from './SchedulePreviewDialog';

// sections
import ScheduleList from './ScheduleList';

// queries
import { user as userQuery } from '../../../_queries/Users.gql';
import { locations as locationsQuery } from '../../../_queries/Locations.gql';
import { schedules as schedulesQuery } from '../../../_queries/Schedules.gql';

// mutations
import {
  removeSchedule as removeScheduleMutation,
  updateSchedule as updateScheduleMutation
} from '../../../_mutations/Schedules.gql';
// ----------------------------------------------------------------------

export default function Schedule() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [removeSchedule] = useMutation(removeScheduleMutation);
  const [updateSchedule] = useMutation(updateScheduleMutation);

  const { user } = useAuth();
  const [isAdmin, setAdmin] = useState(false);
  const [userId, setUserId] = useState('');
  const [scheduleList, setScheduleList] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [scheduleId, setScheduleId] = useState('');

  const { loading, data } = useQuery(schedulesQuery);
  const schedules = data && data.schedules;

  const lData = useQuery(locationsQuery).data;
  const locationData = lData && lData.locations;

  const uData = useQuery(userQuery, { variables: { _id: userId } }).data;
  const userInfo = uData && uData.user;

  useEffect(() => {
    if (user && Roles.userIsInRole(user._id, 'admin')) {
      setAdmin(true);
    }

    if (user) {
      setUserId(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (schedules && locationData && userInfo) {
      if (isAdmin) {
        setScheduleList([...schedules]);
      } else {
        const { entities, locations } = userInfo;
        if (entities && locations) {
          const tmpLocs = entities.map((ent) => {
            const newLoc = locationData.find((loc) => loc.entity._id === ent._id);
            if (!newLoc) return null;
            const { _id, title } = newLoc;
            return { _id, title };
          });

          locations.forEach((loc) => delete loc.__typename);
          const attachedLocations = [...locations, ...tmpLocs];
          const newLocations = removeDuplicates(attachedLocations);
          const newSchedules = [];
          newLocations.map((loc) => {
            const sche = schedules.find((sche) => sche.locationId === loc._id);
            if (sche) newSchedules.push(sche);
          });
          setScheduleList([...newSchedules]);
        }
      }
    }
  }, [schedules, locationData, userInfo, isAdmin]);

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

  const handlePreviewSchedule = (_id) => {
    setScheduleId(_id);
    setIsOpen(true);
  };

  const handlePublishSchedule = (_id) => {
    const mutation = updateSchedule;

    const scheduleToAddOrUpdate = {
      _id,
      state: 'Published'
    };
    console.log('Hello ID', scheduleToAddOrUpdate);

    mutation({
      variables: {
        schedule: scheduleToAddOrUpdate
      },
      refetchQueries: [{ query: schedulesQuery }]
    }).then(() => {
      enqueueSnackbar('Published successfully!', {
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
        <SchedulePreviewDialog scheduleId={scheduleId} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <HeaderBreadcrumbs
          heading="Schedules"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Schedule' }]}
          action={
            isAdmin && (
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.schedule.create}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                New Schedule
              </Button>
            )
          }
        />
        <ScheduleList
          isLoading={loading}
          scheduleList={scheduleList}
          onDelete={(id) => deleteSchedule(id)}
          onPreviewSchedule={(_id) => handlePreviewSchedule(_id)}
          onPublishSchedule={(_id) => handlePublishSchedule(_id)}
          isAdmin={isAdmin}
        />
      </Container>
    </Page>
  );
}

function removeDuplicates(arr) {
  const result = arr.filter((thing, index, self) => index === self.findIndex((t) => t._id === thing._id));
  return result;
}
