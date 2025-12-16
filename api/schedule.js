import scheduleData from './schedule.json';

export default function handler(req, res) {
  // Return the schedule data from schedule.json
  res.status(200).json(scheduleData);
}
