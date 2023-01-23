import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// import queries
import { useQuery, useMutation } from '@apollo/react-hooks';
// @mui
import { Button, Container, IconButton } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Iconify from '../../../components/Iconify';

// sections
import TemplateList from './TemplateList';

// queries
import { templates as templatesQuery, editTemplate as editTemplateQuery } from '../../../_queries/Templates.gql';
import { schedules as schedulesQuery } from '../../../_queries/Schedules.gql';
// mutations
import { addTemplate as addTemplateMutation } from '../../../_mutations/Templates.gql';
import { removeTemplate as removeTemplateMutation } from '../../../_mutations/Templates.gql';
// ----------------------------------------------------------------------

export default function Template() {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [addTemplate] = useMutation(addTemplateMutation);
  const [removeTemplate] = useMutation(removeTemplateMutation);

  const [templates, setTemplates] = useState([]);
  const [duplicateId, setDuplicateId] = useState('');
  const [isDuplicating, setIsDuplicating] = useState(false);

  const { loading, data } = useQuery(templatesQuery);
  const tempData = (data && data.templates) || [];

  const scheData = useQuery(schedulesQuery).data;
  const schedules = (scheData && scheData.schedules) || [];

  const tData = useQuery(editTemplateQuery, { variables: { _id: duplicateId } }).data;
  const editTempData = tData && tData.template;

  useEffect(() => {
    if (editTempData && isDuplicating) {
      onSubmit(editTempData);
    }
  }, [editTempData]);

  useEffect(() => {
    const tData = tempData.map((temp) => {
      const isUsed = schedules.find((sche) => sche.template._id === temp._id);
      let isLocked = false;
      if (isUsed) isLocked = true;
      else isLocked = false;
      return { ...temp, isLocked };
    });
    setTemplates([...tData]);
  }, [tempData, schedules]);

  const deleteTemplate = (_id) => {
    removeTemplate({
      variables: {
        _id
      },
      refetchQueries: [{ query: templatesQuery }]
    }).then(async (res) => {
      enqueueSnackbar('Deleted successfully!', {
        variant: 'success',
        autoHideDuration: 2500,
        action: (key) => (
          <IconButton size="small" onClick={() => closeSnackbar(key)}>
            <Iconify icon="eva:close-outline" />
          </IconButton>
        )
      });
    });
  };

  const duplicateTemplate = (_id) => {
    setDuplicateId(_id);
    setIsDuplicating(true);
  };

  const onSubmit = async (values) => {
    try {
      const {
        title,
        location,
        areas,
        days,
        sessions,
        staff,
        allocationType,
        sessionDisplayType,
        areaDisplayType,
        staffDisplayType,
        templateTable
      } = values;

      const sessionsData = sessions.map(({ _id, title, endTime, startTime }) => ({ _id, title, endTime, startTime }));
      const daysData = days.map(({ _id, title }) => ({ _id, title }));
      const areasData = areas.map(({ _id, title, alternateName }) => ({ _id, title, alternateName }));
      templateTable.forEach((rows) => rows.forEach((col) => delete col.__typename));

      const mutation = addTemplate;
      const templateToAddOrUpdate = {
        title,
        location: {
          _id: location._id,
          title: location.title,
          address: location.address
        },
        sessions: sessionsData,
        days: daysData,
        areas: areasData,
        staff,
        allocationType,
        sessionDisplayType,
        areaDisplayType,
        staffDisplayType,
        templateTable
      };

      await new Promise((resolve) => setTimeout(resolve, 500));

      mutation({
        variables: {
          template: templateToAddOrUpdate
        },
        refetchQueries: [{ query: templatesQuery }]
      }).then((res) => {
        setIsDuplicating(false);
        const { data } = res;
        const returnStatus = data.addTemplate;
        if (returnStatus) {
          enqueueSnackbar('Duplicated successfully!', {
            variant: 'success',
            autoHideDuration: 2500,
            action: (key) => (
              <IconButton size="small" onClick={() => closeSnackbar(key)}>
                <Iconify icon="eva:close-outline" />
              </IconButton>
            )
          });
          navigate(PATH_DASHBOARD.template.edit(returnStatus._id));
        } else {
          enqueueSnackbar('Duplicated failed!', {
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

  return (
    <Page title="Template">
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading="Templates"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Template' }]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.template.create}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Template
            </Button>
          }
        />
        <TemplateList
          isLoading={loading}
          templateList={templates}
          onDelete={(id) => deleteTemplate(id)}
          onDuplicate={(id) => duplicateTemplate(id)}
        />
      </Container>
    </Page>
  );
}
