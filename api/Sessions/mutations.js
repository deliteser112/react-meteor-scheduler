import sanitizeHtml from 'sanitize-html';
import Sessions from './Sessions';

export default {
  addSession: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new session.');

    const date = new Date().toISOString();
    const sessionId = Sessions.insert({
      title: args.title,
      description: args.description ? sanitizeHtml(args.description) : 'This is my document. There are many like it, but this one is mine.',
      startTime: args.startTime,
      endTime: args.endTime,
      createdAt: date,
      updatedAt: date
    });
    const ses = Sessions.findOne(sessionId);
    return ses;
  },
  updateSession: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a session.');
    Sessions.update(
      { _id: args._id },
      {
        $set: {
          ...args,
          description: sanitizeHtml(args.description),
          updatedAt: new Date().toISOString()
        }
      }
    );
    const ses = Sessions.findOne(args._id);
    return ses;
  },
  removeSession: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a session.');
    Sessions.remove(args);
    return args;
  }
};
