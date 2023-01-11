import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Dayjs } from 'dayjs';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// import mutations
import { useMutation } from '@apollo/react-hooks';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import { Card, Grid, Stack, Typography, Box, IconButton, TextField } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFSwitch, RHFEditor, RHFTextField, RHFUploadSingleFile } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

// mutations
import {
  addSession as addSessionMutation,
  updateSession as updateSessionMutation
} from '../../../_mutations/Sessions.gql';
import { sessions as sessionsQuery } from '../../../_queries/Sessions.gql';
import { SentimentSatisfiedTwoTone } from '@mui/icons-material';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

SessionNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentSession: PropTypes.object
};

export default function SessionNewEditForm({ isEdit, currentSession }) {
  const [addSession] = useMutation(addSessionMutation);
  const [updateSession] = useMutation(updateSessionMutation);
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const NewEntitySchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required')
  });

  const defaultValues = useMemo(
    () => ({
      title: currentSession?.title || '',
      description: currentSession?.description || ''
    }),
    [currentSession]
  );

  const methods = useForm({
    resolver: yupResolver(NewEntitySchema),
    defaultValues
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentSession) {
      const { startTime, endTime } = currentSession;
      setStartTime(startTime);
      setEndTime(endTime);
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentSession]);

  const onSubmit = async (values) => {
    try {
      const { description, title } = values;

      if (!startTime || !endTime) {
        enqueueSnackbar('Incorrect inputs!', {
          variant: 'error',
          autoHideDuration: 2500,
          action: (key) => (
            <IconButton size="small" onClick={() => closeSnackbar(key)}>
              <Iconify icon="eva:close-outline" />
            </IconButton>
          )
        });

        return;
      }

      const mutation = isEdit ? updateSession : addSession;
      const sessionToAddOrUpdate = {
        title,
        description,
        startTime,
        endTime
      };

      if (isEdit) {
        sessionToAddOrUpdate._id = currentSession._id;
      }

      mutation({
        variables: {
          ...sessionToAddOrUpdate
        },
        refetchQueries: [{ query: sessionsQuery }]
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
        navigate(PATH_DASHBOARD.session.root);
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
              <RHFTextField name="title" label="Session Title" sx={{ maxWidth: 400 }} />
              <Stack direction="row" spacing={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="StartTime"
                    value={startTime}
                    onChange={(newValue) => {
                      setStartTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} variant="filled" />}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="EndTime"
                    value={endTime}
                    onChange={(newValue) => {
                      setEndTime(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} variant="filled" />}
                  />
                </LocalizationProvider>
              </Stack>
              <div>
                <LabelStyle>Description</LabelStyle>
                <RHFEditor simple name="description" />
              </div>
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Session' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
