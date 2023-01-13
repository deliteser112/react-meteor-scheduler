import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// import mutations
import { useMutation } from '@apollo/react-hooks';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';

import { Card, Grid, Stack, Box, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

// mutations
import { addSchedule as addScheduleMutation, updateSchedule as updateScheduleMutation } from '../../../_mutations/Schedules.gql';
import { schedules as schedulesQuery } from '../../../_queries/Schedules.gql';

// ----------------------------------------------------------------------

ScheduleNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentSchedule: PropTypes.object
};

export default function ScheduleNewForm({ isEdit, currentSchedule }) {
  const [addSchedule] = useMutation(addScheduleMutation);
  const [updateSchedule] = useMutation(updateScheduleMutation);
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewScheduleSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    alternateName: Yup.string().required('Alternate Name is required')
  });

  const defaultValues = useMemo(
    () => ({
      title: currentSchedule?.title || '',
      alternateName: currentSchedule?.alternateName || ''
    }),
    [currentSchedule]
  );

  const methods = useForm({
    resolver: yupResolver(NewScheduleSchema),
    defaultValues
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentSchedule) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentSchedule]);

  const onSubmit = async (values) => {
    try {
      const { title, alternateName } = values;

      const mutation = isEdit ? updateSchedule : addSchedule;
      const scheduleToAddOrUpdate = {
        title,
        alternateName
      };

      if (isEdit) {
        scheduleToAddOrUpdate._id = currentSchedule._id;
      }

      mutation({
        variables: {
          ...scheduleToAddOrUpdate
        },
        refetchQueries: [{ query: schedulesQuery }]
      }).then(() => {
        reset();
        enqueueSnackbar(!isEdit ? 'Created successfully!' : 'Updated successfully!', {
          variant: 'success',
          autoHideDuration: 2500,
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          )
        });
        navigate(PATH_DASHBOARD.schedule.root);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Title" sx={{ maxWidth: 400 }} />
              <RHFTextField name="alternateName" label="Alternate Name" sx={{ maxWidth: 400 }} />
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Schedule' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
