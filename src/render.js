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
	.attr("width", 3)
	.attr("height", 20)
	.attr("patternUnits", "userSpaceOnUse")
	.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", 0)
		.attr("y2", 20)
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


	//Add hour marks
	var dayGroups = svg.selectAll("g")
	.data(days)
	.enter()
	.append("g")
	
	dayGroups
		.append("line")
		.attr("x1",function(d) {
			return (dayScale(daysSinceEpoch(d)) + ((dayScale(daysSinceEpoch(days[1]))
														-dayScale(daysSinceEpoch(days[0])))/2) + 41) 
		})
		.attr("x2",function(d) {
			return (dayScale(daysSinceEpoch(d)) + ((dayScale(daysSinceEpoch(days[1]))
														-dayScale(daysSinceEpoch(days[0])))/2) + 41) 
		})
		.attr("y1",timeScale(minHour*60)-6)
		.attr("y2",timeScale(maxHour*60)-6)
		.attr("stroke", "black")

	dayGroups
	.each(function(d, i) {
		d3.select(this).selectAll(".hourMarker")
		.data(hours.slice(0,-1)) //all but last hour
		.enter()
		.append("path")
		.attr("d", d3.symbol().type(bump))
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("transform", function(h) { 
			console.log("d:")
			console.log(d)
			console.log("h:")
			console.log(h)
			var a = "translate(" + (dayScale(daysSinceEpoch(d)) + ((dayScale(daysSinceEpoch(days[1]))
														-dayScale(daysSinceEpoch(days[0])))/2) + 40) + "," + 
				(timeScale(h*60)-7) + ")"; 
				console.log(a)
		return a})
		.on("mouseover", handleMouseOverHourMark)
		.on("mouseout", cancelSpeech)
	});

	var eventBoxes = svg.selectAll(".eventBox")
	//filter out allday events
	.data(events.filter(function(e){return typeof e.start.dateTime !== "undefined"}))
	.enter()
	.append("rect")
	.attr("class","eventBox");

	eventBoxes
	.attrs(eventBoxAttrs)
	.attr("x", function(e) {
		return dayScale(daysSinceEpoch(e.start.dateTime)) + 30*e.level - 55
	})
	.attr("y", function(e) {
		return timeScale(minutesSinceMidnight(e.start.dateTime)-12)
	})
	.attr("height", function(e) {
		return timeScale(minutesSinceMidnight(e.end.dateTime)) - timeScale(minutesSinceMidnight(e.start.dateTime)) + 5
	})
	.on("mouseover", handleMouseOverEvent)
	.on("mouseout", cancelSpeech);

}
