//TODO deal with full day events
//TODO watch out for events starting/ending at same time

var timeScale = d3.scaleLinear()
  .domain([540,1200])
  .range([100,height]);

var dayScale = d3.scaleLinear()
  .domain([daysSinceEpoch(timeMin),daysSinceEpoch(timeMin)+numberOfDays])
  .range([100,1000]);

var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg.append("defs").append("pattern")
  .attr("id","dotFill")
  .attr("x",0)
  .attr("y",0)
  .attr("width",1)
  .attr("height",0.1)
  .append("circle")
    .attr("cx",25)
    .attr("cy",25)
    .attr("r",10)
    .attr("stroke","black")
    .attr("fill","white")
    .attr("stroke-width","3");


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

function renderEvents(dataset) {
  //gets called from googleCalendar.js when events are obtained from API
  generateXLevels(dataset)


  days = [] //Needed for placing of seperator lines

  //-1 so that seperator line is on left side of day
  for(i = -1; i <= numberOfDays - 1; ++i) {
    day = new Date(timeMin)
    day.setDate(day.getDate() + i)   
    days.push(new Date(day))
  }

  var seperators = svg.selectAll(".seperator")
  .data(days)
  .enter()
  .append("rect")
  .attr("class", "seperator")
  .attr("x", function(e) {
    var xDiffPerDay = dayScale(daysSinceEpoch(days[1]))-dayScale(daysSinceEpoch(days[0]))
    return dayScale(daysSinceEpoch(e)) + (xDiffPerDay/2) + 25
  })
  .attr("y", function(e) {
    return 100
  })
  .attr("height", function(e) {
    return height-100
  });

  var dayBoxes = svg.selectAll(".dayBox")
		.data(days)
		.enter()
		.append("rect")
		.attr("class", "dayBox")
  	.attr("x", function(e) {
    	var xDiffPerDay = dayScale(daysSinceEpoch(days[1]))-dayScale(daysSinceEpoch(days[0]))
    	return dayScale(daysSinceEpoch(e)) + (xDiffPerDay/2) + 10 
  	})
		.attr("width", function(e) {
    	return dayScale(daysSinceEpoch(days[1]))-dayScale(daysSinceEpoch(days[0]))
		})
		.attr("y", 0)
		.attr("height", height)
		.on("mouseover", handleMouseOverDay)
		.on("mouseout", handleMouseOutDay);

  var eventBoxes = svg.selectAll(".eventBox")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class","eventBox")

  eventBoxes
    .attr("x", function(e) {
      return dayScale(daysSinceEpoch(e.start.dateTime)) + 30*e.level
    })
    .attr("y", function(e) {
      return timeScale(minutesSinceMidnight(e.start.dateTime))
    })
    .attr("height", function(e) {
      return timeScale(minutesSinceMidnight(e.end.dateTime)) - timeScale(minutesSinceMidnight(e.start.dateTime))
    })
    .on("mouseover", handleMouseOverEvent)
    .on("mouseout", handleMouseOutEvent);
}
