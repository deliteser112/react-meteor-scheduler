export default `
  input DayInput {
    _id: Int
    title: String
  }

  type Day {
    _id: Int
    title: String
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
    createdAt: String
    updatedAt: String
  }  
`;
