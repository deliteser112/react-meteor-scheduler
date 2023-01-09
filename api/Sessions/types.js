export default `
  type Session {
    _id: String
    title: String
    description: String
    startTime: String
    endTime: String
    createdAt: String
    updatedAt: String
  }

  input SessionInput {
    _id: String
    title: String
    startTime: String
    endTime: String
  }
`;
