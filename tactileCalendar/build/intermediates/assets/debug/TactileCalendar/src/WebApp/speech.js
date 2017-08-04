weekDays = ["Sunday,","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
hourMarks = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
			 "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM",]

var lastDay
var talkingSpeed = 1.5

var commands = {
	'create event *summary from here': startEventCreation,
	'to here': endEventCreation
};
annyang.addCommands(commands);

console.log("staring speach recog")
annyang.start();

function timeInText(date) {
  var text = ""
  var hours = date.getHours()
  var minutes = date.getMinutes()
  if(hours == 0) {
    text += "12 "
  }
  else {
    text += (hours%12).toString() + " "
  }

  if(minutes != 0) {
	  text += minutes.toString() + " "
  }

  if(hours < 12) {
    text += "AM" 
  }
  else {
    text += "PM"
  }
  return text
}

function textFor(event) {
	var text = event.summary + 
			   " from " + 
			   timeInText(new Date(event.start.dateTime)) +
			   " to " + 
			   timeInText(new Date(event.end.dateTime)) 

	return text
}

function speak(text) {
	var msg = new SpeechSynthesisUtterance(text);
	msg.rate = talkingSpeed
	window.speechSynthesis.speak(msg);
}

function cancelSpeech() {
	window.speechSynthesis.cancel();
}

function handleMouseOverEvent(e, i) {
  	
    if (e!= lastEvent ){
        speak(textFor(e));
        console.log("mouse over event " + e);
        lastEvent = e;
        

    }
    

}

function handleMouseOverDay(e, i) {
	var day = weekDays[e.getDay()]
	if(day != lastDay) {
		lastDay = day
		speak(weekDays[e.getDay()])
	}
}

function handleMouseOverHourMark(e, i) {
  	speak(hourMarks[e])
}


function handleSpeechInput(summary, startTime, endTime) {
	console.log("summary")
	console.log(summary)
	console.log("startTime")
	console.log(startTime)
	console.log("endTime")
	console.log(endTime)
}

var curEvent = {}

function getCursorTime() {
	console.log("cursorX:")
	console.log(cursorX)
	console.log("cursorY:")
	console.log(cursorY)
	cursorY -= 20
	var cursorDay = new Date(dayScale.invert(cursorX)*8.64e7)
	cursorDay.setHours(0,0,0,0)
	var cursorDate = new Date(cursorDay.getTime()+timeScale.invert(cursorY)*60000)
	console.log(cursorDate.toISOString())

	return cursorDate
}

function roundMinutes(date) {
	date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
	date.setMinutes(0);
	return date;
}

function startEventCreation(summary) {
	console.log("Create event: ")
	console.log(summary)
	var startTime = getCursorTime()
	curEvent['summary'] = summary
	curEvent['start'] = {}
	curEvent['start']['dateTime'] = roundMinutes(startTime).toISOString()
	curEvent['start']['timeZone'] = 'Europe/Berlin'
}

function endEventCreation() {
	console.log("end event: ")
	var endTime = getCursorTime()
	curEvent['end'] = {}
	curEvent['end']['dateTime'] = roundMinutes(endTime).toISOString()
	curEvent['end']['timeZone'] = 'Europe/Berlin'
	console.log(curEvent)
	if(curEvent.hasOwnProperty("start")) {
	  	createEvent(curEvent)
	}
	else {
		console.log("No starttime specified")	
	}
	curEvent = {}
}
