import Entities from './Entities';

export default {
  addEntity: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new entity.');
    const date = new Date().toISOString();
    const entityId = Entities.insert({
      title: args.title,
      createdAt: date,
      updatedAt: date
    });
    const ent = Entities.findOne(entityId);
    return ent;
  },
  updateEntity: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a entity.');
    Entities.update(
      { _id: args._id },
      {
        $set: {
          ...args,
          updatedAt: new Date().toISOString()
        }
      }
    );
    const ses = Entities.findOne(args._id);
    return ses;
  },
  removeEntity: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a entity.');
    Entities.remove(args);
    return args;
  }
};
