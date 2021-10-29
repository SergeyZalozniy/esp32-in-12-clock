function start() {
$.getJSON( "config.json", function( data ) {
	var jsonssid = data.ssid; 
	var jsonpassword = data.password; 

	if (jsonssid === undefined || jsonssid === null) {
	}else{
		document.getElementById('ssid').value=jsonssid;
	}
	
	if (jsonpassword === undefined || jsonpassword === null) {
	}else{
		document.getElementById('ssidPass').value=jsonpassword;
	}
});
}

$(function() {

$("#switch").click(function(){
	console.log("link click");
	$.ajax( "/switchstate");
});

$("#volume").ionRangeSlider({
	type: "single",
	min: 1,
	max: 255,
	from: 1,
	keyboard: true,

	onFinish: function (data) {
		$.ajax( "/volume?volume=" + data.from );
		websock.send('volume' + data.from);
	}
});	

$("#speeed").ionRangeSlider({
	type: "single",
	min: 1,
	max: 255,
	from: 1,
	keyboard: true,

	onFinish: function (data) {
		$.ajax( "/speed?speed=" + data.from );
		websock.send('speed' + data.from);
	}
});

$("#scale").ionRangeSlider({
	type: "single",
	min: 1,
	max: 100,
	from: 1,
	keyboard: true,

	onFinish: function (data) {
		$.ajax( "/scale?scale=" + data.from );
		websock.send('scale' + data.from);
	}
});				

var websock;
	websock = new WebSocket('ws://nixie.local:81/');
	websock.onopen = function(evt) { console.log('websock open'); };
	websock.onclose = function(evt) { console.log('websock close'); };
	websock.onerror = function(evt) { console.log(evt); };

	
websock.onmessage = function(evt) {
	console.log(evt);

	if (evt.data.substring(0, 6) == 'effect') {
		$("#effect").val(evt.data.substring(6));
	} else if (evt.data.substring(0, 6) == 'volume') {
		$("#volume").data("ionRangeSlider").update({
		   from: evt.data.substring(6)
		 });
 	} else if (evt.data.substring(0, 5) == 'speed') {
		$("#speeed").data("ionRangeSlider").update({
		   from: evt.data.substring(5)
		 });
 	} else if (evt.data.substring(0, 5) == 'scale') {
		$("#scale").data("ionRangeSlider").update({
		   from: evt.data.substring(5)
		 });
	} else if (evt.data.substring(0, 5) == 'timer') {
		var totalSeconds = parseInt(evt.data.substring(5));
		var hours = Math.trunc(totalSeconds / 60 / 60);
		var minutes = Math.trunc((totalSeconds / 60) % 60);
		var text = 'До выключения - ';
		if (hours > 0 || minutes > 0) {
			document.getElementById('h5_timer').innerHTML = text + hours + " час. " + minutes + " мин.";
		} else {
			document.getElementById('h5_timer').innerHTML = text + "меньше 1 минуты";
		}
 	} else if (true) {
		$('#timezone').value = evt.data.timezone;
		$('#timezone-panel-title').innerHTML = evt.data;
		$('#timezone-selected-title span').innerHTML = evt.data;
	} else {
		 console.log('unknown event - ' + evt.data);
	}
};

$('#effect').change(function () {
	var selectedval = $(this).find("option:selected").val();
	$.ajax( "/saveeffect?effect=" + selectedval );
	websock.send('effect' + selectedval);
});

$('#timer').change(function () {
	var selectedval = $(this).find("option:selected").val() * 60;
	$.ajax( "/savetimer?timer=" + selectedval );
	websock.send('timer' + selectedval);
});

});


var timezoneSelect = $('#timezone');
var prevSelectedValue;

timezoneSelect.change(function(e) {
	var elements = document.getElementById("timezone").options;
	if (typeof(prevSelectedValue) != 'undefined') {
		for(var i = 0; i < elements.length; i++){
		if(elements[i].selected && elements[i].value == prevSelectedValue) 
			elements[i].selected = false;
		}
	}

	prevSelectedValue = timezoneSelect.find("option:selected").val();
	$('#timezone-selected-title span').text(prevSelectedValue);
});

$('#timezone-checkbox').on('change', function() {
	$('#timezone-panel').collapse('toggle');
});

$('.filter-timezones').change(function() {
	
}); ;

$(document)

