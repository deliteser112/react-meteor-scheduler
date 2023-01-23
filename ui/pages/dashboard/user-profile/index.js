// meteor
import { useQuery } from '@apollo/react-hooks';
import { capitalCase } from 'change-case';

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// material
import { styled } from '@mui/material/styles';
import { Tabs, Tab, Card, Container, Box } from '@mui/material';

// components
import Page from '../../../components/Page';
import LoadingScreen from '../../../components/LoadingScreen';
import Iconify from '../../../components/Iconify';

//
import ProfileCover from './ProfileCover';
import ProfileSettings from './ProfileSettings';
import ProfileEntity from './ProfileEntity';
import ProfileGeneral from './ProfileGeneral';

// import queries
import { user as userQuery } from '../../../_queries/Users.gql';
import { entities as entitiesQuery } from '../../../_queries/Entities.gql';
import { locations as locationsQuery } from '../../../_queries/Locations.gql';
// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center'
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3)
  }
}));

export default function UserProfile() {
  const { userId } = useParams();
  const { pathname } = useLocation();
  const isEdit = !!pathname.includes('edit');

  // get user information
  const { data, loading } = useQuery(userQuery, { variables: { _id: userId } });

  // get entities and locations
  const eData = useQuery(entitiesQuery).data;
  const entities = (eData && eData.entities) || [];

  const lData = useQuery(locationsQuery).data;
  const locations = (lData && lData.locations) || [];

  const [currentTab, onChangeTab] = useState('profile');

  const user = data && data.user;

  if (loading || !user) return <LoadingScreen isDashboard />;

  const { _id, name, emailAddress, avatarUrl } = user;
  const coverURL = '/static/contact/contact-hero.jpg';

  const myProfile = {
    _id,
    position: 'Admin',
    email: emailAddress,
    displayName: `${name.first} ${name.last ? name.last : ''}`,
    coverURL,
    avatarUrl
  };

  const PROFILE_TABS = [
    {
      value: 'profile',
      icon: <Iconify icon="et:profile-male" width={20} height={20} />,
      component: <ProfileGeneral currentUser={user} isEdit={isEdit} />
    },
    {
      value: 'entity',
      icon: <Iconify icon="cil:school" width={20} height={20} />,
      component: (
        <ProfileEntity currentUser={user} entities={entities} locations={locations} userId={user._id} isEdit={isEdit} />
      )
    },
    {
      value: 'settings',
      icon: <Iconify icon="uiw:setting-o" width={20} height={20} />,
      component: <ProfileSettings settings={user.settings} userId={user._id} />
    }
  ];

  return (
    <Page title="Profile">
      <Container>
        <Card
          sx={{
            mb: 3,
            height: 220,
            position: 'relative'
          }}
        >
          <ProfileCover myProfile={myProfile} />
          <TabsWrapperStyle>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={(event, newValue) => onChangeTab(newValue)}
            >
              {PROFILE_TABS.map((tab) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalCase(tab.value)} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
