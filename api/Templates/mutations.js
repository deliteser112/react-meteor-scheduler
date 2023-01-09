import Templates from './Templates';

export default {
  addTemplate: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new template.');
    const { template } = args;
    const date = new Date().toISOString();
    const templateId = Templates.insert({
      title: template.title,
      location: template.location,
      sessions: template.sessions,
      days: template.days,
      areas: template.areas,
      staff: template.staff,
      allocationType: template.allocationType,
      createdAt: date,
      updatedAt: date
    });
    const temp = Templates.findOne(templateId);
    return temp;
  },
  updateTemplate: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a template.');
    const { template } = args;
    Templates.update(
      { _id: template._id },
      {
        $set: {
          ...template,
          updatedAt: new Date().toISOString()
        }
      }
    );
    const temp = Templates.findOne(template._id);
    return temp;
  },
  removeTemplate: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a template.');
    Templates.remove(args);
    return args;
  }
};
