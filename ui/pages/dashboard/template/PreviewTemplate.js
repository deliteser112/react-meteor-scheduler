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
  margin: 0 0 0 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  background: #fff;
  max-width: 145px;
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

function PreviewTemplate() {
  const [scheduleData, setScheduleData] = useState([]);
  const [isBlocking, setIsBlocking] = useState(false);

  const handleIsBlocking = () => {
    setIsBlocking(!isBlocking);
  };

  useEffect(() => {
    const tables = generateTable(15, 7);
    console.log('TABLES:', tables);
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

    const tmpData = scheduleData;
    switch (source.droppableId) {
      case destination.droppableId:
        tmpData[dR][dC].list = reorder(tmpData[sR][sC].list, source.index, destination.index);

        setScheduleData([...tmpData]);
        break;
      case 'ITEMS':
        tmpData[dR][dC].list = copy(ITEMS, tmpData[dR][dC].list, source, destination);
        console.log('DATAS:', tmpData);
        setScheduleData([...tmpData]);
        break;
      default:
        const movedResult = move(tmpData[sR][sC].list, tmpData[dR][dC].list, source, destination, tmpData);

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
            <label>
              <input type="checkbox" checked={isBlocking} onChange={handleIsBlocking} style={{ marginBottom: 20 }} />
              Blocked Out
            </label>
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
        {scheduleData.map((rows, rowIdx) => {
          return (
            <div key={`row_${rowIdx}`} style={{ display: 'flex' }}>
              {rows.map(({ list, isBlocked }, colIdx) => {
                return (
                  <Droppable key={`${rowIdx}_${colIdx}`} droppableId={`${rowIdx}_${colIdx}`} isDropDisabled={isBlocked}>
                    {(provided, snapshot) => (
                      <Cell
                        innerRef={provided.innerRef}
                        isDraggingOver={snapshot.isDraggingOver}
                        isDropDisabled={isBlocked}
                        onClick={() => {
                          if (isBlocking) {
                            const newScheData = [...scheduleData];
                            newScheData[rowIdx][colIdx].isBlocked = true;
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
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6Z"
                                      />
                                    </svg>
                                    <div
                                      style={{
                                        maxWidth: 125,
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
                          : !provided.placeholder && <Notice>.</Notice>}
                        {/* {provided.placeholder} */}
                      </Cell>
                    )}
                  </Droppable>
                );
              })}
            </div>
          );
        })}
      </Content>
    </DragDropContext>
  );
}

export default PreviewTemplate;
