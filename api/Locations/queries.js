import Locations from './Locations';

export default {
  locations: async (parent, args, context) => (context.user && context.user._id ? Locations.find({}).fetch() : []),
  location: async (parent, args, context) => Locations.findOne({ _id: args._id })
};
