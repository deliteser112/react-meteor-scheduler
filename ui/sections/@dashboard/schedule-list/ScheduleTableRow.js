import PropTypes from 'prop-types';
import React, { useState } from 'react';
// @mui
import { TableRow, TableCell, MenuItem, Checkbox, Typography } from '@mui/material';
// components
import Image from '../../../components/Image';
import { TableMoreMenu } from '../../../components/table';
import Iconify from '../../../components/Iconify';
import ConfirmDialog from '../../../components/ConfirmDialog';
import Label from '../../../components/Label';

// utils
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

ScheduleTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func
};

export default function ScheduleTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { title, startDate, endDate, template, state, cover, createdAt } = row;

  const mockImageUrl = '/assets/document.png';

  const [openMenu, setOpenMenuActions] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = () => {
    setDialogOpen(true);
  };

  const handleAgree = (isAgree) => {
    setDialogOpen(false);
    if (isAgree) onDeleteRow();
  };

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <ConfirmDialog
          onAgree={handleAgree}
          isOpen={dialogOpen}
          title="Scheduler | Confirm"
          content="Are you sure to delete this item?"
        />
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image
          disabledEffect
          alt={title}
          src={(cover && cover.url) || mockImageUrl}
          sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
        />
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>
      </TableCell>
      <TableCell align="left">{template.title}</TableCell>
      <TableCell align="left">
        <Label color={state === 'Published' ? 'success' : 'info'}>{state}</Label>
      </TableCell>
      <TableCell align="left">Admin</TableCell>
      <TableCell align="left">{fDate(new Date(startDate))}</TableCell>
      <TableCell align="left">{fDate(new Date(endDate))}</TableCell>
      <TableCell align="left">{fDate(new Date(createdAt))}</TableCell>
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  handleDelete();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
