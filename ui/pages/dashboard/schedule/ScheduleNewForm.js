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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  Card,
  Grid,
  Stack,
  Box,
  IconButton,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@mui/material';

// import queries
import { useQuery } from '@apollo/react-hooks';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

import ScheduleTemplate from './ScheduleTemplate';

// mutations
import {
  addSchedule as addScheduleMutation,
  updateSchedule as updateScheduleMutation
} from '../../../_mutations/Schedules.gql';
import { schedules as schedulesQuery } from '../../../_queries/Schedules.gql';

import { users as usersQuery } from '../../../_queries/Users.gql';
import { editTemplate as editTemplateQuery } from '../../../_queries/Templates.gql';
import { useState } from 'react';

// ----------------------------------------------------------------------

ScheduleNewForm.propTypes = {
  isEdit: PropTypes.bool,
  templates: PropTypes.array,
  currentSchedule: PropTypes.object
};

export default function ScheduleNewForm({ isEdit, templates, currentSchedule }) {
  const [addSchedule] = useMutation(addScheduleMutation);
  const [updateSchedule] = useMutation(updateScheduleMutation);
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [templateId, setTemplateId] = useState('');

  const [schedule, setSchedule] = useState([]);

  const { data } = useQuery(editTemplateQuery, { variables: { _id: templateId } });
  const template = data && data.template;

  const userData = useQuery(usersQuery).data;
  const users = (userData && userData.users && userData.users.users) || [];

  const NewScheduleSchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
  });

  const defaultValues = useMemo(
    () => ({
      title: currentSchedule?.title || ''
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
    if (isEdit && currentSchedule && currentSchedule.template) {
      const { startDate, endDate, template } = currentSchedule;
      setStartDate(startDate);
      setEndDate(endDate);
      setTemplateId(template._id);

      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentSchedule]);

  const onSubmit = async (values) => {
    try {
      const { title } = values;

      const scheduleTable = getScheduleTable(schedule);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const mutation = isEdit ? updateSchedule : addSchedule;
      const scheduleToAddOrUpdate = {
        title,
        startDate,
        endDate,
        template: {
          _id: template._id,
          title: template.title
        },
        state: 'Published',
        scheduleTable
      };

      if (isEdit) {
        scheduleToAddOrUpdate._id = currentSchedule._id;
      }

      console.log(scheduleToAddOrUpdate);

      mutation({
        variables: {
          schedule: scheduleToAddOrUpdate
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

  const handleChangeTemplate = (event) => {
    setTemplateId(event.target.value);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Title" sx={{ maxWidth: 400 }} />
              <Stack direction={{ md: 'row', sm: 'column' }} spacing={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Stack>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Choose Template</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={templateId}
                  label="Choose Template"
                  onChange={handleChangeTemplate}
                >
                  {templates.map((temp) => (
                    <MenuItem key={temp._id} value={temp._id}>
                      {temp.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ position: 'relative' }}>
                {template && (
                  <ScheduleTemplate
                    isEdit={isEdit}
                    currentSchedule={currentSchedule}
                    template={template}
                    users={users}
                    onSetSchedule={(sche) => setSchedule([...sche])}
                  />
                )}
              </Box>
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Publish Schedule' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

function getScheduleTable(scheArray) {
  const resultArray = scheArray.map((rows) =>
    rows.map((col) => {
      delete col.__typename;
      let modifiedList = [];
      if (col.list.length > 0) {
        modifiedList = col.list.map((item) => item._id);
      }
      return { ...col, list: modifiedList };
    })
  );

  return resultArray;
}
