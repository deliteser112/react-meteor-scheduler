export default `
  type Location {
    _id: String
    title: String
    address: String
    entity: Entity
    createdAt: String
    updatedAt: String
  }

  input EntityInput {
    _id: String
    title: String
  }
`;
