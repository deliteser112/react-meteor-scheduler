export default `
  input DayInput {
    _id: Int
    title: String
  }

  type Day {
    _id: Int
    title: String
  }

  input TemplateCellInput {
    list: [String]
    isBlocked: Boolean
  }

  type TemplateCell {
    list: [String]
    isBlocked: Boolean
  }

  input TemplateInput {
    _id: String
    title: String
    location: LocationInput
    sessions: [SessionInput]
    days: [DayInput]
    areas: [AreaInput]
    staff: [String]
    allocationType: String
    sessionDisplayType: String
    areaDisplayType: String
    staffDisplayType: String
    templateTable: [[TemplateCellInput]]
  }

  type Template {
    _id: String
    title: String
    location: Location
    sessions: [Session]
    days: [Day]
    areas: [Area]
    staff: [String]
    allocationType: String
    sessionDisplayType: String
    areaDisplayType: String
    staffDisplayType: String
    templateTable: [[TemplateCell]]
    createdAt: String
    updatedAt: String
  }  
`;
