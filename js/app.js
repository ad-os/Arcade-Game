/*Created By: Adhyan
 *Date: 22-08-2015
 *Aim: As part of Udacity's front-end nanodegree project.
 *Place: Noida, India.
 */

/*app.js
 *This file contains the functional class declaraion and 
 *it's methods,which engine.js calls during each frame.
	 
 *This file contains globally available variables like
 *flag, ctx, clockIsShowing etc, so that engine.js can 
 *use it without any errors.
 */

/*create the canvas element, grab the 2D context for that canvas
 *set the canvas elements height/width and add it to the DOM.
 */
var doc = document,
	win = window,
	canvas = doc.createElement('canvas'), 	//This canvas element is for rendering game.
	ctx = canvas.getContext('2d'),
	numLevel = 1,
	flag = 0, 								//This flag variable checks whether the player has been selected or not.
	enemyRandomPosition = [70, 140, 225], 	//This list is for selecting random positons of enemy.
	c = doc.getElementById('timer'), 		//This canvas element is for rendering clock.
	cx = c.getContext('2d'),
	clockIsShowing = 0; 					//This variable checks whether the clock is being shown or not.

canvas.width = 505;
canvas.height = 606;
$(".canvas").append(canvas);

//The styling for the clock canvas
cx.strokeStyle = '#28d1fa';
cx.lineWidth = 8;
cx.lineCap = 'round';
cx.shadowBlur = 10;
cx.shadowColor = '#28d1fa';

/*
 *@desc this functional class will hold the functions for enemy interactions.
 *example include getRandomSpeed(), update(), render().		
 */
var Enemy = function(x, y) {
	this.sprite = 'images/enemy-bug.png';
	this.x = x;
	this.y = y;
	this.speed = this.getRandomSpeed(100, 300);
};

/*
 *@desc gets a random speed of the enemy.
 *@params int min- the minimum speed of the enemy, int max- the maximum speed of the enemy.		
 *@return int - the speed between min and max.		
 */
Enemy.prototype.getRandomSpeed = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
};

/*
 *@desc Update the enemy's position.
 *@params float dt- a time delta between ticks			
 */
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	if (this.x > 505) {
		this.x = 0;
	} else {
		this.x = Math.floor(this.x + this.speed * dt);
	}
};

/*
 *@desc Draw the enemy on the screen.		
 */
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 *@desc this functional class will hold the functions for player interactions.
 *example includes update(), render(), collision(), levelUp(), gameOver(), handleInput().		
 */
var Player = function(x, y, image) {
	this.x = x;
	this.y = y;
	this.sprite = image;
};

/*
 *@desc Draw the player on the screen.		
 */
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
 *@desc Update the player position.
 *@params float dt- a time delta between ticks			
 */
Player.prototype.update = function(dt) {
	if (this.direction == 'left' && this.x > 0) {
		this.x -= dt * 400;
	} else if (this.direction == 'right' && this.x < 404) {
		this.x += dt * 400;
	} else if (this.direction == 'down' && this.y < 75 * 4) {
		this.y += dt * 400;
	} else if (this.direction == 'up' && this.y > 0) {
		this.y -= dt * 400;
	}
	this.collision();
	this.levelUp();
	this.direction = '';
};

/*
 *@desc sets which direction key was pressed.
 *@params string key- direction name.			
 */
Player.prototype.handleInput = function(key) {
	this.direction = key;
};

/*
 *@desc checks whether the player is collided with the enemy or not.
 */
Player.prototype.collision = function() {
	var pX, pY, bX, bY;
	//player's current x and y coordinates.
	pX = this.x;
	pY = this.y;
	for (var i = 0; i < allEnemies.length; i++) {
		//enemy current x and y coordinates.
		bX = allEnemies[i].x;
		bY = allEnemies[i].y;
		if (pX < (bX + 101) && bX < (pX + 101) && pY < (bY + 70) && bY < (pY + 70)) {
			this.x = 101 * 2;
			this.y = 75 * 4;
		}
	}
};

/*
 *@desc increases the level if player reaches the water.
 */
Player.prototype.levelUp = function() {
	if (player.y <= 0) {
		Materialize.toast("Level Completed!", 1000, 'rounded');
		this.x = 101 * 2;
		this.y = 75 * 4;
		numLevel += 1;
		var enemy = new Enemy(0, enemyRandomPosition[Math.floor(Math.random() * 3)]);
		allEnemies.push(enemy);
		$('.level').text(numLevel);
		clock.reset();
	}
};

/*
 *@desc restarts the game from 1st level if 60 seconds have been passed.
 */
Player.prototype.gameOver = function() {
	var enemy = new Enemy(0, enemyRandomPosition[Math.floor(Math.random() * 3)]);
	allEnemies = [enemy];
	numLevel = 1;
	$('.level').text(numLevel);
	this.x = 101 * 2;
	this.y = 75 * 4;
	clock.reset();
};

/*
 *@desc this functional class will hold the functions for clock interactions.
 *example includes init(), reset(), tick(), show(), degToRad(), renderTime().		
 */
var Clock = function() {
	this.start_time = 59;
	this.name = "clock";
};

/*
 *@desc initialize the clock.	
 */
Clock.prototype.init = function() {
	this.reset();
	setInterval(this.name + '.tick()', 1000);
};

/*
 *@desc reset the clock.	
 */
Clock.prototype.reset = function() {
	this.seconds = this.start_time;
	this.renderTime();
};

/*
 *@desc decreases the clock time by 1 second.	
 */
Clock.prototype.tick = function() {
	if (this.seconds >= 0) {
		this.seconds--;
		if (this.seconds < 0) {
			alert("Game Over!");
			player.gameOver();
		} else if (this.seconds == 10) {
			Materialize.toast('Hurry! You are running out of time.', 2000, 'rounded');
		}
	}
	this.renderTime();
};

/*
 *@desc initial display of the clock when the player has not been selected.	
 */
Clock.prototype.show = function() {
	this.seconds = 0;
	this.renderTime();
};

/*
 *@desc convers degree to radians.	
 */
Clock.prototype.degToRad = function(degree) {
	var factor = (Math.PI) / 180;
	return degree * factor;
};

/*
 *@desc shows the clock on the canvas.	
 */
Clock.prototype.renderTime = function() {
	cx.fillStyle = '#566E7A';
	cx.fillRect(0, 0, 370, 170);
	cx.beginPath();
	cx.arc(170, 85, 70, this.degToRad(270), this.degToRad((this.seconds * 6) - 90));
	cx.stroke();
	cx.font = "28px Arial";
	cx.fillStyle = '#28d1fa';
	if (this.seconds < 10) {
		cx.fillText('0' + this.seconds, 156, 95);
	} else {
		cx.fillText(this.seconds, 156, 95);
	}
};

//Initializing the player, enemy and clock objects.
var enemy = new Enemy(0, enemyRandomPosition[Math.floor(Math.random() * 3)]);
var player;
var allEnemies = [enemy];
var clock = new Clock();

/*
 *@desc listens for click on the player.
 */
canvas.addEventListener('click', function(e) {
	var x = e.x - canvas.offsetLeft;
	var y = e.y - canvas.offsetTop - 54;
	if (y > 83 * 5 && y <= 83 * 6) {
		if (x > 101 && x <= 202) {
			flag = 1;
			player = new Player(101 * 2, 75 * 4, 'images/char-boy.png');
		} else if (x > 202 && x <= 303) {
			flag = 1;
			player = new Player(101 * 2, 75 * 4, 'images/char-cat-girl.png');
		} else if (x > 303 && x <= 404) {
			flag = 1;
			player = new Player(101 * 2, 75 * 4, 'images/char-horn-girl.png');
		}
	}
});

/*
 *@desc This listens for key presses and sends the keys to your Player.handleInput() method.
 */
document.addEventListener('keydown', function(e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
	if (flag) {
		player.handleInput(allowedKeys[e.keyCode]);
	}
});