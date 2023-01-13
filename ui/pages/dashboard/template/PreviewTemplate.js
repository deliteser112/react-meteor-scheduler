import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// utils
import { fTime } from '../../../utils/formatTime';

PreviewTemplate.propTypes = {
  sessionDisplayType: PropTypes.string,
  areaDisplayType: PropTypes.string,
  templateTable: PropTypes.array,
  sessions: PropTypes.array,
  areas: PropTypes.array,
  days: PropTypes.array,
  onScheduleTable: PropTypes.func
};

export default function PreviewTemplate({
  sessionDisplayType,
  areaDisplayType,
  templateTable,
  sessions,
  areas,
  days,
  isBlocking = true,
  onScheduleTable
}) {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    setScheduleData([...templateTable]);
  }, [templateTable]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log({ source, destination });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="d-flex">
        <div className="flex-300" />
        {sessions &&
          sessions.map((item) => (
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
          {days &&
            days.map((day) => (
              <div key={day._id} className="d-flex">
                <div className="days">
                  <span>{day.title}</span>
                </div>
                <div style={{ flex: '0 0 150px' }}>
                  {areas &&
                    areas.map((area) => (
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
                    <Droppable
                      key={`${rowIdx}_${colIdx}`}
                      droppableId={`${rowIdx}_${colIdx}`}
                      isDropDisabled={isBlocked}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="cell"
                          ref={provided.innerRef}
                          style={{
                            backgroundColor: `${isBlocked ? '#ddd' : '#ffeb9c'}`
                          }}
                          onClick={() => {
                            if (isBlocking) {
                              const newScheData = [...scheduleData];
                              const blockedOut = newScheData[rowIdx][colIdx].isBlocked;
                              newScheData[rowIdx][colIdx].isBlocked = !blockedOut;
                              onScheduleTable([...newScheData]);
                              setScheduleData([...newScheData]);
                            }
                          }}
                        >
                          {list.length
                            ? list.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      className="item"
                                      innerRef={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      isDragging={snapshot.isDragging}
                                      style={provided.draggableProps.style}
                                    >
                                      <svg
                                        onClick={() => {
                                          const newScheData = [...scheduleData];
                                          newScheData[rowIdx][colIdx].list.splice(index, 1);
                                          setScheduleData(newScheData.filter((group) => group.length));
                                        }}
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        style={{
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6Z"
                                        />
                                      </svg>
                                      <div
                                        style={{
                                          maxWidth: 135,
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis'
                                        }}
                                      >
                                        {item.content}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            : !provided.placeholder && <div className="notice">-</div>}
                          {provided.placeholder}
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
    </DragDropContext>
  );
}

function getStringTimeRange(startTime, endTime) {
  return `${fTime(startTime)} - ${fTime(endTime)}`;
}
