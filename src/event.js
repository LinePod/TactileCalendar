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
