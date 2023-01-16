import Schedules from './Schedules';

export default {
  addSchedule: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to add a new schedule.');
    const { schedule } = args;
    const date = new Date().toISOString();
    const scheduleId = Schedules.insert({
      title: schedule.title,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      state: schedule.state,
      template: schedule.template,
      scheduleTable: schedule.scheduleTable,
      createdAt: date,
      updatedAt: date
    });
    const sche = Schedules.findOne(scheduleId);
    return sche;
  },
  updateSchedule: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to update a schedule.');
    const { schedule } = args;
    Schedules.update(
      { _id: schedule._id },
      {
        $set: {
          ...schedule,
          updatedAt: new Date().toISOString()
        }
      }
    );
    const sche = Schedules.findOne(schedule._id);
    return sche;
  },
  removeSchedule: async (root, args, context) => {
    if (!context.user) throw new Error('Sorry, you must be logged in to remove a schedule.');
    Schedules.remove(args);
    return args;
  }
};
