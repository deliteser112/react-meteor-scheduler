export default `
  input CellInput {
    list: [String]
    isBlocked: Boolean
  }

  type Cell {
    list: [String]
    isBlocked: Boolean
  }

  input ScheduleInput {
    _id: String
    title: String
    startDate: String
    endDate: String
    templateId: String
    state: String
    scheduleTable: [[CellInput]]
  }

  type Schedule {
    _id: String
    title: String
    startDate: String
    endDate: String
    templateId: String
    state: String
    scheduleTable: [[Cell]]
    createdAt: String
    updatedAt: String
  }  
`;
