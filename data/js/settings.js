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
    };
    
    $("#savewifi").click(function () {
        $.ajax("/ssid?ssid=" + $("input[name='ssid']").val() + "&password=" + $("input[name='ssidPass']").val());
    });
});