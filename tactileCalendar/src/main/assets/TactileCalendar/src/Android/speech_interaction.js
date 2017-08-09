//event creation

var eventStartTime;
var eventEndTime;
var eventStartTimeFormatted;
var eventEndTimeFormatted;

var eventNm;
//initial state should actually be appStarted
var fsm = new machina.Fsm({
 initialState: 'appStarted',
  states: {
   appStarted: {

     print: function() {
       Android.startSVGTransmitter(true);
       this.transition("printing");
     },
     simulatePrint: function(){
       Android.startSVGTransmitter(false);
       this.transition("printing");
     },
     options: function(){
       this.emit('speech', "Your available speech commands are 'start' and 'print'. Say 'start' if you already have a printed calendar of the current week and 'print' to print a new calendar.");

     },
     otherInput: function(input) {
        notUnderstood();
     }
   },

   printing: {
    options: function(){
      this.emit('speech', "Our Linepod is printing your calendar right now. This might take a little");

    },
    printed: function(){
      this.transition("idle");
      this.emit("speech", "You can now hover over the paper to feel your calendar. If you want to create a new event say 'new event'.")
    },
    otherInput: function(input) {
         notUnderstood();
    }

   },


   idle: {
     newEvent: function() {
       this.emit('speech', 'Creating new event. You can always say back to go one step back and cancel the event creation by saying cancel. Let us first get a good event name. How should your event be named?');
        this.transition('settingNewEventName');
      },
      options: function(){
        this.emit("speech", "Your only available speech command is to start the event-creation-wizard by saying 'new event'")
      },
      otherInput: function(input) {
           notUnderstood();
      },
     simulatePrint: function(){
       Android.startSVGTransmitter(false);
       this.transition("idle");
     }
    },

    settingNewEventName: {
     cancel: function() {
       this.emit('speech', 'Canceling Event creation');
        this.transition('idle');
      },
      otherInput: function(eventName) {
       eventNm = eventName;
       this.emit('speech', 'Alright, I received ' + eventName + ' as event name. Please tell me the start time of your event');
        this.transition('selectingStartTime');
      },
     options: function(){
       this.emit("speech", "You are now in the event-creation-wizard. Please tell me how you would like to name your event. If you want to cancel the event-creation just say cancel.")
     }
    },

    selectingStartTime: {
      selectingTime: function (startTime){
          eventStartTime = startTime;
          eventStartTimeFormatted = formatAMPM(startTime);
          this.emit('speech', 'Ok, the start time of the event is ' + eventStartTimeFormatted + '. Please tell me when your event should end.');
          this.transition('selectingEndTime');
       },
       cancel: function() {
          this.emit('speech', 'Canceling Event creation');
           this.transition('idle');
       },
       back: function() {
           this.emit('speech', 'Going back. Please tell me your new event name');
           this.transition('settingNewEventName');
       },
       options: function(){
         this.emit("speech", "You are currently in the event-creation-wizard of your event " + eventNm
          + ". If you want to change the event name just say 'back', otherwise please tell me the start time of your event."
          + " Of course you can also cancel the event-creation by saying cancel.")
       },
       otherInput: function(input) {
            notUnderstood();
       }

    },

    selectingEndTime: {
      selectingTime: function (endTime){
          eventEndTime = endTime;
          eventEndTimeFormatted = formatAMPM(endTime);
          this.emit('speech', 'Your event ends ' + eventEndTimeFormatted + '. Say "finish" if you want to create the event ' + eventNm + ', starting on ' + eventStartTimeFormatted + ' and ending on ' + eventEndTimeFormatted + ', now.');
          this.transition('creatingEvent');
        },
      cancel: function() {
         this.emit('speech', 'Canceling Event creation');
         this.transition('idle');
      },
      back: function() {
          this.emit('speech', 'Going back. Please tell me the new start time.');
          this.transition('selectingStartTime');
      },
      options: function(){
        this.emit("speech", "You are currently in the event-creation-wizard of your event " + eventNm + " which starts at " + eventStartTimeFormatted
         + ". If you are not happy with the start time of the event you can tell me a new time after saying back. Otherwise please tell me the end-time of your event now."
         + " As always you can also cancel the event-creation by saying cancel.") //maybe better: If I received a wrong start time of your event just say back
      },
      otherInput: function(input) {
           notUnderstood();
      }
    },


    creatingEvent: {
       createEvent: function (){
          this.emit('speech', 'Created event ' + eventNm + ' from ' + eventStartTimeFormatted + ' to ' + eventEndTimeFormatted);
          //create event in Android
          Android.createEvent(eventNm, eventStartTime.toISOString(), eventEndTime.toISOString());
          this.transition('printing');

        },
        back: function() {
            this.emit('speech', 'Going back. Please tell me the new end time of your event.');
            this.transition('selectingEndTime');
        },
        options: function(){
          this.emit("speech", "You are currently in the event-creation-wizard of your event " + eventNm + " which starts at " + eventStartTimeFormatted + " and ends at " + eventEndTimeFormatted + ". If you are not happy with the end time of the event you can select a new time after saying back. Otherwise, if you want to create the event now just say 'finish'. As always you can also cancel the event-creation by saying cancel.");
        },
        otherInput: function(input) {
             notUnderstood();
        }
    }
  }
});



function notUnderstood(){
  fsm.emit('speech', "Sorry, I didn't understand that.");
}


fsm.on('speech', function(text) {
    Android.speak(text);
});
