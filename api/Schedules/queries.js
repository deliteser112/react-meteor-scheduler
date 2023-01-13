import Schedules from './Schedules';

export default {
  schedules: async (parent, args, context) => (context.user && context.user._id ? Schedules.find({}).fetch() : []),
  schedule: async (parent, args, context) => Schedules.findOne({ _id: args._id })
};
