import Areas from './Areas';

export default {
  areas: async (parent, args, context) => (context.user && context.user._id ? Areas.find({}).fetch() : []),
  area: async (parent, args, context) => Areas.findOne({ _id: args._id })
};
