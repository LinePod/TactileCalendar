var maxAirbarHeight = 1936;
var maxAirbarWidth = 3452;
var airbarA4OffsetX = -500;
var airbarA4OffsetY = 900;

//maxAirbarWidth / maxAirbarHeight = 1,78305
var lastx2=0;
var lasty2=0;
var cursorX1;
var cursorY1;
var cursorX2;
var cursorY2;

var sizeFactor = maxAirbarWidth / svg.attr("width");
console.log(sizeFactor);


function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}

function getInputData(x1,y1,x2,y2,eventType1,eventType2){
    //simulate mouse event
    /*x1 = x1/sizeFactor;
    y1 = y1/sizeFactor;
    x2 = x2/sizeFactor;
    y2 = y2/sizeFactor;*/
    x1 = (maxAirbarWidth - x1 + airbarA4OffsetX)/10;
    y1 = (maxAirbarHeight - y1 + airbarA4OffsetY)/10;
    x2 = (maxAirbarWidth - x2 + airbarA4OffsetX)/10;
    y2 = (maxAirbarHeight - y2 + airbarA4OffsetY)/10;


    console.log(x1 + ", " + y1);
    console.log(x2 + ", " + y2);
    //simulate(document.elementFromPoint(x,y),"mouseover", { pointerX: x, pointerY: y });
    //simulate(document.elementFromPoint(x,y),"mouseover", { pointerX: x, pointerY: y });

    console.log(document.elementFromPoint(x1,y1));
    console.log(eventType1);
    console.log(eventType2);

    checkEventType(eventType1,x1,y1);
    //simulate(document.elementFromPoint(x1,y1),"mouseover", { pointerX: x1, pointerY: y1});
    if (lastx2!=x2 && lasty2!=y2){
        checkEventType(eventType2,x2,y2);
        lastx2 = x2;
        lasty2 = y2;
    }

    cursorX1 = x1;
    cursorY1 = y1;
    cursorX2 = x2;
    cursorY2 = y2;


}


function getInputDataDebug(x1, y1, x2, y2, eventType1, eventType2){
     console.log(document.elementFromPoint(x1,y1));
        console.log(eventType1);
        console.log(eventType2);

        checkEventType(eventType1,x1,y1);

        if (lastx2!=x2 && lasty2!=y2){
            checkEventType(eventType2,x2,y2);
            lastx2 = x2;
            lasty2 = y2;
        }

}

function checkEventType(eventType,x,y){

    switch(eventType){
        case 0: simulate(document.elementFromPoint(x,y),"mouseover", { pointerX: x, pointerY: y});break;
        case 1: simulate(document.elementFromPoint(x,y),"click", { pointerX: x, pointerY: y});break;
        case 2: simulate(document.elementFromPoint(x,y),"mouseout", { pointerX: x, pointerY: y});break;
    }
}


function getAllElementsFromPoint(x, y) {
    var elements = [];
    var display = [];
    var item = document.elementFromPoint(x, y);
    while (item && item !== document.body && item !== window && item !== document && item !== document.documentElement) {
        elements.push(item);
        display.push(item.style.display);
        item.style.display = "none";
        item = document.elementFromPoint(x, y);
    }
    // restore display property
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = display[i];
    }
    return elements;
}

function printStatusChanged(status){
    switch(status){
        case 0: fsm.handle("printed");

    }
}
