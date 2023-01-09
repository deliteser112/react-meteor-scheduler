import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { capitalCase, sentenceCase } from 'change-case';

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// import mutations
import { useMutation } from '@apollo/react-hooks';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';

import {
  Card,
  Grid,
  Stack,
  MenuItem,
  Box,
  IconButton,
  Autocomplete,
  TextField,
  Checkbox,
  Typography
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFTextField, RHFRadioGroup } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

// mutations
import {
  addTemplate as addTemplateMutation,
  updateTemplate as updateTemplateMutation
} from '../../../_mutations/Templates.gql';
import { templates as templatesQuery } from '../../../_queries/Templates.gql';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

TemplateNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTemplate: PropTypes.object,
  locations: PropTypes.array,
  sessions: PropTypes.array,
  areas: PropTypes.array,
  users: PropTypes.array
};

export default function TemplateNewForm({ isEdit, currentTemplate, locations, sessions, areas, users }) {
  const [addTemplate] = useMutation(addTemplateMutation);
  const [updateTemplate] = useMutation(updateTemplateMutation);
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [defaultSessions, setDefaultSessions] = useState([]);
  const [defaultDays, setDefaultDays] = useState([]);
  const [defaultAreas, setDefaultAreas] = useState([]);
  const [defaultStaff, setDefaultStaff] = useState([]);

  const NewTemplateSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    location: Yup.string().required('Location is required'),
    allocationType: Yup.string().required('Allocation Type is required')
  });

  const defaultValues = useMemo(
    () => ({
      title: currentTemplate?.title || '',
      location: currentTemplate?.location?._id || '',
      allocationType: currentTemplate?.allocationType || 'multiple'
    }),
    [currentTemplate]
  );

  const methods = useForm({
    resolver: yupResolver(NewTemplateSchema),
    defaultValues
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentTemplate && currentTemplate.location && users.length > 0) {
      const { location, sessions, days, areas, staff } = currentTemplate;

      const staffData = staff.map((_id) => users.find((item) => item._id === _id));
      console.log(staffData);
      setDefaultSessions([...sessions]);
      setDefaultDays([...days]);
      setDefaultAreas([...areas]);
      setDefaultStaff([...staffData]);
      reset(defaultValues);
    }
    if (!isEdit) {
      setDefaultDays([...DEFAULT_DAYS]);
      reset(defaultValues);
    }
  }, [isEdit, currentTemplate, users]);

  const onSubmit = async (values) => {
    try {
      const { title, location, allocationType } = values;

      const locationData = locations.find((loc) => loc._id === location);
      const sessionsData = defaultSessions.map(({ _id, title, startTime, endTime }) => ({
        _id,
        title,
        startTime,
        endTime
      }));
      const daysData = defaultDays.map(({ _id, title }) => ({
        _id,
        title
      }));
      const areasData = defaultAreas.map(({ _id, title, alternateName }) => ({
        _id,
        title,
        alternateName
      }));
      const staffData = defaultStaff.map(({ _id }) => _id);

      const mutation = isEdit ? updateTemplate : addTemplate;
      const templateToAddOrUpdate = {
        title,
        location: {
          _id: locationData._id,
          title: locationData.title,
          address: locationData.address
        },
        sessions: sessionsData,
        days: daysData,
        areas: areasData,
        staff: staffData,
        allocationType
      };

      if (isEdit) {
        templateToAddOrUpdate._id = currentTemplate._id;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      mutation({
        variables: {
          template: templateToAddOrUpdate
        },
        refetchQueries: [{ query: templatesQuery }]
      }).then((res) => {
        console.log(res);
        const { data } = res;
        const returnStatus = isEdit ? data.updateTemplate : data.addTemplate;
        if (returnStatus) {
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
          navigate(PATH_DASHBOARD.template.root);
        } else {
          enqueueSnackbar(!isEdit ? 'Created failed!' : 'Updated failed!', {
            variant: 'error',
            autoHideDuration: 2500,
            action: (key) => (
              <IconButton size="small" onClick={() => closeSnackbar(key)}>
                <Iconify icon="eva:close-outline" />
              </IconButton>
            )
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeSessions = (sessions) => {
    setDefaultSessions(sessions);
  };

  const handleChangeDays = (days) => {
    setDefaultDays(days);
  };

  const handleChangeAreas = (areas) => {
    setDefaultAreas(areas);
  };

  const handleChangeStaff = (staff) => {
    setDefaultStaff(staff);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Title" sx={{ maxWidth: 400 }} />
              <RHFSelect
                name="location"
                label="Location"
                InputLabelProps={{ shrink: true }}
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
              >
                <MenuItem value="">
                  <em>Choose Location</em>
                </MenuItem>
                {locations.map((option) => (
                  <MenuItem
                    key={option._id}
                    value={option._id}
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize'
                    }}
                  >
                    {option.address}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={sessions}
                disableCloseOnSelect
                value={defaultSessions}
                onChange={(event, session) => handleChangeSessions(session)}
                getOptionLabel={(option) => sentenceCase(option.title)}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option, { selected }) => (
                  <li {...props} style={{ padding: 0, margin: 1 }}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {sentenceCase(option.title)}
                  </li>
                )}
                renderInput={(params) => <TextField {...params} label="Sessions" placeholder="Choose Sessions" />}
              />

              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={DAYS}
                disableCloseOnSelect
                value={defaultDays}
                onChange={(event, day) => handleChangeDays(day)}
                getOptionLabel={(option) => sentenceCase(option.title)}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option, { selected }) => (
                  <li {...props} style={{ padding: 0, margin: 1 }}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {sentenceCase(option.title)}
                  </li>
                )}
                renderInput={(params) => <TextField {...params} label="Days" placeholder="Choose Days" />}
              />

              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={areas}
                disableCloseOnSelect
                value={defaultAreas}
                onChange={(event, area) => handleChangeAreas(area)}
                getOptionLabel={(option) => sentenceCase(option.title)}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option, { selected }) => (
                  <li {...props} style={{ padding: 0, margin: 1 }}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {sentenceCase(option.title)}
                  </li>
                )}
                renderInput={(params) => <TextField {...params} label="Areas" placeholder="Choose Areas" />}
              />

              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={users}
                disableCloseOnSelect
                value={defaultStaff}
                onChange={(event, staff) => handleChangeStaff(staff)}
                getOptionLabel={(option) => capitalCase(`${option.name.first} ${option.name.last}`)}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option, { selected }) => (
                  <li {...props} style={{ padding: 0, margin: 1 }}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {capitalCase(`${option.name.first} ${option.name.last}`)}
                  </li>
                )}
                renderInput={(params) => <TextField {...params} label="Staff" placeholder="Choose Staff" />}
              />
              <div>
                <LabelStyle>Allocation Type</LabelStyle>
                <RHFRadioGroup
                  name="allocationType"
                  options={ALLOCATION_TYPES}
                  defaultValue="multiple"
                  sx={{
                    '& .MuiFormControlLabel-root': { mr: 4 }
                  }}
                />
              </div>
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Template' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

const DAYS = [
  { _id: 1, title: 'Monday' },
  { _id: 2, title: 'Tuesday' },
  { _id: 3, title: 'Wednesday' },
  { _id: 4, title: 'Thursday' },
  { _id: 5, title: 'Friday' },
  { _id: 6, title: 'Saturday' },
  { _id: 7, title: 'Sunday' }
];

const DEFAULT_DAYS = [
  { _id: 1, title: 'Monday' },
  { _id: 2, title: 'Tuesday' },
  { _id: 3, title: 'Wednesday' },
  { _id: 4, title: 'Thursday' },
  { _id: 5, title: 'Friday' }
];

const ALLOCATION_TYPES = [
  { label: 'Multiple', value: 'multiple' },
  { label: 'Single', value: 'single' }
];
