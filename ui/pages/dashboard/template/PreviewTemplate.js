import React, { useState, useEffect } from 'react';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import console = require('console');

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

    sourceData[sR][sC] = sourceClone;
    sourceData[dR][dC] = destClone;
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
  border: 1px ${(props) => (props.isDragging ? 'dashed #4099ff' : 'solid #ddd')};
`;

const Clone = styled(Item)`
  + div {
    display: none !important;
  }
`;

const Handle = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  user-select: none;
  margin: -0.5rem 0.5rem -0.5rem -0.5rem;
  padding: 0.5rem;
  line-height: 1.5;
  border-radius: 3px 0 0 3px;
  background: #fff;
  border-right: 1px solid #ddd;
  color: #000;
`;

const List = styled.div`
  border: 1px ${(props) => (props.isDraggingOver ? 'dashed #000' : 'solid #ddd')};
  background: #fff;
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
`;

const Cell = styled(List)`
  margin: 0px;
  background: #eee;
  max-width: 250px;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 0.5rem;
  margin: 0;
  border: 1px solid transparent;
  line-height: 1.5;
  color: #aaa;
`;

const ITEMS = [
  {
    _id: 'item_0',
    id: uuid(),
    content: 'Headline'
  },
  {
    _id: 'item_1',
    id: uuid(),
    content: 'Copy'
  },
  {
    _id: 'item_2',
    id: uuid(),
    content: 'Image'
  },
  {
    _id: 'item_3',
    id: uuid(),
    content: 'Slideshow'
  },
  {
    _id: 'item_4',
    id: uuid(),
    content: 'Quote'
  }
];

function PreviewTemplate() {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const tables = generateTable(15, 7);
    console.log('TABLES:', tables[0][0]);
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
        tmpData[dR][dC] = reorder(tmpData[sR][sC], source.index, destination.index);

        setScheduleData([...tmpData]);
        break;
      case 'ITEMS':
        console.log('BEFORE:', tmpData[dR][dC], ITEMS);
        tmpData[dR][dC] = copy(ITEMS, tmpData[dR][dC], source, destination);
        console.log('AFTER:', tmpData[dR][dC]);
        setScheduleData([...tmpData]);
        break;
      default:
        const movedResult = move(tmpData[sR][sC], tmpData[dR][dC], source, destination, tmpData);

        console.log('MoveRESULT:', movedResult);
        setScheduleData([...movedResult]);
        break;
    }
  };

  const generateTable = (rows, cols) =>
    Array.from({ length: rows }).map(() => Array.from({ length: cols }).map(() => []));

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="ITEMS" isDropDisabled={true}>
        {(provided, snapshot) => (
          <Kiosk innerRef={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
            {ITEMS.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <React.Fragment>
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
                  </React.Fragment>
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
              {rows.map((list, colIdx) => {
                return (
                  <Droppable key={`${rowIdx}_${colIdx}`} droppableId={`${rowIdx}_${colIdx}`}>
                    {(provided, snapshot) => (
                      <Cell innerRef={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
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
                                        newScheData[rowIdx][colIdx].splice(index, 1);
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
                                    {item.content}
                                  </Item>
                                )}
                              </Draggable>
                            ))
                          : !provided.placeholder && <Notice>.</Notice>}
                        {provided.placeholder}
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
