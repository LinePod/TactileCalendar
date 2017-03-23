weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
hourMarks = ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM",
			 "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM",]

var lastDay
var talkingSpeed = 1.5

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
  	speak(textFor(e))
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
