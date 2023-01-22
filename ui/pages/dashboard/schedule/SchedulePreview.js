import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import uuid from 'uuid/v4';

// mui
import { Stack, AvatarGroup, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

// components
import MyAvatar from '../../../components/MyAvatar';

// utils
import { fTime } from '../../../utils/formatTime';

// custom components
const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9'
    }
  })
);

export default function SchedulePreview({ currentSchedule, template, users }) {
  const { templateTable, areaDisplayType, sessionDisplayType, areas, days, sessions } = template;

  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    if (currentSchedule) {
      const { scheduleTable } = currentSchedule;
      const table = getScheduleTable(scheduleTable, users);
      setScheduleData([...table]);
    } else {
      setScheduleData([...templateTable]);
    }
  }, [users, templateTable, currentSchedule]);

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <div className="schedule-content" style={{ marginRight: 0 }}>
      <div className="d-flex">
        <div className="flex-300" style={{ backgroundColor: '#ffc7ce' }} />
        {sessions.map((item) => (
          <div
            className="cell"
            key={item._id}
            style={{ backgroundColor: '#FFC7CE', color: '#9C0006', textAlign: 'center' }}
          >
            {sessionDisplayType === 'title' ? item.title : getStringTimeRange(item.startTime, item.endTime)}
          </div>
        ))}
      </div>
      <div className="d-flex">
        <div className="flex-300">
          {days.map((day) => (
            <div key={day._id} className="d-flex">
              <div className="days">{day.title}</div>
              <div className="flex-150">
                {areas.map((area) => (
                  <div className="cell" key={area._id} style={{ backgroundColor: '#C6EFCE' }}>
                    <div className="notice" style={{ color: '#006100' }}>
                      {areaDisplayType === 'title' ? area.title : area.alternateName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div>
          {scheduleData.map((rows, rowIdx) => {
            return (
              <div key={`row_${rowIdx}`} className="d-flex">
                {rows.map(({ list, isBlocked }, colIdx) => {
                  return (
                    <div
                      key={`${rowIdx}_${colIdx}`}
                      className="cell"
                      style={{
                        backgroundColor: `${isBlocked ? '#ddd' : '#ffeb9c'}`
                      }}
                    >
                      {list.length ? (
                        <AvatarGroup
                          max={3}
                          sx={{
                            flexDirection: list.length > 3 ? 'row-reverse' : 'row',
                            '& .MuiAvatarGroup-avatar:first-of-type': { backgroundColor: '#ffffff00' }
                          }}
                        >
                          {list.map((item, index) => (
                            <div key={item.id}>
                              <HtmlTooltip
                                title={
                                  <React.Fragment>
                                    <Stack spacing={2} direction="row" alignItems="center">
                                      <Stack spacing={0}>
                                        <Typography color="inherit" variant="caption">
                                          Name: <b>{getStringName(item?.name?.first, item?.name?.last)}</b>
                                        </Typography>
                                        <Typography color="inherit" variant="caption">
                                          Class: <b>{item.class ? item.class : 'None'}</b>
                                        </Typography>
                                      </Stack>
                                    </Stack>
                                  </React.Fragment>
                                }
                                placement="top"
                                arrow
                              >
                                <div>
                                  <MyAvatar
                                    avatarUrl={item.avatarUrl}
                                    displayName={getStringName(item?.name?.first, item?.name?.last)}
                                  />
                                </div>
                              </HtmlTooltip>
                            </div>
                          ))}
                        </AvatarGroup>
                      ) : (
                        <div className="notice">-</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

SchedulePreview.propTypes = {
  currentSchedule: PropTypes.object,
  template: PropTypes.object,
  users: PropTypes.array
};

function getStringTimeRange(startTime, endTime) {
  return `${fTime(startTime)} - ${fTime(endTime)}`;
}

function getStringName(first, last) {
  return `${first} ${last}`;
}

function getScheduleTable(scheArray, users) {
  const resultArray = scheArray.map((rows) =>
    rows.map((col) => {
      let modifiedList = [];
      if (col.list.length > 0) {
        modifiedList = col.list.map((_id) => {
          const item = users.find((user) => user._id === _id);
          return { ...item, id: uuid() };
        });
      }
      return { ...col, list: modifiedList };
    })
  );

  return resultArray;
}
