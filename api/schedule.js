const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Read the schedule data from schedule.json
  const filePath = path.join(process.cwd(), 'api', 'schedule.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const scheduleData = JSON.parse(fileContents);
  
  res.status(200).json(scheduleData);
};
