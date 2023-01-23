import { sentenceCase } from 'change-case';
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

TemplateTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onDeleteRow: PropTypes.func,
  onDuplicateRow: PropTypes.func
};

export default function TemplateTableRow({ row, selected, onEditRow, onDeleteRow, onDuplicateRow }) {
  const { title, cover, location, allocationType, isLocked, createdAt } = row;

  const mockImageUrl = '/assets/document.png';

  const [openMenu, setOpenMenuActions] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteAgree = (isAgree) => {
    setDeleteDialogOpen(false);
    if (isAgree) onDeleteRow();
  };

  const handleDuplicate = () => {
    setDuplicateDialogOpen(true);
  };

  const handleDuplicateAgree = (isAgree) => {
    setDuplicateDialogOpen(false);
    if (isAgree) onDuplicateRow();
  };

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ConfirmDialog
          onAgree={handleDeleteAgree}
          isOpen={deleteDialogOpen}
          title="Scheduler | Confirm"
          content="Are you sure to delete this item?"
        />
        <ConfirmDialog
          onAgree={handleDuplicateAgree}
          isOpen={duplicateDialogOpen}
          title="Scheduler | Confirm"
          content="Are you sure to duplicate this template?"
        />
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
      <TableCell align="left">{location.address}</TableCell>
      <TableCell align="left">{sentenceCase(allocationType)}</TableCell>
      <TableCell align="left">
        <Label color={isLocked ? 'warning' : 'info'}>{isLocked ? 'Locked' : 'Unassigned'}</Label>
      </TableCell>
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
                disabled={isLocked}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
                disabled={isLocked}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleDuplicate();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'heroicons:document-duplicate-solid'} />
                Duplicate
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
