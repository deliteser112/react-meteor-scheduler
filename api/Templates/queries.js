import Templates from './Templates';

export default {
  templates: async (parent, args, context) => (context.user && context.user._id ? Templates.find({}).fetch() : []),
  template: async (parent, args, context) => Templates.findOne({ _id: args._id })
};
