$(function() {

    $(document)
    
    var websock = new WebSocket('ws://nixie.local:81/');
    websock.onopen = function(evt) { console.log('websock open'); };
    websock.onclose = function(evt) { console.log('websock close'); };
    websock.onerror = function(evt) { console.log(evt); };
        
    websock.onmessage = function(evt) {
        var command = evt.data.substring(0, 1).charCodeAt(0);
        var value = evt.data.substring(1);
    
        console.log("Event " +  command + " " + value);
    
        switch (command) {
            case 3:
                if (value == 'true') {
                    $('#timezone-panel').collapse('hide');
                    $('#timezone-checkbox')[0].checked = true;
                } else {
                    $('#timezone-panel').collapse('show');
                    $('#timezone-checkbox')[0].checked = false;
                }
            case 4:
                $('#timezone-selected-title span').text(value);
            default:
                break;
        }
    };
    
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

        var command = String.fromCharCode(4)
        websock.send(command + prevSelectedValue);
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