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
var pac_x_org;
var pac_y_org;
var move_ctr = 1;
var lives = 5;
var g_coords_org;
var heart_remain=2;
var coin_loc;
var max_time;
var max_food;
var coin = true;

function setLives(){
	lives=5;
	lbllives.value=5;
}
function setTime(time)
{
	max_time = parseInt(time);
}

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
	g_coords_org = g_coords;
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
	max_food = food_remain;
	food_s = 0.6*food;
	food_m = 0.3*food;
	food_h = 0.1*food;
	
	
}

function Start() {
	document.getElementById('homeSound').muted=true;
	document.getElementById('gameSound').muted=false;
	coin = true;
	move_ctr = 1;
	context = canvas.getContext("2d");
	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	lives = 5;
	lbllives.value = lives;
	lblTime.value = max_time;
	let pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			
			if (i == 2 && j == 2){
				board[i][j] = 10;
			}
			else if(i == 5 && j == 5)
			{
				coin_loc = [5,5];
			}
			else if(i == 7 && j == 7){
				board[i][j] = 11;
			}
			else if (
				(i == 1 && j == 1) ||
				// (i == 3 && j == 3) ||
				(i == 2 && j == 3) ||
				(i == 3 && j == 2) ||
				// (i == 1 && j == 8) ||
				// (i == 3 && j == 6) ||
				// (i == 2 && j == 6) ||
				(i == 3 && j == 7) ||
				// (i == 8 && j == 1) ||
				// (i == 6 && j == 3) ||
				// (i == 6 && j == 2) ||
				(i == 7 && j == 3) ||
				// (i == 6 && j == 6) ||
				(i == 6 && j == 7) ||
				(i == 7 && j == 6) 
				// (i == 8 && j == 8) 

				// (i == 0 && j == 4) ||
				// (i == 0 && j == 5) ||
				// (i == 4 && j == 0) ||
				// (i == 5 && j == 0) ||
				// (i == 9 && j == 4) ||
				// (i == 9 && j == 5) ||
				// (i == 4 && j == 9) ||
				// (i == 5 && j == 9)
			) {
				board[i][j] = 4;
			} else {
				flag = false;
				if(food_remain == 0 && pacman_remain ==0 )
				{
					continue;
				}
				while(!flag)
				{
					var randomNum = Math.floor(Math.random()*5+1);
					
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
					else if (randomNum  == 4 && pacman_remain>0 &&checkValid2(i,j)) {
						shape.i = i;
						shape.j = j;
						pacman_remain--;
						pac_x = i;
						pac_y = j;
						pac_x_org = pac_x;
						pac_y_org = pac_y;
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
function not_borders(i,j)
{
	if((i == 0 && j == 0)||(i== 0 && j==9)||(i== 9 && j==0)||(i== 9 && j==9))
		return false;
	return true;
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
	
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			
			if (board[i][j] == 2) {
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
				context.fillStyle=color_s; //color
				// gradient.addColorStop("0"," magenta");
				// context.fillStyle = 'white'; 
				context.fill();
				context.beginPath();
				context.font = "9px Ariel";
				context.fillStyle = "white";  //<======= here
				context.fillText("5", center.x-2, center.y+3);
				context.fill();


			} 
			else if (board[i][j] == 8) {
				context.beginPath();
				context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
				context.fillStyle = color_m; //color
				context.fill();
				context.beginPath();
				context.font = "12px Ariel";
				context.fillStyle = "white";  //<======= here
				context.fillText("15", center.x-6, center.y+4);
				context.fill();

			}
			
			else if (board[i][j] == 9) {
				context.beginPath();
				context.arc(center.x, center.y, 10, 0, 2 * Math.PI); // circle
				context.fillStyle = color_h; //color
				context.fill();
				context.beginPath();
				context.font = "13px Ariel";
				context.fillStyle = "white";  //<======= here
				context.fillText("25", center.x-6, center.y+4);
				context.fill();
			} 	
			else if (board[i][j] == 10) {

				var a = center.x;
				var b =  center.y;
				var width = 30;
				var height = 30;
				
				context.save();
				context.beginPath();
				var topCurveHeight = height * 0.3;
				context.moveTo(a, b + topCurveHeight);
				// top left curve
				context.bezierCurveTo(
					a, b, 
					a - width / 2, b, 
					a - width / 2, b + topCurveHeight
				);
				
				// bottom left curve
				context.bezierCurveTo(
					a - width / 2, b + (height + topCurveHeight) / 2, 
					a, b + (height + topCurveHeight) / 2, 
					a, b + height
				);
				
				// bottom right curve
				context.bezierCurveTo(
					a, b + (height + topCurveHeight) / 2, 
					a + width / 2, b + (height + topCurveHeight) / 2, 
					a + width / 2, b + topCurveHeight
				);
				
				// top right curve
				context.bezierCurveTo(
					a + width / 2, b, 
					a, b, 
					a, b + topCurveHeight
				);
				
				context.closePath();
				context.fillStyle = "red";
				context.fill();				
			}		
			else if(board[i][j] == 11){
				
				context.beginPath();
				context.arc(center.x, center.y, 20, 0 , 2 * Math.PI);
				context.fillStyle = "#cccccc";
				context.fill();

				context.beginPath();
				context.rect(center.x - 2, center.y - 18, 4, 20);
				context.rect(center.x - 15, center.y -2, 17, 4);
				context.fillStyle = "rgb(0, 0, 0)"; //color
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
function checkWin()
{
	if(max_food == 0)
		{
			document.getElementById('gameSound').muted = true;
			window.clearInterval(interval);
			document.getElementById('winSound').play();
			window.alert("good job! you have finished the game with a score of - "+score+" points and "+ time_elapsed+" seconds, think you can do better?");
			document.getElementById('homeSound').muted=false;
			lastSoudPlayed='homeSound';
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
		max_food-=1;
		checkWin();
		
	}
	if (board[shape.i][shape.j] == 8) {
		score+=15;
		max_food-=1;
		checkWin();
	}
	if (board[shape.i][shape.j] == 9) {
		score+=25;
		max_food-=1;
		checkWin();
	}
	if (board[shape.i][shape.j] == 10) {
		lives+=1;
		lbllives.value=lives;
	}
	if (board[shape.i][shape.j] == 11) {
		
		max_time+=15;		
		
	}
	if(shape.i == coin_loc[0] && shape.j == coin_loc[1])
	{
		score+=50;
		coin = false;
	}
	board[shape.i][shape.j] = 2;
	pac_x = shape.i;
	pac_y = shape.j;
	
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	time_elapsed = Math.floor(max_time - time_elapsed);
	if(lives == 0)
	{

		document.getElementById('gameSound').muted = true;
		window.clearInterval(interval);
		document.getElementById('loseSound').play();
		window.alert("Loser!");
		document.getElementById('homeSound').muted=false;
		lastSoudPlayed='homeSound';
	}
	else if (time_elapsed == 0) {
		document.getElementById('gameSound').muted = true;
		window.clearInterval(interval);
		if(score >= 100){
			document.getElementById('winSound').play();
			window.alert("Winner!");
		}

		else{
			document.getElementById('timeoutSound').play();
			window.alert("You are better than "+score+"points");
		}
		document.getElementById('homeSound').muted=false;
		lastSoudPlayed='homeSound';
	} else {
		
		Draw(x);
		DrawGhosts();
		UpdateGhosts(move_ctr++);
		if(coin)
		{DrawCoin();
		MoveCoin();}
	}
}


function UpdateGhosts(move_ctr)
{
	
	if(move_ctr % 2 != 0)
	{
				
		return 0;
	}
	
	for( var i = 1; i <= n_ghosts ; i++)
	{
		if(UpdateGhost(i))
		{
			return 1;
		}
		
	}
	
	return 1;

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
		if(checkValid(c[0],c[1],index))
		{
			dists[j] = calcDistance(c[0],c[1]);
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
	var x = g_coords[index][0];
	var y = g_coords[index][1];
	if(board[x][y] == 2)
		{
			lives-=1;
			score-= 10;
			refresh()
			pac_x = pac_x_org;
			pac_y = pac_y_org;
			shape.i = pac_x;
			shape.j = pac_y;
			lbllives.value = lives;
			board[x][y] = 0;
			board[pac_x_org][pac_y_org] = 2;
			if(lives == 0)
			{
				document.getElementById('gameSound').muted=true;
				window.clearInterval(interval);
				document.getElementById('loseSound').play();
				window.clearInterval(interval)
				window.alert("you lost!");
				document.getElementById('homeSound').muted=false;
				lastSoudPlayed='homeSound';

			}
			return true;
		}
		return false;
}
function checkValid(i,j,index)
{
	if(i < 0 || j < 0 || i > 9 || j > 9 || board[i][j] == 4 || !checkGhosts(i,j,index))
		return false;
	return true;
}

function checkGhosts(a,b,index)
{
	for(var i = 1 ; i <= n_ghosts ; i++)
	{
		if(i == index)
			continue;
		var x = g_coords[i][0];
		var y = g_coords[i][1];
		if(a == x && b == y)
			return false;
	}
	return true;
}
function checkValid2(i,j)
{
	if(i == 0 || j == 0 || i == 9 || j == 9 || board[i][j] == 4)
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

 function DrawGhosts()
 {
	for(var i = 1 ; i<=n_ghosts;i++)
	{
		center = new Object();
		var x = g_coords[i][0];
		var y = g_coords[i][1];
		center.x = x*60+30;
		center.y = y*60+30;
		const img = new Image();
		img.src = ghosts[i];
		context.drawImage(img,center.x,center.y);

	}
 }
 function refresh()
 {
	 g_coords[1] = [0,0];
	 g_coords[2] = [0,9];
	 g_coords[3] = [9,0];
	 g_coords[4] = [9,9];
 }

 function DrawCoin()
 {
	center = new Object();
	var x = coin_loc[0];
	var y = coin_loc[1];
	center.x = x*60+30;
	center.y = y*60+30;
	const img = new Image();
	img.src = 'pictures/coin.png';
	context.drawImage(img,center.x,center.y);
 }
 function MoveCoin()
 {
	
	var x = coin_loc[0];
	var y = coin_loc[1];
	var dirs = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
	var dir;
	while(true)
	{
		var random_dir = Math.floor(Math.random()*4);
		dir = dirs[random_dir];
		if(checkValid(dir[0],dir[1],5))
			break;
	}
	coin_loc[0] = dir[0];
	coin_loc[1] = dir[1];
 }