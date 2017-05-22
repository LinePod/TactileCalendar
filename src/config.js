numberOfDays = 6

width = 1200;
height = 600;

paperWidth = 200;
paperHeight = 270;
paperA4Yoffset = 125;

svgVersionNr = 0



function startOfCurrentWeek() {
  var d = new Date();
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1);

  //return midnight of day
  var monday = new Date(d.setDate(diff));
  return new Date(monday.setHours(0,0,0,0))

}

timeMin = startOfCurrentWeek()
timeMax = new Date(timeMin)
timeMax.setDate(timeMax.getDate() + numberOfDays)
linepodNS = "http://hpi.de/baudisch/linepod";

var cursorX;
var cursorY;