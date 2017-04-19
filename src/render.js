//TODO deal with full day events
//TODO watch out for events starting/ending at same time
//TODO speech is canceld when new day over circles
//TODO zeitumstellung
//TODO no am/pm unless first enter

var timeScale = d3.scaleLinear()

var dayScale = d3.scaleLinear()

var svg = d3.select("body")
.append("svg")
.attr("width", width)
.attr("height", height);

var defs = svg.append("defs")

defs.append("pattern")
	.attr("id", "eventFill")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 20)
	.attr("height", 10)
	.attr("patternUnits", "userSpaceOnUse")
	.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 20)
		.attr("y2", 0)
		.attr("stroke", "black")
		.attr("stroke-width", 3)

defs.append("pattern")
	.attr("id", "hourMarkFill")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 3)
	.attr("height", 20)
	.attr("patternUnits", "userSpaceOnUse")
	.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", 20)
		.attr("stroke", "black")
		.attr("stroke-width", 2)

function renderEvents(events) {
  //gets called from googleCalendar.js when events are obtained from API

  //add "level" attribute to each event for placing overlapping events
  generateXLevels(events)

  var minHour = getMinHour(events)
  var maxHour = getMaxHour(events)
  var hours = []
	for(let i = minHour; i<maxHour+1; i++) {
		hours.push(i)
	}

	//Y Scale
	timeScale
	.domain([minHour*60,maxHour*60]) //Domain in minutes
	.range([100,height]);

	//X Scale
	dayScale
	.domain([daysSinceEpoch(timeMin),daysSinceEpoch(timeMin)+numberOfDays])
	.range([100,1000]);

	days = [] //Needed for placing of seperator lines

	//-1 so that seperator line is on left side of day
	for(i = -1; i <= numberOfDays - 1; ++i) {
		day = new Date(timeMin)
		day.setDate(day.getDate() + i)   
		days.push(new Date(day))
	}

	var dayBoxes = svg.selectAll(".dayBox")
	.data(days)
	.enter()
	.append("rect")
	.attr("class", "dayBox")
	.attrs(dayBoxAttrs)
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
	.on("mouseout", cancelSpeech)

	var eventBoxes = svg.selectAll(".eventBox")
	//filter out allday events
	.data(events.filter(function(e){return typeof e.start.dateTime !== "undefined"}))
	.enter()
	.append("rect")
	.attr("class","eventBox");

	eventBoxes
	.attrs(eventBoxAttrs)
	.attr("x", function(e) {
		console.log("dayScale")
		console.log(dayScale(daysSinceEpoch(e.start.dateTime)))
		console.log("level")
		console.log(e.level)
		return dayScale(daysSinceEpoch(e.start.dateTime)) + 30*e.level - 13
	})
	.attr("y", function(e) {
		return timeScale(minutesSinceMidnight(e.start.dateTime))
	})
	.attr("height", function(e) {
		return timeScale(minutesSinceMidnight(e.end.dateTime)) - timeScale(minutesSinceMidnight(e.start.dateTime)) + 5
	})
	.on("mouseover", handleMouseOverEvent)
	.on("mouseout", cancelSpeech);

	//Add hour marks
	var dayGroups = svg.selectAll("g")
	.data(days)
	.enter()
	.append("g")
	.each(function(d, i) {
		d3.select(this).selectAll(".hourMarker")
		.data(hours.slice(0,-1)) //all but last hour
		.enter()
		.append("rect")
		.attr("class", "hourMarker")
		.attrs(hourMarkAttrs)
		.attr("x", function() {
			var xDiffPerDay = dayScale(daysSinceEpoch(days[1]))-dayScale(daysSinceEpoch(days[0]))
			return dayScale(daysSinceEpoch(d)) + (xDiffPerDay/2) + 40
		})
		.attr("y", function(h) {
			return timeScale(h*60)-7		
		})
		.on("mouseover", handleMouseOverHourMark)
		.on("mouseout", cancelSpeech)
	});
}
