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

document.onmousemove = function(e) {
  cursorX = e.pageX;
  cursorY = e.pageY;
}
