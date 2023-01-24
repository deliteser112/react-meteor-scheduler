import PropTypes from 'prop-types';
import React, { useState } from 'react';
// @mui
import { TableRow, TableCell, MenuItem, Typography } from '@mui/material';
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
  isAdmin: PropTypes.bool,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onPreviewSchedule: PropTypes.func,
  onPublishSchedule: PropTypes.func
};

export default function ScheduleTableRow({
  row,
  isAdmin,
  selected,
  onEditRow,
  onDeleteRow,
  onPreviewSchedule,
  onPublishSchedule
}) {
  const { _id, title, startDate, endDate, template, state, cover, createdAt } = row;

  const mockImageUrl = '/assets/document.png';

  const [openMenu, setOpenMenuActions] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  const handleDelete = () => {
    setDialogOpen(true);
  };

  const handleAgree = (isAgree) => {
    setDialogOpen(false);
    if (isAgree) onDeleteRow();
  };

  const handlePublish = () => {
    setPublishDialogOpen(true);
  };

  const handlePublishAgree = (isAgree) => {
    setPublishDialogOpen(false);
    if (isAgree) onPublishSchedule(state);
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
          onAgree={handleAgree}
          isOpen={dialogOpen}
          title="Scheduler | Confirm"
          content="Are you sure to delete this item?"
        />

        <ConfirmDialog
          onAgree={handlePublishAgree}
          isOpen={publishDialogOpen}
          title="Scheduler | Confirm"
          content={`Are you sure to ${state === 'Published' ? 'back to Drafted' : 'publish'} this schedule?`}
        />
        <Image
          disabledEffect
          alt={title}
          src={(cover && cover.url) || mockImageUrl}
          sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}
        />
        <Typography
          variant="subtitle2"
          noWrap
          onClick={() => onPreviewSchedule(_id)}
          sx={{
            textDecoration: 'underline',
            '&:hover': { textDecoration: 'none', color: '#255cb0', cursor: 'pointer' }
          }}
        >
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
        {isAdmin && (
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

                <MenuItem
                  onClick={() => {
                    handlePublish();
                    handleCloseMenu();
                  }}
                  sx={{ color: state === 'Drafted' ? 'info.main' : 'warning.dark' }}
                >
                  <Iconify
                    icon={state === 'Drafted' ? 'ic:baseline-published-with-changes' : 'fa-solid:drafting-compass'}
                  />
                  {state === 'Published' ? 'Back to Drafted' : 'Publish Schedule'}
                </MenuItem>
              </>
            }
          />
        )}
      </TableCell>
    </TableRow>
  );
}
