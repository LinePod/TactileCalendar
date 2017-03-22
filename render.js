//TODO deal with full day events
//TODO make it possible to jump back a level
//#
//# #
//  #
//# # x
//#   x
//TODO remove XLevelRange

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
  var start = new Date(e.start.dateTime)
  var end = new Date(e.end.dateTime)
  return end.getTime() - start.getTime()
}

function isOverlapping(a, b) {
  return (a.start < b.start && b.start < a.end)||(b.start < a.start && a.start < b.end)
}

var XLevelRanges = []

function getLevel(range) {
    var overlapping = []
    for(let i = 0; i < XLevelRanges.length; ++i) {
      if(isOverlapping(range, XLevelRanges[i])) {
        overlapping.push(XLevelRanges[i])
      }
    } 
    console.log("overlapping:")
    console.log((overlapping.length == 0) ? 0 : Math.max.apply(null, overlapping.map(o => o.level)) + 1)

    return ((overlapping.length == 0) ? 0 : Math.max.apply(null, overlapping.map(o => o.level)) + 1)
}

function XLevelRange(event) {
  this.start = (new Date(event.start.dateTime)).getTime()
  console.log("Event starts: ")
  console.log(this.start)
  console.log((new Date(event.start.dateTime)).getTime())
  this.end = (new Date(event.end.dateTime)).getTime()
  this.level = 0
  XLevelRanges.push(this)
}

function generateXLevelRanges(events) {

  events.sort(function(a, b) {
    return (lengthOfEvent(a) - lengthOfEvent(b))
  })

  for(let i = 0; i < events.length; i++) {
    var a = new XLevelRange(events[i])
    a.level = getLevel(a)
  }
  console.log(XLevelRanges)
}

function renderEvents(dataset) {
  //gets called from googleCalendar.js when events are obtained from API
  
  generateXLevelRanges(dataset)
  
  var eventBoxes = svg.selectAll(".eventBox")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class","eventBox")

  eventBoxes
    .attr("x", function(e) {
      var range = new XLevelRange(e)
      return dayScale(daysSinceEpoch(e.start.dateTime)) + 20*getLevel(range)
    })
    .attr("y", function(e) {
      return timeScale(minutesSinceMidnight(e.start.dateTime))
    })
    .attr("height", function(e) {
      return timeScale(minutesSinceMidnight(e.end.dateTime)) - timeScale(minutesSinceMidnight(e.start.dateTime))
    });

  days = [] //Needed for placing of seperator lines

  for(i = 0; i <= numberOfDays; ++i) {
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
}
