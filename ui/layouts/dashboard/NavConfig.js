import React from 'react';
// component
import Iconify from '../../components/Iconify';

import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    subheader: 'DASHBOARD',
    items: [
      {
        title: 'dashboard',
        path: `${PATH_DASHBOARD.analytics}`,
        icon: getIcon('eva:pie-chart-2-fill')
      },
      // {
      //   title: 'documents',
      //   path: `${PATH_DASHBOARD.document.root}`,
      //   icon: getIcon('gala:file-doc')
      // },
      {
        title: 'sessions',
        path: `${PATH_DASHBOARD.session.root}`,
        icon: getIcon('mdi:class')
      },
      {
        title: 'locations',
        path: `${PATH_DASHBOARD.location.root}`,
        icon: getIcon('mdi:location-add-outline')
      },
      {
        title: 'areas',
        path: `${PATH_DASHBOARD.area.root}`,
        icon: getIcon('mdi:folder-special')
      },
      {
        title: 'templates',
        path: `${PATH_DASHBOARD.template.root}`,
        icon: getIcon('fluent:mail-template-20-regular')
      }
    ]
  },
  {
    subheader: 'Admin',
    items: [
      {
        title: 'entities',
        path: `${PATH_DASHBOARD.entity.root}`,
        icon: getIcon('material-symbols:school')
      },
      {
        title: 'users',
        path: `${PATH_DASHBOARD.user.root}`,
        icon: getIcon('gis:globe-users')
      },
      {
        title: 'user settings',
        path: `${PATH_DASHBOARD.user.settings}`,
        icon: getIcon('fluent:people-settings-28-regular')
      }
    ]
  }
];

export default navConfig;
