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
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';

import { Card, Grid, Stack, Box, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';

// mutations
import { addEntity as addEntityMutation, updateEntity as updateEntityMutation } from '../../../_mutations/Entities.gql';
import { entities as entitiesQuery } from '../../../_queries/Entities.gql';

// ----------------------------------------------------------------------

EntityNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentEntity: PropTypes.object
};

export default function EntityNewForm({ isEdit, currentEntity }) {
  const [addEntity] = useMutation(addEntityMutation);
  const [updateEntity] = useMutation(updateEntityMutation);
  const navigate = useNavigate();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const NewEntitySchema = Yup.object().shape({
    title: Yup.string().required('Title is required')
  });

  const defaultValues = useMemo(
    () => ({
      title: currentEntity?.title || ''
    }),
    [currentEntity]
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
    if (isEdit && currentEntity) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentEntity]);

  const onSubmit = async (values) => {
    try {
      const { title } = values;

      const mutation = isEdit ? updateEntity : addEntity;
      const entityToAddOrUpdate = {
        title
      };

      if (isEdit) {
        entityToAddOrUpdate._id = currentEntity._id;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      
      mutation({
        variables: {
          ...entityToAddOrUpdate
        },
        refetchQueries: [{ query: entitiesQuery }]
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
        navigate(PATH_DASHBOARD.entity.root);
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
              <RHFTextField name="title" label="Entity Title" sx={{ maxWidth: 400 }} />
            </Stack>
            <Box m={2} />
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {!isEdit ? 'Create Entity' : 'Save Changes'}
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
