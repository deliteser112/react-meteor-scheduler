import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';

import UserTypes from '../../api/Users/types';
import UserQueries from '../../api/Users/queries';
import UserMutations from '../../api/Users/mutations';

import UserSettingsTypes from '../../api/UserSettings/types';
import UserSettingsQueries from '../../api/UserSettings/queries';
import UserSettingsMutations from '../../api/UserSettings/mutations';

import DocumentTypes from '../../api/Documents/types';
import DocumentQueries from '../../api/Documents/queries';
import DocumentMutations from '../../api/Documents/mutations';

import CommentTypes from '../../api/Comments/types';
import CommentQueries from '../../api/Comments/queries';
import CommentMutations from '../../api/Comments/mutations';

// session
import SessionTypes from '../../api/Sessions/types';
import SessionQueries from '../../api/Sessions/queries';
import SessionMutations from '../../api/Sessions/mutations';

// entity
import EntityTypes from '../../api/Entities/types';
import EntityQueries from '../../api/Entities/queries';
import EntityMutations from '../../api/Entities/mutations';

// location
import LocationTypes from '../../api/Locations/types';
import LocationQueries from '../../api/Locations/queries';
import LocationMutations from '../../api/Locations/mutations';

// location
import AreaTypes from '../../api/Areas/types';
import AreaQueries from '../../api/Areas/queries';
import AreaMutations from '../../api/Areas/mutations';

import OAuthQueries from '../../api/OAuth/queries';

import '../../api/Documents/server/indexes';
import '../../api/webhooks';

import '../../api/App/server/publications';

import '../../api/Users/methods';

const schema = {
  typeDefs: gql`
    ${DocumentTypes}
    ${CommentTypes}

    # scheduler inputs
    ${SessionTypes}
    ${EntityTypes}
    ${LocationTypes}
    ${AreaTypes}

    # user management
    ${UserTypes}
    ${UserSettingsTypes}

    type Query {
      documents: [Document]
      document(_id: String): Document

      # scheduler queries
      sessions: [Session]
      session(_id: String): Session

      entities: [Entity]
      entity(_id: String): Entity

      locations: [Location]
      location(_id: String): Location

      areas: [Area]
      area(_id: String): Area

      # user management
      user(_id: String): User
      users(currentPage: Int, perPage: Int, search: String): Users
      userSettings: [UserSetting]
      exportUserData: UserDataExport
      oAuthServices(services: [String]): [String]
    }

    type Mutation {
      addDocument(title: String, body: String, cover: CoverInput, isPublic: Boolean): Document
      updateDocument(_id: String!, title: String, body: String, cover: CoverInput, isPublic: Boolean): Document
      removeDocument(_id: String!): Document
      addComment(documentId: String!, comment: String!): Comment
      removeComment(commentId: String!): Comment

      # ------------------------------- ### ---------------------------------- #

      # scheduler mutations
      addSession(title: String, description: String, startTime: String, endTime: String): Session
      updateSession(_id: String!, title: String, description: String, startTime: String, endTime: String): Session
      removeSession(_id: String!): Session

      addEntity(title: String): Entity
      updateEntity(_id: String!, title: String): Entity
      removeEntity(_id: String!): Entity

      addLocation(title: String, address: String, entity: EntityInput): Location
      updateLocation(_id: String!, title: String, address: String, entity: EntityInput): Location
      removeLocation(_id: String!): Location

      addArea(title: String, alternateName: String): Area
      updateArea(_id: String!, title: String, alternateName: String): Area
      removeArea(_id: String!): Area

      # ------------------------------- ### ---------------------------------- #
      # user management
      updateUser(user: UserInput): User
      removeUser(_id: String): User
      addUserSetting(setting: UserSettingInput): UserSetting
      updateUserSetting(setting: UserSettingInput): UserSetting
      removeUserSetting(_id: String!): UserSetting
      sendVerificationEmail: User
      sendWelcomeEmail: User
    }

    type Subscription {
      commentAdded(documentId: String!): Comment
    }
  `,
  resolvers: {
    Query: {
      ...DocumentQueries,

      // scheduler inputs
      ...SessionQueries,
      ...EntityQueries,
      ...LocationQueries,
      ...AreaQueries,

      // user management
      ...UserQueries,
      ...UserSettingsQueries,
      ...OAuthQueries
    },
    Mutation: {
      ...DocumentMutations,
      ...CommentMutations,

      // scheduler actions
      ...SessionMutations,
      ...EntityMutations,
      ...LocationMutations,
      ...AreaMutations,

      // user management
      ...UserMutations,
      ...UserSettingsMutations
    },
    Document: {
      comments: CommentQueries.comments
    },
    Comment: {
      user: UserQueries.user
    }
  }
};

export default makeExecutableSchema(schema);
