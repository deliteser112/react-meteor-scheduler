import React, { useState, useEffect } from 'react';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

const Content = styled.div`
  margin-right: 200px;
  padding: 10px;
`;

const Item = styled.div`
  display: flex;
  user-select: none;
  padding: 0;
  margin: 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  background: #fff;
  max-width: 150px;
  border: 1px ${(props) => (props.isDragging ? 'dashed #4099ff' : 'solid #ddd')};
  box-sizing: border-box;
`;

const Clone = styled(Item)`
  + div {
    display: none !important;
  }
`;
const List = styled.div`
  border: 1px ${(props) => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};

  padding: 0;
  flex: 0 0 150px;
  font-family: sans-serif;
`;

const Kiosk = styled(List)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 200px;
  padding-top: 100px;
`;

const Cell = styled(List)`
  padding: 2px;
  background-color: ${(props) => (props.isDropDisabled ? 'lightgrey' : '#ffeb9c')};
  max-width: 250px;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 0;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
  user-select: none;
`;
function PreviewTemplate() {
  const [scheduleData, setScheduleData] = useState([]);

  const [isBlocking, setIsBlocking] = useState(false);
  const [allocationType, setAllocationType] = useState(false);

  const handleIsBlocking = () => {
    setIsBlocking(!isBlocking);
  };

  const handleAllocationType = () => {
    setAllocationType(!allocationType);
  };

  useEffect(() => {
    const tables = generateTable(AREAS.length * DAYS.length, SESSIONS.length);
    setScheduleData([...tables]);
  }, []);

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
      case 'ITEMS':
        if (isEmpty) {
          sche[dR][dC].list = copy(ITEMS, sche[dR][dC].list, source, destination);
        } else if (allocationType) {
          sche[dR][dC].list = copy(ITEMS, sche[dR][dC].list, source, destination);
        }

        setScheduleData([...sche]);
        break;
      default:
        let movedResult = sche;
        if (isEmpty) {
          movedResult = move(sche[sR][sC].list, sche[dR][dC].list, source, destination, sche);
        } else if (allocationType) {
          movedResult = move(sche[sR][sC].list, sche[dR][dC].list, source, destination, sche);
        }

        setScheduleData([...movedResult]);
        break;
    }
  };

  const generateTable = (rows, cols) =>
    Array.from({ length: rows }).map(() => Array.from({ length: cols }).map(() => ({ list: [], isBlocked: false })));

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="ITEMS" isDropDisabled={true}>
        {(provided, snapshot) => (
          <Kiosk innerRef={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
            <div>
              <label>
                <input type="checkbox" checked={isBlocking} onChange={handleIsBlocking} style={{ marginBottom: 20 }} />
                Blocked Out - 1
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={allocationType}
                  onChange={handleAllocationType}
                  style={{ marginBottom: 20 }}
                />
                Multiple
              </label>
            </div>

            {ITEMS.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <>
                    <Item
                      innerRef={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      style={provided.draggableProps.style}
                    >
                      {item.content}
                    </Item>
                    {snapshot.isDragging && <Clone>{item.content}</Clone>}
                  </>
                )}
              </Draggable>
            ))}
          </Kiosk>
        )}
      </Droppable>
      <Content>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 300px' }} />
          {SESSIONS.map((item) => (
            <Cell key={item._id} style={{ backgroundColor: '#FFC7CE', color: '#9C0006' }}>
              {item.title}
            </Cell>
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 300px' }}>
            {DAYS.map((day) => (
              <div key={day._id} style={{ display: 'flex' }}>
                <div style={{ flex: '0 0 150px', borderTop: '1px solid #aaa' }}>{day.title}</div>
                <div style={{ flex: '0 0 150px' }}>
                  {AREAS.map((area) => (
                    <Cell key={area._id} style={{ backgroundColor: '#C6EFCE' }}>
                      <Notice style={{ color: '#006100' }}>{area.title}</Notice>
                    </Cell>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            {scheduleData.map((rows, rowIdx) => {
              return (
                <div key={`row_${rowIdx}`} style={{ display: 'flex' }}>
                  {rows.map(({ list, isBlocked }, colIdx) => {
                    return (
                      <Droppable
                        key={`${rowIdx}_${colIdx}`}
                        droppableId={`${rowIdx}_${colIdx}`}
                        isDropDisabled={isBlocked}
                      >
                        {(provided, snapshot) => (
                          <Cell
                            innerRef={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}
                            isDropDisabled={isBlocked}
                            onClick={() => {
                              if (isBlocking) {
                                const newScheData = [...scheduleData];
                                const blockedOut = newScheData[rowIdx][colIdx].isBlocked;
                                newScheData[rowIdx][colIdx].isBlocked = !blockedOut;
                                setScheduleData([...newScheData]);
                              }
                            }}
                          >
                            {list.length
                              ? list.map((item, index) => (
                                  <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided, snapshot) => (
                                      <Item
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
                                      </Item>
                                    )}
                                  </Draggable>
                                ))
                              : !provided.placeholder && <Notice>-</Notice>}
                            {provided.placeholder}
                          </Cell>
                        )}
                      </Droppable>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Content>
    </DragDropContext>
  );
}

export default PreviewTemplate;

const ITEMS = [
  {
    _id: 'item_0',
    id: uuid(),
    content: 'Olgica Krsteva'
  },
  {
    _id: 'item_1',
    id: uuid(),
    content: 'Daniel Lewis'
  },
  {
    _id: 'item_2',
    id: uuid(),
    content: 'Alexander Rydin'
  },
  {
    _id: 'item_3',
    id: uuid(),
    content: 'Viktoriia Chubatiuk'
  },
  {
    _id: 'item_4',
    id: uuid(),
    content: 'Illia Voloshenko'
  }
];

const SESSIONS = [
  {
    _id: 1,
    title: 'Before School 1'
  },
  {
    _id: 2,
    title: 'Before School 2'
  },
  {
    _id: 3,
    title: 'Recess 1'
  },
  {
    _id: 4,
    title: 'Recess 2'
  },
  {
    _id: 5,
    title: 'Lunch 1'
  },
  {
    _id: 6,
    title: 'Lunch 2'
  },
  {
    _id: 7,
    title: 'After School'
  }
];

const AREAS = [
  {
    _id: 1,
    title: 'Car Park Gate'
  },
  {
    _id: 2,
    title: 'Courtyart'
  },
  {
    _id: 3,
    title: 'Front Gate'
  },
  {
    _id: 4,
    title: 'Junior Playground'
  },
  {
    _id: 5,
    title: 'Learning Street'
  },
  {
    _id: 61,
    title: 'Basketball Court'
  }
];

const DAYS = [
  {
    _id: 1,
    title: 'Monday'
  },
  {
    _id: 2,
    title: 'Tuesday'
  },
  {
    _id: 3,
    title: 'Wednesday'
  },
  {
    _id: 4,
    title: 'Thursday'
  },
  {
    _id: 5,
    title: 'Friday'
  }
];
