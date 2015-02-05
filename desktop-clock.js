function hourAngle(hour) {

	return ((hour/12) * 360);
}

function minuteAngle(minute) {
	return ((minute/60) * 360);
}

function drawClock(id,xpos, ypos, radius) {

	var paper = Raphael(id, 2 * radius, 2 * radius);
	var STROKE_WIDTH = 5
	radius -= STROKE_WIDTH;
	var xcenter = radius + STROKE_WIDTH;
	var ycenter = radius + STROKE_WIDTH;
	var outercircle = paper.circle(xcenter, ycenter, radius)
		.attr({
			fill: "black",
			stroke: "yellow"
		});
	outercircle.attr("stroke-width", STROKE_WIDTH);
	var xnoon = radius + STROKE_WIDTH;
	var ynoon = STROKE_WIDTH;

	var bigbaton_width = 15;	// pixels
	var bigbaton_height = 15;	// percent of r
	var baton_width = 4;		// pixels
	var baton_height = 8		// percent of r
	var hand_width = bigbaton_width * 0.25;
	var dotradius = bigbaton_width;

	for (var m=0; m<60; m++) {
		if ((m % 5) == 0) {
			var bigbaton = paper.rect(
				xnoon - (baton_width / 2),
				ynoon + 8, baton_width, radius * (bigbaton_height/100))
			.attr({
				fill: "yellow",
				stroke: "yellow"
			})
			.rotate(minuteAngle(m), xcenter, ycenter);
		}
		else {
			var baton = paper.rect(
				xnoon - (baton_width / 2),
				ynoon + 8, baton_width, radius * (baton_height/100))
			.attr({
				fill: "orange",
				stroke: "orange"
			})
			.rotate(minuteAngle(m), xcenter, ycenter);
		}
	}

	var hourhand = paper.rect(
		xnoon - (hand_width/2), 
		ynoon + radius * ((bigbaton_height + 5)/100),
		hand_width, radius * (100-bigbaton_height+12)/100)
		.attr({
			fill: "yellow",
			stroke: "yellow"
		});

	var minutehand = paper.rect(
		xnoon - (hand_width/2), ynoon + radius * (baton_height/100),
		hand_width, radius * (100 + baton_height)/100)
		.attr({
			fill: "yellow",
			stroke: "yellow"
		});

	var secondhand = paper.rect(
		xnoon, ynoon + radius * (bigbaton_height/100),
		1, radius)
		.attr({
			fill: "orange",
			stroke: "orange"
		});

//	var seconddot = paper.circle(
//		xnoon, ynoon + radius * (bigbaton_height/100) + dotradius/2, dotradius)
//		.attr({
//			fill: "red",
//			stroke: "red"
//		});

	var centercircle = paper.circle(xcenter, ycenter, 5)
		.attr({
			fill: "orange",
			stroke: "orange"
		});

	window.setInterval(function() {
		var now = new Date();
		var hour = (now.getHours() % 12) + (now.getMinutes()/60) + (now.getSeconds()/3600);
		var minute = now.getMinutes() + (now.getSeconds()/60) + (now.getMilliseconds()/60000);
		var second = now.getSeconds() + (now.getMilliseconds()/1000);

		hourhand.transform("r" + hourAngle(hour) + " " + xcenter + " " + ycenter);
		minutehand.transform("r" + minuteAngle(minute) + " " + xcenter + " " + ycenter);
		secondhand.transform("r" + minuteAngle(second) + " " + xcenter + " " + ycenter);
//		seconddot.transform("r" + minuteAngle(second) + " " + xcenter + " " + ycenter);

		hour = now.getHours();
		minutes = now.getMinutes();
		if (minutes < 10 )
		{ 
			minutes = "0" + minutes; 
		}
		
		seconds  = now.getSeconds();
		if (seconds < 10 )
		{ 
			seconds = "0" + seconds; 
		}
		clockElement=window.document.getElementById("clock_text");
		clockElement.innerHTML = "<h1>"+hour+":"+minutes+":"+seconds + "</h1>";
	}, 125);

}

window.onload = function () {
	//chrome.app.window.current().fullscreen();
	drawClock("clock_id",0, 0, 200);
	
	UpdateDestinationBoard();
	window.setInterval(UpdateDestinationBoard,30000);
}	
	
	
function UpdateDestinationBoard()
{	
	var xmlhttp = new XMLHttpRequest();
	
	//var x=window.document.getElementById("station_south");
	//x.innerHTML = "<h1>Archway Northbound</h1>";
	
	xmlhttp.open("GET", "http://cloud.tfl.gov.uk/TrackerNet/PredictionDetailed/N/ARC", true); 
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			xmlDoc = xmlhttp.responseXML; 
			
			//console.log(xmlDoc);
			var platforms = xmlDoc.getElementsByTagName("P");
			var trains   = platforms[0].getElementsByTagName("T")
			console.log(platforms[0]);
			
			trainsHTML = "<h1>Archway Northbound</h1><table><tbody>";
			for(x=0;x<trains.length && x < 8;x++)
			{
				trainsHTML += "<tr><td>" + (x+1) + ". </td>";
				trainsHTML += "<td>" + trains[x].getAttribute("Destination") + "</td>"; 
				trainsHTML += "<td>" + trains[x].getAttribute("TimeTo") +"</td></tr>";
			}
			trainsHTML += "</tbody></table>"

			var trainsElement=window.document.getElementById("station_north");
			trainsElement.innerHTML=trainsHTML;

			var trains   = platforms[1].getElementsByTagName("T")			
			trainsHTML = "<h1>Archway Southbound</h1><table>";
			for(x=0;x<trains.length && x < 8;x++)
			{
				trainsHTML += "<tr><td>" + (x+1) + ". </td>";
				trainsHTML += "<td>" + trains[x].getAttribute("Destination") + "</td>"; 
				trainsHTML += "<td>" + trains[x].getAttribute("TimeTo") +"</td></tr>";
			}
			trainsHTML += "</table>"
			trainsElement=window.document.getElementById("station_south");
			trainsElement.innerHTML=trainsHTML;
		}

		else if (xmlhttp.status==404) 
		{
			alert("XML could not be found");
		}
	}
	xmlhttp.send(null);	
}
