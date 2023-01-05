import Entities from './Entities';

export default {
  entities: async (parent, args, context) => (context.user && context.user._id ? Entities.find({}).fetch() : []),
  entity: async (parent, args, context) => Entities.findOne({ _id: args._id })
};
