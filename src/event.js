
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

weekDays = ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]


function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = weekDays[(date.getDay()+6)%7] + " " + hours + ':' + minutes + ' ' + ampm;
  return strTime;
}



function lengthOfEvent(e) {
  return endOf(e) - startOf(e)
}

function isOverlapping(a, b) {
  return (startOf(a) < startOf(b) && startOf(b) < endOf(a) || (startOf(b) < startOf(a) && startOf(a) < endOf(b)))
}

function startOf(event) {
  return (new Date(event.start.dateTime)).getTime()
}

function endOf(event) {
  return (new Date(event.end.dateTime)).getTime()
}

function fitsOnLevel(event, level, events) {
  for(let i = 0; i < events.length; ++i) {
    if(isOverlapping(event, events[i]) && events[i].level == level) {
      return false
    }
  } 
  return true
}

function generateXLevels(events) {

  events.sort(function(a, b) {
    return (lengthOfEvent(b) - lengthOfEvent(a))
  })

  for(let i = 0; i<events.length; i++) {
    var curLevel = 0
    while(true) {
      if(fitsOnLevel(events[i], curLevel, events)) {
	events[i].level = curLevel
	break
      }
      curLevel++
    }
  }
}

function getMinHour(events) {
  var minHour = 23

  for(let i = 0; i<events.length; i++) {
    var startingHour = (new Date(events[i].start.dateTime)).getHours()
    if(startingHour < minHour) {
      minHour = startingHour
    }
  }
  console.log("minHour")
  console.log(minHour)
  return minHour
}

function getMaxHour(events) {
  var maxHour = 0

  for(let i = 0; i<events.length; i++) {
    var endingHour = (new Date(events[i].end.dateTime)).getHours() + 1
    if(endingHour > maxHour) {
      maxHour = endingHour
    }
  }
  console.log("maxHour")
  console.log(maxHour)

  return maxHour
}
