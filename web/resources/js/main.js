var ws = new WebSocket("ws://127.0.0.1:8080/tower-thief-1.0/websocket/chat");
ws.onopen = function(){
};
ws.onmessage = function(message){
    document.getElementById("chatlog").textContent += message.data + "\n";
};
function postToServer(){
    ws.send(document.getElementById("msg").value);
    document.getElementById("msg").value = "";
}
function closeConnect(){
    ws.close();
}

