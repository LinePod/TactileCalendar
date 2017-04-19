function daysSinceEpoch(timeString) {
  var date = new Date(timeString)
  return Math.floor(date/8.64e7)
}

function minutesSinceMidnight(timeString) {
  date = new Date(timeString);
  midnight = new Date(timeString);
  midnight.setHours(0,0,0,0)

  diff = date.getTime() - midnight.getTime();
  return diff/60000
}

function startOfCurrentWeek() {
  var d = new Date();
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1);

  //return midnight of day
  var monday = new Date(d.setDate(diff));
  return new Date(monday.setHours(0,0,0,0))

}

var cursorX;
var cursorY;

document.onmousemove = function(e) {
  cursorX = e.pageX;
  cursorY = e.pageY;
}
