import Areas from './Areas';

export default {
  addArea: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new area.');
    const date = new Date().toISOString();
    const areaId = Areas.insert({
      title: args.title,
      alternateName: args.alternateName,
      createdAt: date,
      updatedAt: date
    });
    const ara = Areas.findOne(areaId);
    return ara;
  },
  updateArea: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a area.');
    Areas.update(
      { _id: args._id },
      {
        $set: {
          ...args,
          updatedAt: new Date().toISOString()
        }
      }
    );
    const ara = Areas.findOne(args._id);
    return ara;
  },
  removeArea: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a area.');
    Areas.remove(args);
    return args;
  }
};
