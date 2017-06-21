var lastEvent;
var lastHourMark;


hourMarks = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
			 "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM",]

var lastDay


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
    Android.speak(text);
	/*var msg = new SpeechSynthesisUtterance(text);
	msg.rate = talkingSpeed;
	window.speechSynthesis.speak(msg);
	console.log("Speaking...");*/
}

function cancelSpeech() {
    lastEvent = null;
}

function handleMouseOverEvent(e, i) {

    if (e!= lastEvent ){
        speak(textFor(e));
        lastEvent = e;


    }

}

function handleMouseOverDay(e, i) {
	var day = weekDays[e.getDay()]
	if(day != lastDay) {

		lastDay = day
		speak(weekDays[e.getDay()])
		console.log("mouse over day " + e);
	}
}

function handleMouseOverHourMark(e, i) {
  	if (e != lastHourMark){

  	    speak(hourMarks[e]);
		console.log("mouse over mark " + e);
  	    lastHourMark = e;
  	}
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
	console.log(cursorX1)
	console.log("cursorY:")
	console.log(cursorY1)
	cursorY -= 20
	var transformFactorX = width/paperWidth;
	var transformFactorY = height/paperHeight;

	var scaledX1 = cursorX1 * transformFactorX;
	var scaledY1 = cursorY1 * transformFactorY;
    console.log(scaledX1);
    console.log(scaledY1);

	var cursorDay = new Date(dayScale.invert(scaledX1)*8.64e7)
	cursorDay.setHours(0,0,0,0)
	var cursorDate = new Date(cursorDay.getTime()+timeScale.invert(scaledY1)*60000)
	var minutes = cursorDate.getMinutes();
	if (minutes < 15) {
        minutes = 0;
    } else if (minutes < 45){
        minutes = 30;
    } else {
        minutes = 0;
    }
    cursorDate.setMinutes(minutes);
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

function handleSpeech(speechInput){
    speechInput = speechInput.toLowerCase();
    console.log("received " + speechInput);


    if (speechInput.includes("new") && speechInput.includes("event")){
        fsm.handle("newEvent");
    } else if (speechInput.includes("cancel")){
        fsm.handle("cancel");
    } else if (speechInput.includes("back")){
        fsm.handle("back");
    } else if (speechInput.includes("select")){
        var time = getCursorTime();
        fsm.handle("selectingTime", time);
    } else if (speechInput.includes("create")){
        fsm.handle("createEvent");
    } else if (speechInput.includes("options") || speechInput.includes("help") ){
        fsm.handle("options");
    } else if (speechInput.includes("print")){
        fsm.handle("print");
    }  else if (speechInput.includes("start") || speechInput.includes("simulate")){
        fsm.handle("simulatePrint");
    } else if (speechInput.includes("test")){
          endDate = new Date();
          endDate.setHours(endDate.getHours()+2);

          Android.createEvent("test",new Date().toISOString(), endDate.toISOString());
      }
     else {
        fsm.handle("otherInput", speechInput);
    }

}
