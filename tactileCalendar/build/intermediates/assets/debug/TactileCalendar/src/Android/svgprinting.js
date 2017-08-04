
var removedItems = {};
var printJobs = [];


function getSVG(){

	var svg = document.getElementById("svg");
	//get svg source.
	var serializer = new XMLSerializer();
	var source = serializer.serializeToString(svg);

	//add name spaces.
	if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
	    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
	}

	//add xml declaration
	source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
	console.log(source);
    return source;
}

function getSVGDiff(){

	var svg = document.getElementById("svg");
	//get svg source.
	removedItems = {};
    traverseDOM(svg);
    svgVersionNr+=1;
    var elementsToRmCount = 0;
    for (var el in removedItems){
        if (removedItems.hasOwnProperty(el)){
            elementsToRmCount += removedItems[el].length;
        }
    }
    console.log(elementsToRmCount + " elements to remove");

    removeItemsTemporary();
    //removeVersionAttr(svg);
	var serializer = new XMLSerializer();
	var source = serializer.serializeToString(svg);
    restoreDOM();

	//add name spaces.
	if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
	    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
	}

	//add xml declaration
	source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
	console.log(source);
    return source;
}


function traverseDOM(element){


    if (element.getAttributeNS(linepodNS, 'version')==null){
        element.setAttributeNS(linepodNS, 'version', svgVersionNr);
    }
    console.log(element	);
    var children = element.childNodes;
    console.log(children + children.length);
    for (var i =0; i <children.length; i++){
        var child = children[i];
        if (child.tagName.toLowerCase() != "defs"){
            traverseDOM(child);
            console.log("version " + child.getAttributeNS(linepodNS,"version"));
            if ((child.getAttributeNS(linepodNS, "version")!= svgVersionNr) && (child.tagName.toLowerCase() != "g") && (child.tagName.toLowerCase() != "svg")){ //(child.getAttributeNS(linepodNS, "version")== 0 ||
                console.log("element to remove temporary " + child + " parent " + element);
                if (element.getAttribute("id")==null){
                    var newParentId = generateUUID();
                    element.setAttribute("id",newParentId);
                }
                var id = element.getAttribute("id");
                if (removedItems[id]==null){
                    removedItems[id] = [child];
                } else {
                    removedItems[id].push(child);
                }
            }
        }
    }

}

//this function and restoreDOM are needed to get the diff between print-jobs.
//only svg elements are printed that were added after the last print job.

function removeItemsTemporary(){
	removedItemsCopy = removedItems;
    removedItems = {};
    removedElementsCount = 0;
    for (var elementId in removedItemsCopy){

		if (removedItemsCopy.hasOwnProperty(elementId)) {
			removedItems[elementId] = [];
			for (var i=0; i< removedItemsCopy[elementId].length;i++){

			    console.log("removing element");
			    console.log("parent:");
                console.log(document.getElementById(elementId));
                console.log("element:");
                console.log(removedItemsCopy[elementId][i]);
				removedItems[elementId].push(document.getElementById(elementId).removeChild(removedItemsCopy[elementId][i]));
				removedElementsCount += 1;
			}
		}
	}
	console.log("removed " + removedElementsCount + " elements");
}

//this function and removeItemsTemporary are needed to get the diff between print-jobs.
//only svg elements are printed that were added after the last print job.


function restoreDOM(){
	console.log("restoring dom");
	for (var elementId in removedItems){
		if (removedItems.hasOwnProperty(elementId)) {
			console.log(removedItems[elementId]);
			//console.log(document.getElementById(elementId));
			for (var i=0; i< removedItems[elementId].length;i++){
				console.log(removedItems[elementId][i]);
				document.getElementById(elementId).appendChild(removedItems[elementId][i]);
			}
		}
	}

}


function simulateFirstPrint(){
    getSVGDiff();
    var source = '<?xml version="1.0" standalone="no"?>\r\n' + "<svg></svg>";
    console.log(source);
    var printJobUUID = generateUUID();
    console.log(printJobUUID);
    printJobs.push(printJobUUID);
    Android.sendSVGToLaserPlotter(source, printJobUUID);
}


function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

function printSVG(){
    var printJobUUID = generateUUID();
    console.log(printJobUUID);
    printJobs.push(printJobUUID);
    Android.sendSVGToLaserPlotter(getSVGDiff(), printJobUUID);
}


