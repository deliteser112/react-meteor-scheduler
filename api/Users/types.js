export default `
  type Name {
    first: String
    last: String
  }

  input NameInput {
    first: String
    last: String
  }

  type Role {
    _id: String
    name: String
    inRole: Boolean
  }

  input ProfileInput {
    name: NameInput
  }

  input UserInput {
    _id: String,
    avatarUrl: String
    email: String
    password: String
    profile: ProfileInput
    roles: [String]
    entities: [EntityInput]
    locations: [LocationInput]
    class: String
    settings: [UserSettingInput] # From /api/UserSettings/types.js
  }

  type User {
    _id: String
    avatarUrl: String
    name: Name
    username: String
    emailAddress: String
    emailVerified: Boolean
    oAuthProvider: String
    roles: [Role]
    entities: [Entity]
    locations: [Location]
    class: String
    settings: [UserSetting] # From /api/UserSettings/types.js
  }

  type Users {
    total: Int
    users: [User]
  }

  type UserDataExport {
    zip: String
  }
`;
