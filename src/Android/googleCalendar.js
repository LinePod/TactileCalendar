
var newEvents = [];

function getEventsFromAndroid(){

  console.log("requesting events from google api");
  var request = JSON.parse(Android.getGoogleCalendarEvents());
  console.log(request["events"].length)
  parseJSONrequest(request);
}

function parseJSONrequest(request){
  var events = request["events"];
  for (var i = 0; i < events.length; i++) {
        var event = JSON.parse(events[i]);
        console.log("-------------");
        console.log(event.summary);
        console.log("id: ");
        console.log(event.id);
        console.log("start: ");
        console.log(event.start.dateTime);
        console.log("end: ");
        console.log(event.end.dateTime);
        console.log("-------------");
        newEvents.push(event);
      }
      initCalendar(newEvents);
      renderEvents(newEvents);
}

function getNewEventsFromAndroid(){

    var request = JSON.parse(Android.getNewEvents());
    parseJSONrequest(request);
}

getEventsFromAndroid();