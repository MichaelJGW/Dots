
var dotArray; // holds the dot objects
var canvasHeight;
var canvasWidth;
var pause = false;
var birth = true; // if true dots can give birth
var max_amount = 500; // max amount of dots at once if it goes over this they can't give birth
var optionsVisible = false; // if the option menu is visible
var onlyOneColor = false; // toggle if only one color is allowed
var maxSize = 750; // max size at birth they grow to be bigger then this
var maxSpeedFactor = 15;
var enableMenuTimeoutDefault = 70; // time limit until the "press h to show menu" is gone
var enableMenuTimeout = enableMenuTimeoutDefault; // This is the timer count for the menu. It counts down so it equals he default value when starting.
var FrameRateCount = 0; // This is for FPS.
var FPS = "Not Yet Calculated";
var intro = true;
var intro_counter = 120;
var intro_alpha = 0.0;
var intro_alpha_plus = true;
var drawFrame = document.getElementById('frame').getContext('2d');

//-----------------------
// Starts when the window is ready.
// This will initialize the starting values.
// This is only called once so it is anonymous.  
//-----------------------

window.onload = function (){
	//This gets the canvas size;
	resize();	
	//add listeners both keyboard and mouse
	addListeners();
	//create the first dot
	createFirstLife();
	//set the intervals to the refresh frame and the FPS ticker
	setInterval(draw,32);
	setInterval(frameRateTick,1000);
}
var resize = function (){
	document.getElementById("frame").height = window.innerHeight-5;
	document.getElementById("frame").width = window.innerWidth-5;
	canvasHeight = document.getElementById("frame").height;
	canvasWidth = document.getElementById("frame").width;	
}
//-----------------------
// This Creates the first Dot it is called it the Dots are reset
//-----------------------
function createFirstLife(){
	dotArray = []; 
	dotArray.push(new dot());
	//looks better if the first dot starts in the center.
	dotArray[0].locX = canvasWidth/2;
	dotArray[0].locY = canvasHeight/2;
	//this helps with them dying off to soon
	dotArray[0].lifeSpan = (dotArray[0].lifeSpan < 400) ? 400 : dotArray[0].lifeSpan;
	dotArray[0].birthRate = (dotArray[0].birthRate < 150) ? 150 : dotArray[0].birthRate;
}
//-----------------------
// This is the FPS Counter
//-----------------------
function frameRateTick(){
	FPS = FrameRateCount;
	FrameRateCount = 0;
}
//-----------------------
// This draws the whole canvas
//-----------------------
function draw(){
		FrameRateCount++;//each frame add one to the FPS counter
		//this draws the menu options on the screen
		var frame = drawFrame;
		frame.clearRect(0,0,canvasWidth,canvasHeight); // clear canvas
		function addText(xStarting, yStarting,lineDropAmount){
			var posY = yStarting;//space from the top of the screen.
			//parses the arguments and prints a line for each one and give it the correct spacing
			for(var counter=3; counter < arguments.length; counter++){
				frame.fillText(arguments[counter],xStarting,posY);
				posY+=lineDropAmount;//amount of space between each line
			}
		}
		//Do The Intro
		if(intro === true){	
			if(intro_alpha_plus){
				intro_alpha += 0.02;
				if(intro_alpha > 1){
					intro_alpha = 1;
					intro_alpha_plus = false;
				}
			}
			else{
				intro_alpha -= 0.02;
				if(intro_alpha < 0){intro_alpha = 0;}
			}
			frame.fillStyle = "rgba(255,255,255," + intro_alpha + ")";
			intro_counter--;
			if (intro_counter === 0) intro = false;
			frame.font = "bold 42px Arial";
			addText(canvasWidth/2-20, canvasHeight/2,0,"Dots");
		}
		//Non Intro
		else{
			//this creates the dots
			for(var counter = 0; counter < dotArray.length; counter++){
				dotArray[counter].move();
				//clean up the dead dots
				if(dotArray[counter].size === 0 && dotArray.length > 0 && dotArray.length !== counter){
					dotArray = [].concat(dotArray.slice(0,counter),dotArray.slice(counter+1,dotArray.length));
					counter--;
				}
			}
			frame.fillStyle = "white";
			frame.font = "bold 12px Arial";
			if(optionsVisible === true){
				//Draw the full menu
				enableMenuTimeout = enableMenuTimeoutDefault;
				addText(
						10,30,20,
						"--ABOUT DOTS--",
						"This application is best viewed in fullscreen mode (f11).",
						"This application creates a single, random dot that recursively gives birth to other dots.",
						"Dots are random. When they are born they are randomly assigned a speed, size, lifespan, birthrate, etc.",
						"Dots inherit some genes from their parent.",
						"Dots are goal oriented and always move to their current goal; once it gets their, it finds a new goal.",
						"Dots do change their minds, so in the middle of any goal they might randomly change their goal.",
						"In some cases they all naturally die off, if this happens press R.",
						"",
						"--INFORMATION--",
						"FPS = "+FPS,
						"Amount of Dots = " + dotArray.length,
						"Max Amount of Dots = " + max_amount,
						"Max Speed Factor = " + maxSpeedFactor,
						"Max Size at Birth = " + maxSize,
						"",
						"--OPTIONS--",
						"(H) Hide this menu",
						"(R) Reset all Dots",
						(birth) ?  "(Q) Dots unable to give birth." :  "(Q) Dots can give birth.",
						(onlyOneColor) ? "(W) Change all Dots to Natural color" : "(W) Change all Dots color to green.",
						"     This is nice to see the ageing process.",
						"(A) Increase Max Amount of Dots",
						"(Z) Decrease Max Amount of Dots",
						"(S) Increase Max Speed Factor of Dots",
						"(X) Decrease Max Speed Factor of Dots",
						"(D) Increase Max Size at Birth",
						"(C) Decrease Max Size at Birth",
						"(Click) Set a global goal.",
						(pause) ? "(Space) Resume" : "(Space) Pause"
				);
			}
			else{
				//draw the "show menu" if the timer allows it
				if(enableMenuTimeout > 0){
					addText(10,30,20,"Press H to show menu.");
					enableMenuTimeout--;
				}
			}
		}
}

//This is for the Click Event
function clickCanvas(event){
	for(var counter = 0; counter < dotArray.length; counter++){
		dotArray[counter].goalX = event.x;
		dotArray[counter].goalY = event.y;
	}
}

function addListeners(){
	document.getElementById("frame").addEventListener('click', clickCanvas);
	document.addEventListener('keydown', function(event) {
		switch (event.keyCode){
			case 32 : // spacebar pauses
				pause = (pause === false) ? true : false;
				break;
			case 65 : // A
				//increases the max amount
				max_amount+=10;
				break;
			case 67 : // C 
				//decrease the max size
				maxSize = (maxSize > 1) ? maxSize-1 : 1;
				break;
			case 68 : // D 
				//increase the max size 
				maxSize++;
				break;
			case 69 : // E 
				break;
			case 72 : // H 
				//toggles option menu
				optionsVisible = (optionsVisible === false) ? true : false;
				break;
			case 81 : // Q
				//toggle the ability to give birth
				birth = (birth === false) ? true : false;
				break;
			case 82 : // R
				//it will reset the board
				createFirstLife();
				break;
			case 83 : // S 
				maxSpeedFactor++;
				break;
			case 87 : // W
				//toggles all in one color
				onlyOneColor = (onlyOneColor === false) ? true : false;
				break; 
			case 88 : // X
				maxSpeedFactor = (maxSpeedFactor > 0) ? maxSpeedFactor-1 : 0;
				break; 
			case 90 : // Z
				//Decreases the max amount
				max_amount = (max_amount > 1) ? max_amount-10 : max_amount;
				break; 

		}
	}, false);
}
