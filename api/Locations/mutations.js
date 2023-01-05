import Locations from './Locations';

export default {
  addLocation: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new location.');
    const date = new Date().toISOString();
    const locationId = Locations.insert({
      title: args.title,
      address: args.address,
      entity: args.entity,
      createdAt: date,
      updatedAt: date
    });
    const ent = Locations.findOne(locationId);
    return ent;
  },
  updateLocation: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a location.');
    Locations.update(
      { _id: args._id },
      {
        $set: {
          ...args,
          updatedAt: new Date().toISOString()
        }
      }
    );
    const loc = Locations.findOne(args._id);
    return loc;
  },
  removeLocation: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a location.');
    Locations.remove(args);
    return args;
  }
};
