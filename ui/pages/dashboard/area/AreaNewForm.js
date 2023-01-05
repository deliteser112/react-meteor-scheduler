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
import { addArea as addAreaMutation, updateArea as updateAreaMutation } from '../../../_mutations/Areas.gql';
import { areas as areasQuery } from '../../../_queries/Areas.gql';

// ----------------------------------------------------------------------

AreaNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentArea: PropTypes.object
};

export default function AreaNewForm({ isEdit, currentArea }) {
  const [addArea] = useMutation(addAreaMutation);
  const [updateArea] = useMutation(updateAreaMutation);
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewAreaSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    alternateName: Yup.string().required('Alternate Name is required')
  });

  const defaultValues = useMemo(
    () => ({
      title: currentArea?.title || '',
      alternateName: currentArea?.alternateName || ''
    }),
    [currentArea]
  );

  const methods = useForm({
    resolver: yupResolver(NewAreaSchema),
    defaultValues
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (isEdit && currentArea) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentArea]);

  const onSubmit = async (values) => {
    try {
      const { title, alternateName } = values;

      const mutation = isEdit ? updateArea : addArea;
      const areaToAddOrUpdate = {
        title,
        alternateName
      };

      if (isEdit) {
        areaToAddOrUpdate._id = currentArea._id;
      }

      mutation({
        variables: {
          ...areaToAddOrUpdate
        },
        refetchQueries: [{ query: areasQuery }]
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
        navigate(PATH_DASHBOARD.area.root);
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
              {!isEdit ? 'Create Area' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
