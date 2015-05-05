
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
	dotArray.push(dot());
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
		var frame = document.getElementById("frame").getContext("2d");
		frame.fillStyle = "white";
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

//This is the class for the dots
function dot(){
	var dotObj = {
		stage : "egg",
		alive : true,
		lifeSpan : Math.floor(Math.random() * 500),
		birthRate : Math.floor(Math.random() * 250),
		age : 1,
		speed : Math.random(),
		color : {amount:255,primary:Math.floor(Math.random()*9+1)},
		size : Math.random() * 6 + 1,
		growth : (Math.random() * 4 + 1)/10,
		locX : 0,
		locY : 0,
		goalX : Math.floor(Math.random() * canvasWidth),
		goalY : Math.floor(Math.random() * canvasHeight),
		changeMindRate : (Math.random() * 300)+40,
		giveBirth : function(){
			this.birthRate = this.age + Math.floor(Math.random() * this.birthRate*2);//change the birthRate a little each time it gives birth
			dotArray.push(dot());//create the baby and add it to the Array
			var parent = this;
			var baby = dotArray[dotArray.length-1];
			baby.locX = parent.locX;
			baby.locY = parent.locY;
			//this is the baby taking on genes for the parent
			
			//create size and check if it is not out of control
			baby.size = (parent.size/2 * Math.random())+parent.size/10;
			if (baby.size < 1) baby.size = 1;
			else if (baby.size > maxSize) baby.size = maxSize;
			
			//create lifeSpan and check if it is not out of control
			baby.lifeSpan = parent.lifeSpan - 100 + Math.floor(Math.random() * 200)
			if (baby.lifeSpan < 1) baby.lifeSpan = 1;
			else if (baby.lifeSpan > 10000) baby.lifeSpan = 10000;
			
			//this is only 1 out of 10 can pick a random color the others follow their parents
			if(Math.floor(Math.random()*10+1) != 1){
				baby.color.primary = parent.color.primary;
			}
		},
		//This is the draw function for this object
		draw : function(){
			var frame = document.getElementById('frame').getContext('2d');
			frame.beginPath();
			frame.arc(this.locX,this.locY,this.size,0,2*Math.PI);
			
			//this sees if the dot is an egg and if not what color it is
			frame.fillStyle="rgba(200,200,200,0.75)"; // white egg dot	
			if(this.stage==="egg"){
				frame.fillStyle="rgba(200,200,200,0.75)"; // white egg dot	
			}
			else if(onlyOneColor === true){
				frame.fillStyle="rgba(" + 0 + "," + Math.floor(this.color.amount) + "," + 0 + "," + "0.75)"; // green
			}
			else{
				//This gets the colors into a Primart secondary and and Third Color
				//We do this so we only have to do the calculations once
				var color = Math.floor(this.color.amount);
				var colorSec = Math.floor(this.color.amount/2);
				var colorThr = Math.floor(colorSec + color/2);
				var alpha = (this.size-50)*-1/100;
				alpha = (alpha < 0.2 || this.size > 50) ? 0.2 : (alpha > 1) ? 1 : alpha;
				//final color checks
				color = (color > 255) ? 255 : (color < 0) ? 0 : color;
				colorSec = (colorSec > 255) ? 255 : (colorSec < 0) ? 0 : colorSec;
				colorThr = (colorThr > 255) ? 255 : (colorThr < 0) ? 0 : colorThr;
				
				//The color picker
				switch(this.color.primary){
					case 1 : 
						frame.fillStyle="rgba(" + colorSec + "," + color + "," + colorSec + "," + alpha + ")"; // green
						break;
					case 2 : 
						frame.fillStyle="rgba(" + color + "," + colorSec + "," + colorSec + "," + alpha + ")"; //red
						break;
					case 3 :
						frame.fillStyle="rgba(" + colorSec +","+ colorSec + ","+ color + "," + alpha + ")"; // blue
						break;
					case 4 :
						frame.fillStyle="rgba(" + colorThr + ","+ colorThr + "," + colorSec + "," + alpha + ")";
						break;
					case 5 :
						frame.fillStyle="rgba(" + colorThr + ","+ colorSec + "," + colorThr + "," + alpha + ")";
						break;
					case 6 :
						frame.fillStyle="rgba(" + colorThr + ","+ colorSec + "," + color + "," + alpha + ")";
						break;
					case 7 :
						frame.fillStyle="rgba(" + colorSec + ","+ color + "," + colorThr + "," + alpha + ")";
						break;
					case 8 :
						frame.fillStyle="rgba(" + color + ","+ colorThr + "," + colorSec + "," + alpha + ")";
						break;
					case 9 :
						frame.fillStyle="rgba(" + color + ","+ colorSec + "," + colorThr + "," + alpha + ")";
						break;
				}
			}
			frame.fill();
		},
		//The Object's move method
		move : function(){
			if(pause === false){ 
				//the move method is called every frame so it needs also do it's lifeCycle
				this.lifeCycle();
				//If it is an egg it wont move
				if(this.stage !== "egg"){
					/*
						The Idea here is to get the difference from the goal x and y from  the dots location x and y.
						Once you get the radio of how much x to how much y you can move that distance with the factor of the speed.
					*/
					var changeGoal = true;
					var xdif = this.locX - this.goalX;
					var ydif = this.locY - this.goalY;
					if(xdif < 0) {xdif *= -1;}
					if(ydif < 0) {ydif *= -1;}
					var xper,yper;
					if (xdif < ydif){
						xper = xdif/ydif;
						if(xper === Infinity){xper = 0;}						
						yper = 1 - xper;
					}
					else{
						yper = ydif/xdif;
						if(yper === Infinity){yper = 0;}		
						xper = 1 - yper;
					}
					var xspeed = (this.speed*maxSpeedFactor/5) * xper;
					var yspeed = (this.speed*maxSpeedFactor/5) * yper;
					
					//Now we have the radio and speed done we can add it to the location of the dot
					//Before we add to the location we need to see if it is in to close to the goal.
					//If both X and Y are to close we need a new goal.
					if(this.locX+ xspeed < this.goalX){
						this.locX+=(xspeed);
						changeGoal = false;
					}
					else if(this.locX - xspeed > this.goalX){
						this.locX-=(xspeed);
						changeGoal = false;
					}
					else{changeGoal = true;}
					if(this.locY + yspeed < this.goalY){
						this.locY+=(yspeed);
						changeGoal = false;
					}
					else if(this.locY - yspeed > this.goalY){
						this.locY-=(yspeed);
						changeGoal = false;
					}
					//checks to see if the dot changes its mind.
					if(Math.floor(Math.random() * this.changeMindRate) === 1){changeGoal = true;}
					//change the goal
					if(changeGoal === true){this.changeGoal();}
				}
			}
			this.draw();
		},
		//Changing the Goal
		changeGoal : function(){
			this.goalX = Math.floor(Math.random() * canvasWidth);
			this.goalY = Math.floor(Math.random() * canvasHeight);
		},
		lifeCycle : function(){
			this.age++;
			//This gets the color amount to minus from so it will start at 255 and over the lifeSpan go down to 0
			var colorFadeRate = 255 / (this.lifeSpan+(this.lifeSpan/10));  
			this.color.amount-=colorFadeRate;
			var percentOfAge = (this.age / this.lifeSpan)*100;
			//dead Dot
			if (percentOfAge > 100 && this.size != 0){
				this.alive = false;
				this.speed = 0;
				this.size = this.size-0.2; 
				if (this.size < 0){
					this.size = 0;
				}
			}
			else if(percentOfAge > 20){
				this.stage = "adult";
			}
			//egg
			else if(percentOfAge > 5){
				if(this.color.amount < 255){
					this.color.amount = 255;
				}
				this.size = this.size+this.growth/2;
				this.stage = "teen";
			}
			else{
				this.stage = "egg";
			}
			//Check If able to give birth
			if(this.age >= this.birthRate && this.stage==="adult" && this.alive === true && birth === true && dotArray.length<max_amount){
				this.giveBirth();
			}
		}
	};
	return dotObj;
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
