weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

var lastDay

function handleMouseOverEvent(e, i) {
	var msg = new SpeechSynthesisUtterance(e.summary);
	window.speechSynthesis.speak(msg);
}

function handleMouseOutEvent(e, i) {
	window.speechSynthesis.cancel();
}

function handleMouseOverDay(e, i) {
	
	var day = weekDays[e.getDay()]
	if(day != lastDay) {
		lastDay = day
		var msg = new SpeechSynthesisUtterance(weekDays[e.getDay()]);
		window.speechSynthesis.speak(msg);
	}
}

function handleMouseOutDay(e, i) {
	window.speechSynthesis.cancel();
}
