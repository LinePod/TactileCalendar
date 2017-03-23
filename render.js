//TODO deal with full day events
//TODO watch out for events starting/ending at same time

var timeScale = d3.scaleLinear()

var dayScale = d3.scaleLinear()

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


	var eventBoxes = svg.selectAll(".eventBox")
	.data(events)
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
		.append("circle")
		.attr("class", "hourMarker")
		.attr("cx", function() {
			var xDiffPerDay = dayScale(daysSinceEpoch(days[1]))-dayScale(daysSinceEpoch(days[0]))
			return dayScale(daysSinceEpoch(d)) + (xDiffPerDay/2) + 40
		})
		.attr("cy", function(h) {
			return timeScale(h*60)		
		})
		.on("mouseover", handleMouseOverHourMark)
		.on("mouseout", cancelSpeech)
	});

}
