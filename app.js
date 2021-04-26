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
var n_ghosts;
var ghosts = [];
var g_coords = [];
var lastmove=4;
var pac_x;
var pac_y;

function setGhosts(ghost)
{
	var str = 'pictures/Ghosts/'
	ghosts[1] = str+'1.png';
	ghosts[2] = str+'2.png';
	ghosts[3] = str+'3.png';
	ghosts[4] = str+'4.png';
	n_ghosts = ghost;
	g_coords[1] = [0,0];
	g_coords[2] = [0,9];
	g_coords[3] = [9,0];
	g_coords[4] = [9,9];
}
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
				(i == 1 && j == 1) ||
				(i == 3 && j == 3) ||
				(i == 2 && j == 3) ||
				(i == 3 && j == 2) ||
				(i == 1 && j == 8) ||
				(i == 3 && j == 6) ||
				(i == 2 && j == 6) ||
				(i == 3 && j == 7) ||
				(i == 8 && j == 1) ||
				(i == 6 && j == 3) ||
				(i == 6 && j == 2) ||
				(i == 7 && j == 3) ||
				(i == 6 && j == 6) ||
				(i == 6 && j == 7) ||
				(i == 7 && j == 6) ||
				(i == 8 && j == 8) ||

				(i == 0 && j == 4) ||
				(i == 0 && j == 5) ||
				(i == 4 && j == 0) ||
				(i == 5 && j == 0) ||
				(i == 9 && j == 4) ||
				(i == 9 && j == 5) ||
				(i == 4 && j == 9) ||
				(i == 5 && j == 9)
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
						pac_x = i;
						pac_y = j;
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


function Draw(x) {
	let posibleMove=[1,2,3,4]
	let g_ind = 1;
	console.log(g_coords[g_ind][0]+" , " + g_coords[g_ind][1]);
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (i == g_coords[g_ind][0] && j == g_coords[g_ind][1]) {
				console.log(i+" , "+j)
				const img = new Image();
				img.src = ghosts[g_ind];
				
				context.drawImage(img,center.x,center.y)
				g_ind+=1;
			}
			else if (board[i][j] == 2) {
				if(posibleMove.includes(x,0)){
					drowPacman(center, x);
				}
				else{
					drowPacman(center, lastmove);
				}		
			}
			 else if (board[i][j] == 7) {
				context.beginPath();
				context.arc(center.x, center.y, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = color_s; //color
				context.fill();
			} 
			else if (board[i][j] == 8) {
				context.beginPath();
				context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
				context.fillStyle = color_m; //color
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
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle

				context.fillStyle = color_h; //color
				context.fill();
			} 
			
			else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 25, center.y - 25, 50, 50);
				context.fillStyle = "rgba(0,0,0,0.8)"; //color
				context.fill();
			}
		}
	}
}

function drowPacman(center, moveTo){
	if(moveTo == 1){ //up
		context.beginPath();
		context.arc(center.x, center.y, 23, 1.65 * Math.PI, 1.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x -15, center.y - 5, 3.5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
		lastmove=1;
		
	}
	if(moveTo==2){ //down
		context.beginPath();
		context.arc(center.x, center.y, 23, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 15, center.y - 5, 3.5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
		lastmove=2;
		
	}
	if(moveTo==3){ //left
		context.beginPath();
		context.arc(center.x, center.y, 23, 1.20 * Math.PI, 0.85 * Math.PI); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 5, center.y - 15, 3.5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
		lastmove=3;
	}
	if(moveTo==4){ //right
		context.beginPath();
		context.arc(center.x, center.y, 23, 1.85 * Math.PI, 0.15 * Math.PI,true); // half circle
		context.lineTo(center.x, center.y);
		context.fillStyle = pac_color; //color
		context.fill();
		context.beginPath();
		context.arc(center.x + 5, center.y - 15, 3.5, 0, 2 * Math.PI); // circle
		context.fillStyle = "black"; //color
		context.fill();
		lastmove=4;
		
	}

}
function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	// lastmove=x;
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
	pac_x = shape.i;
	pac_y = shape.j;
	UpdateGhosts();
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	
	if (score == scoreWin) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw(x);
	}
}
function UpdateGhosts()
{
	
	for( var i = 1; i <= n_ghosts ; i++)
	{
		UpdateGhost(i);
		
	}
	

}
function UpdateGhost(index)
{
	var x = g_coords[index][0];
	var y = g_coords[index][1];
	var c_check = [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
	var dists =[999999,999999,999999,999999];
	var j = 0;
	for(c of c_check)
	{
		if(checkValid(c[0],c[1]))
		{
			dists[j] = calcDistance(c[0],c[1]);
			console.log("distance: "+dists[j]);
		}
		j+=1;
	}

	var min = dists[0];
	var min_idx = 0;
	for(var i = 1 ; i < dists.length;i++)
	{
		if(dists[i] < min)
		{
			min = dists[i];
			min_idx = i;
		}
	}
	g_coords[index] = c_check[min_idx];
}
function checkValid(i,j)
{
	if(i < 0 || j < 0 || i > 9 || j > 9 || board[i][j] == 4)
		return false;
	return true;
}
function calcDistance(x,y)
{
	return (pac_x-x)*(pac_x-x) + (pac_y-y)*(pac_y-y);
}
function wait(ms){
	var start = new Date().getTime();
	var end = start;
	while(end < start + ms) {
	  end = new Date().getTime();
   }
 }