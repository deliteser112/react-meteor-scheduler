import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import uuid from 'uuid/v4';
import { capitalCase } from 'change-case';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// mui
import { Divider, Stack, AvatarGroup, Button, Typography } from '@mui/material';
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

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
/**
 * Moves an item from one list to another list.
 */
const copy = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

  const item = sourceClone[droppableSource.index];
  const isExist = destClone.find((dest) => dest._id === item._id);

  if (!isExist) destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
  return destClone;
};

const move = (source, destination, droppableSource, droppableDestination, sourceData) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

  const [removed] = sourceClone.splice(droppableSource.index, 1);

  const isExist = destClone.find((dest) => dest._id === removed._id);

  if (!isExist) {
    destClone.splice(droppableDestination.index, 0, removed);

    const sR = droppableSource.droppableId.split('_')[0];
    const sC = droppableSource.droppableId.split('_')[1];

    const dR = droppableDestination.droppableId.split('_')[0];
    const dC = droppableDestination.droppableId.split('_')[1];

    sourceData[sR][sC].list = sourceClone;
    sourceData[dR][dC].list = destClone;
  }

  return sourceData;
};

export default function ScheduleTemplate({ template, users }) {
  const {
    templateTable,
    allocationType,
    staff,
    areaDisplayType,
    sessionDisplayType,
    staffDisplayType,
    areas,
    days,
    sessions
  } = template;

  console.log('TEMPLATWE', template);

  const [scheduleData, setScheduleData] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  // useEffect(() => {
  //   const tables = generateTable(AREAS.length * DAYS.length, SESSIONS.length);
  //   setScheduleData([...tables]);
  // }, []);

  useEffect(() => {
    setScheduleData([...templateTable]);
  }, [templateTable]);

  useEffect(() => {
    const assUsers = staff.map((_id) => {
      const item = users.find((user) => user._id === _id);
      return { ...item, id: uuid() };
    });
    console.log('HELLO', assUsers);
    setAssignedUsers([...assUsers]);
  }, [staff, users]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    console.log('==> result', result);

    const sR = source.droppableId.split('_')[0];
    const sC = source.droppableId.split('_')[1];

    const dR = destination.droppableId.split('_')[0];
    const dC = destination.droppableId.split('_')[1];

    const sche = scheduleData;
    const isEmpty = !sche[dR][dC].list.length;

    switch (source.droppableId) {
      case destination.droppableId:
        sche[dR][dC].list = reorder(sche[sR][sC].list, source.index, destination.index);

        setScheduleData([...sche]);
        break;
      case 'assignedUsers':
        if (isEmpty) {
          sche[dR][dC].list = copy(assignedUsers, sche[dR][dC].list, source, destination);
        } else if (allocationType === 'multiple') {
          sche[dR][dC].list = copy(assignedUsers, sche[dR][dC].list, source, destination);
        }

        console.log('SCHE:', sche);

        setScheduleData([...sche]);
        break;
      default:
        let movedResult = sche;
        if (isEmpty) {
          movedResult = move(sche[sR][sC].list, sche[dR][dC].list, source, destination, sche);
        } else if (allocationType === 'multiple') {
          movedResult = move(sche[sR][sC].list, sche[dR][dC].list, source, destination, sche);
        }

        setScheduleData([...movedResult]);
        break;
    }
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="assignedUsers" isDropDisabled={true}>
        {(provided, snapshot) => (
          <div
            className="kiosk"
            ref={provided.innerRef}
            style={{
              border: `1px
              ${snapshot.isDraggingOver ? 'dashed #000' : 'solid #ddd'}`
            }}
          >
            <Typography
              variant="overline"
              sx={{
                mt: 2,
                mb: 1,
                display: 'block',
                color: 'info.main'
              }}
            >
              Template Details
            </Typography>

            <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

            <Typography variant="body2">
              Allocation Type: <b>{capitalCase(allocationType)}</b>
            </Typography>
            <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />
            <Typography variant="body2">
              Area Display Type: <b>{capitalCase(areaDisplayType)}</b>
            </Typography>
            <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />
            <Typography variant="body2">
              Session Display Type: <b>{capitalCase(sessionDisplayType)}</b>
            </Typography>
            <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />
            <Typography variant="body2">
              Staff Display Type: <b>{capitalCase(staffDisplayType)}</b>
            </Typography>
            <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />

            <Typography
              variant="overline"
              sx={{
                mt: 5,
                mb: 1,
                display: 'block',
                color: 'info.main'
              }}
            >
              Assigned Users
            </Typography>

            <Divider sx={{ borderStyle: 'dashed', mb: 2 }} />

            {assignedUsers.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <>
                    <div
                      className="kiosk-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      // isDragging={snapshot.isDragging}
                      style={{ ...provided.draggableProps.style }}
                    >
                      {capitalCase(
                        staffDisplayType === 'name' || !item.class
                          ? `${getStringName(item.name.first, item.name.last)}`
                          : `${item.class}`
                      )}
                    </div>
                    {snapshot.isDragging && (
                      <div className="clone" style={{ backgroundColor: 'green', color: 'white', padding: '5px 10px' }}>
                        {capitalCase(
                          staffDisplayType === 'name' || !item.class
                            ? `${getStringName(item.name.first, item.name.last)}`
                            : `${item.class}`
                        )}
                      </div>
                    )}
                  </>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
      <div className="schedule-content">
        <div className="d-flex">
          <div className="flex-300" />
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
            {templateTable.map((rows, rowIdx) => {
              return (
                <div key={`row_${rowIdx}`} className="d-flex">
                  {rows.map(({ list, isBlocked }, colIdx) => {
                    return (
                      <Droppable
                        key={`${rowIdx}_${colIdx}`}
                        droppableId={`${rowIdx}_${colIdx}`}
                        isDropDisabled={isBlocked}
                        direction="horizontal"
                      >
                        {(provided, snapshot) => (
                          <div
                            className="cell"
                            ref={provided.innerRef}
                            style={{
                              backgroundColor: `${
                                isBlocked ? '#ddd' : `${snapshot.isDraggingOver ? 'rgb(206 177 64)' : '#ffeb9c'}`
                              }`
                            }}
                          >
                            {list.length ? (
                              <AvatarGroup max={3} sx={{ flexDirection: list.length > 3 ? 'row-reverse' : 'row' }}>
                                {list.map((item, index) => (
                                  <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        // className="item"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        // isDragging={snapshot.isDragging}
                                        style={provided.draggableProps.style}
                                      >
                                        <HtmlTooltip
                                          title={
                                            <React.Fragment>
                                              <Stack spacing={1}>
                                                <Typography color="inherit" variant="caption">
                                                  Name: <b>{getStringName(item?.name?.first, item?.name?.last)}</b>
                                                </Typography>
                                                <Typography color="inherit" variant="caption">
                                                  Class: <b>{item.class ? item.class : 'None'}</b>
                                                </Typography>
                                                <Button
                                                  variant="contained"
                                                  size="small"
                                                  onClick={() => {
                                                    const newScheData = [...scheduleData];
                                                    newScheData[rowIdx][colIdx].list.splice(index, 1);
                                                    setScheduleData(newScheData.filter((group) => group.length));
                                                  }}
                                                >
                                                  Remove this staff
                                                </Button>
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
                                    )}
                                  </Draggable>
                                ))}
                              </AvatarGroup>
                            ) : (
                              !provided.placeholder && <div className="notice">-</div>
                            )}
                            {/* {provided.placeholder} */}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

ScheduleTemplate.propTypes = {
  template: PropTypes.object,
  users: PropTypes.array
};

function getStringTimeRange(startTime, endTime) {
  return `${fTime(startTime)} - ${fTime(endTime)}`;
}

function getStringName(first, last) {
  return `${first} ${last}`;
}
