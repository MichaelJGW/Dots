
function dot(){
	this.stage = "egg";
	this.alive = true;
	this.lifeSpan = Math.floor(Math.random() * 500);
	this.birthRate = Math.floor(Math.random() * 250);
	this.age = 1;
	this.speed = Math.random();
	this.color = {amount:255,primary:Math.floor(Math.random()*9+1)};
	this.size = Math.random() * 6 + 1;
	this.growth = (Math.random() * 4 + 1)/10;
	this.locX = 0;
	this.locY = 0;
	this.goalX = Math.floor(Math.random() * canvasWidth);
	this.goalY = Math.floor(Math.random() * canvasHeight);
	this.changeMindRate = (Math.random() * 300)+40;
}
dot.prototype.giveBirth = function(){
	this.birthRate = this.age + Math.floor(Math.random() * this.birthRate*2);//change the birthRate a little each time it gives birth
	dotArray.push(new dot());//create the baby and add it to the Array
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
dot.prototype.draw = function(){
	var frame = drawFrame;
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
dot.prototype.move = function(){
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
dot.prototype.changeGoal = function(){
	this.goalX = Math.floor(Math.random() * canvasWidth);
	this.goalY = Math.floor(Math.random() * canvasHeight);
},
dot.prototype.lifeCycle = function(){
	this.age++;
	//This gets the color amount to minus from so it will start at 255 and over the lifeSpan go down to 0
	var colorFadeRate = 255 / (this.lifeSpan+(this.lifeSpan/10));  
	this.color.amount-=colorFadeRate;
	var percentOfAge = (this.age / this.lifeSpan)*100;
	//dead Dot
	if (percentOfAge > 100 && this.size !== 0){
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