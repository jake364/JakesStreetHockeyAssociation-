import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  // Read the schedule data from schedule.json
  const filePath = join(process.cwd(), 'api', 'schedule.json');
  const fileContents = readFileSync(filePath, 'utf8');
  const scheduleData = JSON.parse(fileContents);
  
  res.status(200).json(scheduleData);
}
