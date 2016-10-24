var h = 0;
var w = 0;
var xpx = 0;
var ypx = 0;
var curCellArr = [];
var row = [];
var done = false;
var genNr = 1;
var timer;
var times = [];
var canvasClientX = 0;
var canvasClientY = 0;

var c;
var ctx;


// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillRandom() {
  for (let i = 0; i < h; i++) {
  	row = [];
  	for (let j = 0; j < w; j++) {
  	  row.push(getRandomIntInclusive(1, 10) < 3 ? true : false);
  	}
  	curCellArr.push(row);
  	preCellArr = [];
  }
  $("#btnStartStop").html("Start");	
}

function clear() {
  for (let i = 0; i < h; i++) {
  	row = [];
  	for (let j = 0; j < w; j++) {
  	  row.push(false);
  	}
  	curCellArr.push(row);
  	preCellArr = [];
  }
  $("#btnStartStop").html("Start");
}

function displayBoard() {
  var board = "";
	
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,xpx, ypx);
	
  for (let i = 0; i < h; i++) {
  	for (let j = 0; j < w; j++) {
	  	if (curCellArr[i][j] === true) {
  	  	t = i*10+1;
  	  	l = j*10+1;
	  		ctx.fillStyle = "#FF0000";
	  		ctx.fillRect(l,t,8,8);
  	  }
	  }
  }

  $("#count").html(genNr);
  $("#board").html(board);
}

function getNextGen() {
	var count = 0;
	var row = [];
  var board = "";
  var nxtCellArr = [];

  for (let y = 0; y < h; y++) {
  	row = [];
  	for (let x = 0; x < w; x++) {
  		count = 0;

  		if (y === 0) {
  			var ym1 = h - 1;
  		} else {
  			ym1 = y - 1;
  		}
  		if (y === h - 1) {
  			var yp1 = 0;
  		} else {
  			yp1 = y + 1;
  		}
  		if (x === 0) {
  			var xm1 = w - 1;
  		} else {
  			xm1 = x - 1;
  		}
  		if (x === w - 1) {
  			var xp1 = 0;
  		} else {
  			xp1 = x + 1;
  		}

  		count = curCellArr[ym1][xm1] + curCellArr[ym1][x] + curCellArr[ym1][xp1] + 
  						curCellArr[y][xm1] + curCellArr[y][xp1] + 
  						curCellArr[yp1][xm1] + curCellArr[yp1][x] + curCellArr[yp1][ xp1];

  		switch (count) {
  			case 2: row.push(curCellArr[y][x]); break;
  			case 3: row.push(true); break;
  			default: row.push(false);
  		}
  	}
  	nxtCellArr.push(row);
  }

  curCellArr = nxtCellArr;
}

function startStop() {
	if ($("#btnStartStop").html() === "Start") {
		timer = window.setInterval(function(){
			getNextGen();
			displayBoard();
			genNr++;
		}, 100);
		$("#btnStartStop").html("Pause");
	} else {
		window.clearInterval(timer);
		$("#btnStartStop").html("Start");
	}
}

function toggle(e) {
		var y = parseInt(e.offsetY / 10);
		var x = parseInt(e.offsetX / 10);

		curCellArr[y][x] = !curCellArr[y][x];
		displayBoard();
}

function standardDeviation(values){
  var avg = average(values);
  
  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  
  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data){
  var sum = data.reduce(function(sum, value){
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}



$(document).ready( function() {
  "use strict";

	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");

  xpx = (parseInt(window.innerWidth/20) + 1) * 10;
  ypx = (parseInt(window.innerHeight/20) + 1) * 10;

  $("#playArea").css("width", xpx + 14);
	$("#playArea").css("height", ypx + 59);
  $("#myCanvas").css("width", xpx);
	$("#myCanvas").css("height", ypx);
	h = ypx / 10;
	w = xpx / 10;

	c.height = ypx;
	c.width = xpx;

  //canvasClientX = parseInt($("#myCanvas").css("left").substr(0, $("#myCanvas").css("left").length-2)) + parseInt($("#playArea").css("left").substr(0, $("#playArea").css("left").length-2));
  //canvasClientY = parseInt($("#myCanvas").css("top").substr(0, $("#myCanvas").css("top").length-2)) + parseInt($("#playArea").css("top").substr(0, $("#playArea").css("top").length-2));

  $("#btnStartStop").on("click", function() {startStop();})
  $("#btnNext").on("click", function() {getNextGen();	genNr++;	displayBoard();})
  $("#btnClear").on("click", function() {window.clearInterval(timer);curCellArr = [];clear();genNr = 1;displayBoard();})
  $("#btnRandom").on("click", function() {window.clearInterval(timer);curCellArr = [];fillRandom();genNr = 1;displayBoard()})
  $(".cell").on("click", function() {})
  fillRandom();
  displayBoard();
});