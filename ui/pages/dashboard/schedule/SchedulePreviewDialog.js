import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// import queries
import { useQuery } from '@apollo/react-hooks';

import { styled } from '@mui/material/styles';

import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Divider } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

// queries
import { editSchedule as editScheduleQuery } from '../../../_queries/Schedules.gql';
import { editTemplate as editTemplateQuery } from '../../../_queries/Templates.gql';
import { allUsers as allUsersQuery } from '../../../_queries/Users.gql';

// components
import Iconify from '../../../components/Iconify';

import SchedulePreview from './SchedulePreview';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    maxWidth: 'none',
    width: '100%'
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired
};

SchedulePreviewDialog.propTypes = {
  scheduleId: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default function SchedulePreviewDialog({ scheduleId, isOpen, onClose }) {
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState('');

  const [schedule, setSchedule] = useState({});
  const [template, setTemplate] = useState({});
  const [users, setUsers] = useState([]);

  const scheData = useQuery(editScheduleQuery, { variables: { _id: scheduleId } }).data;
  const currentSchedule = scheData && scheData.schedule;

  const tempData = useQuery(editTemplateQuery, { variables: { _id: templateId } }).data;
  const currentTemplate = tempData && tempData.template;

  const userData = useQuery(allUsersQuery).data;
  const currentUsers = userData && userData.allUsers;

  useEffect(() => {
    if (currentSchedule && currentSchedule.template) {
      const { template } = currentSchedule;
      setTemplateId(template._id);
    }
  }, [currentSchedule]);

  useEffect(() => {
    if (currentSchedule && currentTemplate && currentUsers) {
      setSchedule(currentSchedule);
      setTemplate(currentTemplate);
      setUsers(currentUsers);
    }
  }, [currentSchedule, currentTemplate, currentUsers]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Schedule Preview
      </BootstrapDialogTitle>
      <Divider />
      <DialogContent dividers>
        {schedule && schedule.template && template && template.templateTable && (
          <SchedulePreview currentSchedule={schedule} template={template} users={users} />
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" startIcon={<Iconify icon={'ant-design:file-pdf-filled'} width={20} height={20} />}>
          Download as PDF
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
