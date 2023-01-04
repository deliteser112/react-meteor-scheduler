import Sessions from './Sessions';

export default {
  sessions: async (parent, args, context) => (context.user && context.user._id ? Sessions.find({}).fetch() : []),
  session: async (parent, args, context) => Sessions.findOne({ _id: args._id })
};
