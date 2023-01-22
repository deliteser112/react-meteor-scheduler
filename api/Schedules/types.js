export default `
  input CellInput {
    list: [String]
    isBlocked: Boolean
  }

  type Cell {
    list: [String]
    isBlocked: Boolean
  }

  input ScheduleTemplateInput {
    _id: String
    title: String
  }

  type ScheduleTemplate {
    _id: String
    title: String
  }
  
  input ScheduleInput {
    _id: String
    title: String
    startDate: String
    endDate: String
    template: ScheduleTemplateInput
    state: String
    locationId: String
    scheduleTable: [[CellInput]]
  }

  type Schedule {
    _id: String
    title: String
    startDate: String
    endDate: String
    template: ScheduleTemplate
    state: String
    locationId: String
    scheduleTable: [[Cell]]
    createdAt: String
    updatedAt: String
  }  
`;
