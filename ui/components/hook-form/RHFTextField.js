import React from 'react';
import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

// ----------------------------------------------------------------------

const BootstrapInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    borderRadius: 0
  }
}));

RHFTextField.propTypes = {
  name: PropTypes.string
};

export default function RHFTextField({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <BootstrapInput
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
          size="small"
          variant="filled"
        />
      )}
    />
  );
}
