import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// import mutations
import { useMutation } from '@apollo/react-hooks';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';

import { Card, Grid, Stack, MenuItem, Box, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

// mutations
import {
  addLocation as addLocationMutation,
  updateLocation as updateLocationMutation
} from '../../../_mutations/Locations.gql';
import { locations as locationsQuery } from '../../../_queries/Locations.gql';

// ----------------------------------------------------------------------

LocationNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentLocation: PropTypes.object,
  entities: PropTypes.array
};

export default function LocationNewForm({ isEdit, currentLocation, entities }) {
  const [addLocation] = useMutation(addLocationMutation);
  const [updateLocation] = useMutation(updateLocationMutation);
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [entityValue, setEntityValue] = useState('');

  const NewLocationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    address: Yup.string().required('Address is required'),
    entity: Yup.string().required('Entity is required')
  });

  const defaultValues = useMemo(
    () => ({
      title: currentLocation?.title || '',
      address: currentLocation?.address || '',
      entity: currentLocation?.entity || []
    }),
    [currentLocation]
  );

  const methods = useForm({
    resolver: yupResolver(NewLocationSchema),
    defaultValues
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentLocation) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentLocation]);

  const onSubmit = async (values) => {
    try {
      console.log('Values:', values);
      const { title, address, entity } = values;

      const entityData = entities.find((ent) => ent._id === entity);

      const mutation = isEdit ? updateLocation : addLocation;
      const locationToAddOrUpdate = {
        title,
        address,
        entity: {
          _id: entityData._id,
          title: entityData.title
        }
      };

      if (isEdit) {
        locationToAddOrUpdate._id = currentLocation._id;
      }

      mutation({
        variables: {
          ...locationToAddOrUpdate
        },
        refetchQueries: [{ query: locationsQuery }]
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
        navigate(PATH_DASHBOARD.location.root);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEntityValue = (evt) => {
    setEntityValue(evt.target.value);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Title" sx={{ maxWidth: 400 }} />
              <RHFTextField name="address" label="Address" sx={{ maxWidth: 400 }} />
              <RHFSelect
                name="entity"
                label="Entity"
                InputLabelProps={{ shrink: true }}
                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
              >
                <MenuItem value="">
                  <em>Choose Entity</em>
                </MenuItem>
                {entities.map((option) => (
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
                    {option.title}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Location' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
