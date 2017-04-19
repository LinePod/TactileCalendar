numberOfDays = 6

width = 1200;
height = 600;

timeMin = startOfCurrentWeek()
timeMax = new Date(timeMin)
timeMax.setDate(timeMax.getDate() + numberOfDays)
