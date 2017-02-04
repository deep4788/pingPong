//Canvas and canvas-context variables
var canvas;
var canvasCtx;

//Ball initial position and X and Y speeds
var ballXpos = 25;
var ballYpos = 25;
var ballXSpeed = 10;
var ballYSpeed = 4;

//Players score
var player1Score = 0;
var player2Score = 0;
const scoreNeededToWin = 5;

//Ping Pong paddles
var paddle1Ypos = 250;
var paddle2Ypos = 250;
const paddleWidth = 10;
const paddleHeight = 100;

//Game over screen
var gameOverScreen = false;

//Resets the ball position and speed direction
function resetBall() {
	if(player1Score >= scoreNeededToWin || player2Score >= scoreNeededToWin) {
		gameOverScreen = true;
	}

    //Center the ball and change the direction of the ball
	ballXSpeed = -ballXSpeed;
	ballXpos = canvas.width/2;
	ballYpos = canvas.height/2;
}

//Moves player 2 paddle, which is a computer
function movePlayer2() {
	var paddle2YposCenter = paddle2Ypos + (paddleHeight/2);

    //Move paddle down if paddle is above the ball by a vertical difference of 20
    if(paddle2YposCenter < ballYpos - 20) {
        paddle2Ypos = paddle2Ypos + 10;
    }

    //Move paddle up if paddle is below the ball by a vertical difference of 20
    else if(paddle2YposCenter > ballYpos + 20) {
        paddle2Ypos = paddle2Ypos - 10;
    }
}

//Draws the vertical net
function drawNet() {
    //Top net holder
    drawRect(canvas.width/2-1, 0, 4, 20, "black");
    drawRect(canvas.width/2-2, 0, 4, 20, "black");
    drawRect(canvas.width/2-3, 0, 4, 20, "black");
    drawRect(canvas.width/2-4, 0, 4, 20, "black");
    drawRect(canvas.width/2-5, 0, 4, 20, "black");
    drawRect(canvas.width/2-6, 0, 4, 20, "black");

    //Bottom net holder
    drawRect(canvas.width/2-1, canvas.height-20, 4, 20, "black");
    drawRect(canvas.width/2-2, canvas.height-20, 4, 20, "black");
    drawRect(canvas.width/2-3, canvas.height-20, 4, 20, "black");
    drawRect(canvas.width/2-4, canvas.height-20, 4, 20, "black");
    drawRect(canvas.width/2-5, canvas.height-20, 4, 20, "black");
    drawRect(canvas.width/2-6, canvas.height-20, 4, 20, "black");

    //The actual net
    for(var i = 10; i < canvas.height; i += 40) {
        drawRect(canvas.width/2-1, i, 2, 20, "white");
        drawRect(canvas.width/2-4, i, 2, 20, "white");
    }
}

//This function draws the horizontal divider
function drawDivider() {
    drawRect(0, canvas.height/2-1, canvas.width, 2, "white");
    drawRect(0, canvas.height/2-2, canvas.width, 2, "white");
    drawRect(0, canvas.height/2-3, canvas.width, 2, "white");
}

//Moves paddles and ball
function moveAllPieces() {
	if(gameOverScreen) {
		return;
	}

    //Move player 2 paddle
	movePlayer2();

    //Set new position for the ball
	ballXpos = ballXpos + ballXSpeed;
	ballYpos = ballYpos + ballYSpeed;

    if(ballXpos < 15) {
        if(ballYpos > paddle1Ypos && ballYpos < (paddle1Ypos + paddleHeight)) {
            ballXSpeed = -ballXSpeed;

            var deltaY = ballYpos - (paddle1Ypos + paddleHeight/2);
            ballYSpeed = deltaY * 0.35;
        }
        else {
            //Player 1 missed hitting the ball
            player2Score++;
            resetBall();
        }
    }
    if(ballXpos > (canvas.width - 15)) {
        if(ballYpos > paddle2Ypos && ballYpos < (paddle2Ypos + paddleHeight)) {
            ballXSpeed = -ballXSpeed;

            var deltaY = ballYpos - (paddle2Ypos + paddleHeight/2);
            ballYSpeed = deltaY * 0.35;
        }
        else {
            //Player 2 missed hitting the ball
            player1Score++;
            resetBall();
        }
    }
    if(ballYpos < 0) {
        ballYSpeed = -ballYSpeed;
    }
    if(ballYpos > canvas.height) {
        ballYSpeed = -ballYSpeed;
    }
}

//This function draw all the items on the canvas
function drawAllPieces() {
    //Draw the canvas
	drawRect(0, 0, canvas.width, canvas.height, "#2f6a3c");

    //If game is over, draw game over screen
    if(gameOverScreen) {
        canvasCtx.fillStyle = "white";
        canvasCtx.font = "30px Arial";

        if(player1Score >= scoreNeededToWin) {
            canvasCtx.fillText("Player #1 Won", 300, 300);
        }
        else if(player2Score >= scoreNeededToWin) {
            canvasCtx.fillText("Player #2 Won", 300, 300);
        }

        canvasCtx.font = "20px Arial";
        canvasCtx.fillText("click to continue", 335, 500);
        return;
    }

	//Draw net
	drawNet();

	//Draw horizontal divider
    drawDivider();

	//Draw left paddle
	drawRect(0, paddle1Ypos, paddleWidth, paddleHeight, "brown");

	//Draw right paddle
	drawRect(canvas.width-paddleWidth, paddle2Ypos, paddleWidth, paddleHeight, "brown");

	//Draw ball
	drawCircle(ballXpos, ballYpos, 10, "#FF8C00");

    //Show player scores
    canvasCtx.font = "10px Arial";
	canvasCtx.fillStyle = "white";
	canvasCtx.fillText("P1: " + player1Score, 10, 10);
	canvasCtx.fillText("P2: " + player2Score, canvas.width-30, 10);
}

function drawCircle(centerX, centerY, radius, color) {
	canvasCtx.fillStyle = color;
	canvasCtx.beginPath();
	canvasCtx.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasCtx.fill();
}

function drawRect(x, y, width, height, color) {
	canvasCtx.fillStyle = color;
	canvasCtx.fillRect(x, y, width, height);
}

//Magic starts here
document.addEventListener("DOMContentLoaded", function(event) {
    canvas = document.getElementById("gameCanvas");
    canvasCtx = canvas.getContext("2d");

    //Frames for smoother animation
	var framesPerSec = 24;
    setInterval(function() {
        moveAllPieces();
        drawAllPieces();
    }, 1000/framesPerSec);

    //Add mouse events to canvas
	canvas.addEventListener("mousedown", function() {
        if(gameOverScreen) {
            player1Score = 0;
            player2Score = 0;
            gameOverScreen = false;
        }
    });
    canvas.addEventListener("mousemove", function(event) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseYpos = event.clientY - rect.top - root.scrollTop;
        paddle1Ypos = mouseYpos - (paddleHeight/2);
    });
});
