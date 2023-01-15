import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import React, { useEffect, useMemo, useState } from 'react';
import { sentenceCase } from 'change-case';

// @mui
import { Autocomplete, Card, Checkbox, FormControlLabel, Stack, TextField, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// mutations & queries
import { updateUser as updateUserMutation } from '../../../_mutations/Users.gql';
import { users as usersQuery } from '../../../_queries/Users.gql';

// forms
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// ----------------------------------------------------------------------

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2
  }
}));

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  entities: PropTypes.array,
  locations: PropTypes.array
};

export default function UserNewEditForm({ isEdit, currentUser, entities, locations }) {
  const [updateUser] = useMutation(updateUserMutation);

  const [defaultEntities, setDefaultEntities] = useState([]);
  const [defaultLocations, setDefaultLocations] = useState([]);

  const [enableStatus, setEnableStatus] = useState(false);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewEntitySchema = Yup.object().shape({
    class: Yup.string().required('Class is required')
  });

  const defaultValues = useMemo(
    () => ({
      class: currentUser?.class || ''
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewEntitySchema),
    defaultValues
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      if (currentUser.class) {
        setEnableStatus(true);
        const { entities, locations } = currentUser;
        const tmpEntities = [];
        entities.map((item) => {
          tmpEntities.push(item);
        });
        setDefaultEntities([...tmpEntities]);

        const tmpLocations = [];
        locations.map((item) => {
          tmpLocations.push(item);
        });
        setDefaultLocations([...tmpLocations]);
      }

      defaultValues;
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser]);

  const onSubmit = async (values) => {
    const entities = [];
    defaultEntities.map(({ _id, title }) => {
      entities.push({ _id, title });
    });

    const locations = [];
    defaultLocations.map(({ _id, title }) => {
      locations.push({ _id, title });
    });

    const userUpdate = {
      entities,
      locations,
      class: values.class
    };

    if (currentUser) userUpdate._id = currentUser._id;

    await new Promise((resolve) => setTimeout(resolve, 500));

    updateUser({ variables: { user: userUpdate }, refetchQueries: usersQuery }).then(() => {
      reset();
      enqueueSnackbar('Update success!', {
        variant: 'success',
        autoHideDuration: 1500
      });
      navigate(PATH_DASHBOARD.user.root);
    });
  };

  const handleChangeEntities = (entities) => {
    setDefaultEntities(entities);
  };

  const handleChangeLocations = (locations) => {
    setDefaultLocations(locations);
  };

  const handleChangeEnableStatus = (e) => {
    setEnableStatus(e.target.checked);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <FormControlLabel
            label="Enable Status"
            control={<Android12Switch checked={enableStatus} onChange={(e) => handleChangeEnableStatus(e)} />}
          />
          <RHFTextField name="class" label="Class" disabled={!enableStatus} />

          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={entities}
            disableCloseOnSelect
            value={defaultEntities}
            onChange={(event, entity) => handleChangeEntities(entity)}
            getOptionLabel={(option) => sentenceCase(option.title)}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {sentenceCase(option.title)}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => <TextField {...params} label="Entities" placeholder="Set entities" />}
            disabled={!enableStatus}
          />

          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={locations}
            disableCloseOnSelect
            value={defaultLocations}
            onChange={(event, location) => handleChangeLocations(location)}
            getOptionLabel={(option) => sentenceCase(option.title)}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {sentenceCase(option.title)}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => <TextField {...params} label="Locations" placeholder="Set locations" />}
            disabled={!enableStatus}
          />

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!enableStatus}>
              {!isEdit ? 'Create User' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
    </FormProvider>
  );
}
