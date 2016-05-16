
$( document ).ready(function() {
    
var ws = new WebSocket("ws://127.0.0.1:8080/tower-thief-1.0/websocket/chat");
ws.onopen = function(){
};
ws.onmessage = function(message){
    update(message);
};
function postToServer(){
    ws.send(document.getElementById("msg").value);
    document.getElementById("msg").value = "";
}
function closeConnect(){
    ws.close();
}
function postDataToServer(color,x,y){
    ws.send(JSON.stringify(createMessage(color, x,y)));    
}

function createMessage(color, x,y){
    var message = new Object();
    message.color = color;
    message.x = x;
    message.y = y;
    return message;
}
    
var canvas = document.querySelector("#myCanvas");
var context = canvas.getContext("2d");    
var back = ["blue","gray","red","black","green","yellow","purple"];
var color = back[Math.floor(Math.random() * back.length)];
    
function update(data) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  points = JSON.parse(data.data);
    for (var prop in points) {
        var point = {
            color: prop,
            x: points[prop][0],
            y: points[prop][1]
        };
                
        context.beginPath();
        context.arc(point.x, point.y, 50, 0, 2 * Math.PI, true);  
        context.fillStyle = point.color;
        context.fill();    
        context.closePath();
    }
    
//    requestAnimationFrame(update);
}

var canvasPos = getPosition(canvas);
var mouseX = 0;
var mouseY = 0;
 
canvas.addEventListener("mousemove", sendMousePosition, false);
 
function sendMousePosition(e) {
  mouseX = e.clientX - canvasPos.x;
  mouseY = e.clientY - canvasPos.y;
  postDataToServer(color, mouseX,mouseY)

}       

function getPosition(el) {
  var xPosition = 0;
  var yPosition = 0;
 
  while (el) {
    xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
    yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
    el = el.offsetParent;
  }
  return {
    x: xPosition,
    y: yPosition
  };
}    
});
