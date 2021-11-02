$(function() {

$("#savewifi").click(function () {
	$.ajax("/ssid?ssid=" + $("input[name='ssid']").val() + "&password=" + $("input[name='ssidPass']").val());
});

$("#switch").click(function(){
	$.ajax( "/switchstate");
});

// $("#volume").ionRangeSlider({
// 	type: "single",
// 	min: 1,
// 	max: 255,
// 	from: 1,
// 	keyboard: true,

// 	onFinish: function (data) {
// 		$.ajax( "/volume?volume=" + data.from );
// 		websock.send('volume' + data.from);
// 	}
// });				

var websock = new WebSocket('ws://nixie.local:81/');
websock.onopen = function(evt) { console.log('websock open'); };
websock.onclose = function(evt) { console.log('websock close'); };
websock.onerror = function(evt) { console.log(evt); };

	
websock.onmessage = function(evt) {
	var command = evt.data.substring(0, 1).charCodeAt(0);
	var value = evt.data.substring(1);

	console.log("Event " +  command + " " + value);

	switch (command) {
		case 1:
			if (document.getElementById('ssidPass') != null) {
				document.getElementById('ssidPass').value = value;
			}
		case 2:
			if (document.getElementById('ssid') != null) {
				document.getElementById('ssid').value = value;
			}
		default:
			break;
	}
	// console.log('unknown event - ' + evt.data);
	// if (evt.data.substring(0, 6) == 'effect') {
	// 	$("#effect").val(evt.data.substring(6));
	// } else if (evt.data.substring(0, 6) == 'volume') {
	// 	$("#volume").data("ionRangeSlider").update({
	// 	   from: evt.data.substring(6)
	// 	 });
 	// } else if (evt.data.substring(0, 5) == 'speed') {
	// 	$("#speeed").data("ionRangeSlider").update({
	// 	   from: evt.data.substring(5)
	// 	 });
 	// } else if (evt.data.substring(0, 5) == 'scale') {
	// 	$("#scale").data("ionRangeSlider").update({
	// 	   from: evt.data.substring(5)
	// 	 });
	// } else if (evt.data.substring(0, 5) == 'timer') {
	// 	var totalSeconds = parseInt(evt.data.substring(5));
	// 	var hours = Math.trunc(totalSeconds / 60 / 60);
	// 	var minutes = Math.trunc((totalSeconds / 60) % 60);
	// 	var text = 'До выключения - ';
	// 	if (hours > 0 || minutes > 0) {
	// 		document.getElementById('h5_timer').innerHTML = text + hours + " час. " + minutes + " мин.";
	// 	} else {
	// 		document.getElementById('h5_timer').innerHTML = text + "меньше 1 минуты";
	// 	}
 	// } else if (true) {
	// 	$('#timezone').value = evt.data.timezone;
	// 	$('#timezone-panel-title').innerHTML = evt.data;
	// 	$('#timezone-selected-title span').innerHTML = evt.data;
	// } else {
		 
	// }
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

var timezoneSelect = $('#timezone');
var prevSelectedValue;
var timezoneDataCache = [];

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

	var autoTimeZone = $('#timezone-checkbox').is(":checked")
	var command = String.fromCharCode(3)
	websock.send(command + autoTimeZone);
});

$('#filter-timezones-input').on('input', function(e) {
	timezoneSelect[0].options.length = 0;
	var value = e.target.value.toLowerCase();
	if (value === '') {
		return restoreTimeZoneData();
	}
	timezoneDataCache.forEach(option => {
		if (option.text.toLowerCase().indexOf(value) !== -1) {
			timezoneSelect[0].appendChild(option);
		}
	})
});

function restoreTimeZoneData(){
	timezoneDataCache.forEach(option => timezoneSelect[0].appendChild(option));
}

window.onload = function() {
	// Load cache
	for (var i=0, iLen=timezoneSelect[0].options.length; i<iLen; i++) {
		timezoneDataCache.push(timezoneSelect[0].options[i]);
	}
}

});