import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

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

  return (
    <>
      <div className="d-flex">
        <div className="flex-300" style={{ backgroundColor: '#ffc7ce' }} />
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
                <div className="flex-150">
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
                    <div
                      key={colIdx}
                      className="cell"
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
                      <div className="notice">-</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function getStringTimeRange(startTime, endTime) {
  return `${fTime(startTime)} - ${fTime(endTime)}`;
}
