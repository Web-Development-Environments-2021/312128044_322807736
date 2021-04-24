var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var up;
var down;
var left;
var right;
var food_remain;
var scoreWin;
var food_s;
var food_m;
var food_h;
var color_s;
var color_m;
var color_h;

function setKeys(_up,_down,_left,_right)
{
	up =_up;
	down = _down;
	left = _left;
	right = _right;
}
function setColors(s,m,h)
{
	color_s = s;
	color_m = m;
	color_h = h;
}

function setFood(food)
{
	food_remain = food;
	
	food_s = 0.6*food;
	food_m = 0.3*food;
	food_h = 0.1*food;
	
	scoreWin = 25*food_h + 15*food_m +5*food_s;
}

function Start() {
	context = canvas.getContext("2d");
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	
	let pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				flag = false;
				if(food_remain == 0 && pacman_remain ==0)
				{
					continue;
				}
				while(!flag)
				{
					var randomNum = Math.floor(Math.random()*4+1);
					console.log(randomNum);
					if (randomNum  == 1 && food_s>0) {
						food_s--;
						food_remain--;
						board[i][j] = 7;
						flag = true;
					}
					else if(randomNum  == 2 && food_m>0)
					{
						food_m--;
						food_remain--;
						board[i][j] = 8;
						flag = true;
					} 
					else if(randomNum  == 3 && food_h>0)
					{
						food_h--;
						food_remain--;
						board[i][j] = 9;
						flag = true;
					} 
					else if (randomNum  == 4 && pacman_remain>0) {
						shape.i = i;
						shape.j = j;
						pacman_remain--;
						board[i][j] = 2;
						flag = true;
					} 
					
				}
				
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[String.fromCharCode(e.keyCode)] = true;
			
			
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[String.fromCharCode(e.keyCode)] = false;
			
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
	
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[up]) {//up
		return 1;
	}
	if (keysDown[down]) {//down
		return 2;
	}
	if (keysDown[left]) {//left
		return 3;
	}
	if (keysDown[right]) {//right
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			}
			 else if (board[i][j] == 7) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = color_s; //color
				context.fill();
			} 
			else if (board[i][j] == 8) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = color_m; //color
				context.fill();
			} 
			else if (board[i][j] == 9) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = color_h; //color
				context.fill();
			} 
			else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 7) {
		score+=5;
	}
	if (board[shape.i][shape.j] == 8) {
		score+=15;
	}
	if (board[shape.i][shape.j] == 9) {
		score+=25;
	}

	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == scoreWin) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}


