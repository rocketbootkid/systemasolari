/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Main

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

// Make canvas size of window
context.canvas.width = window.innerWidth;
context.canvas.height = window.innerHeight;

// Runs things

var sunRadius = 50;

var numPlanets = 7;
var planetSize = 10;
var planetInitialBorder = 100;
var planetRadialGap = 5;
var planetOrbitGap = 150;
var planetOrbitIncrement = 20;

var numMoons = 3;
var moonSize = 3;
var moonLikelihood = 0.6; // 0 = Always, 1 = Never
var firstMoonRadius = 10;
var moonOrbitIncrement = 5;
var finalMoonRadius = 0;

var radiusLegend = 0;
var planetLegend = 0;

var center_x = window.innerWidth/2;
var center_y = window.innerHeight/2;
var myCircle = {
    x: center_x,
    y: center_y,
    radius: 50,
    sAngle: 0*Math.PI,
    eAngle: 2*Math.PI
}
var currentOrbitRadius = 100;
var radius = 0;
var legendAngle = 0; // Angle at which to draw axis labels

setup();

drawStar(myCircle, context);
drawPlanets(context, numPlanets);

// ******************************************************************************
//                              FUNCTIONS
// ******************************************************************************

function setup() {
    
    drawSpace();
    calculateRadiusLegendAngle();
    calculatePlanetLegendAngle();
    
}

function calculateRadiusLegendAngle() {
    legendAngle = Math.atan(center_y / center_x);    
}

function calculatePlanetLegendAngle() {
    
    
    
    
}

function drawSpace() {
    
    context.beginPath();
    context.rect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "black";
    context.fill(); 
}

function drawXAxis(firstPlanetRadius) {
    
    // Draw axis
    context.beginPath();
    context.strokeStyle = "#777";
    context.moveTo(0, center_y);
    context.lineTo(center_x - firstPlanetRadius, center_y);
    context.stroke(); 
    context.closePath();    
    
}

function drawStar() {
 
    // Draw actual star
    context.beginPath();
    context.arc(myCircle.x, myCircle.y, myCircle.radius, myCircle.sAngle, myCircle.eAngle);
    context.fillStyle = generateStarColor();
    context.strokeStyle = "black";
    context.stroke(); 
    context.fill();
    context.closePath();
    
}

function drawPlanets() {

    numOrbits = Math.ceil(Math.random() * numPlanets) + 5;    
    
    orbits = 0;

    while (orbits < numOrbits && currentOrbitRadius < center_x - planetOrbitGap) {

        current_radius = drawOrbit();
        
        details = drawPlanet(context, radius);
        
        drawPlanetLegend(radius, details[0]);
        drawOrbitLegend(radius);
        
        //drawPlanetRadial(radius, details); // Draws line from Star to Planet
        
        currentOrbitRadius = radius + details[0] + planetOrbitIncrement;
        
        orbits++;

    }

}

function drawOrbit() {

    radius = Math.ceil(Math.random() * planetOrbitGap) + currentOrbitRadius + finalMoonRadius;

    context.beginPath();
    context.arc(center_x, center_y, radius, 0*Math.PI, 2*Math.PI);
    context.strokeStyle = "#444";
    context.stroke();
    
    return radius;

}

function drawPlanet(context, radius) {

    size = Math.ceil((Math.random() * planetSize) + 5);
    ypos = 0;
    xpos = 0;
    
    while (ypos < planetInitialBorder || ypos > ((2*center_y) - planetInitialBorder) || xpos < planetInitialBorder || xpos > ((2*center_x) - planetInitialBorder)) {
        angle = ((Math.random() * 200)/100) * Math.PI;
        positions = generateCoords(angle, radius);
        xpos = center_x + positions[0];
        ypos = center_y + positions[1];
    }

    context.beginPath();
    context.arc(xpos, ypos, size, 0*Math.PI, 2*Math.PI);
    context.fillStyle = generateColor();
    context.strokeStyle = "#555";
    context.fill();
    context.stroke(); 

    drawMoons(size, xpos, ypos);

    return [size, angle];
    
}

function drawMoons(size, xpos, ypos) {
    
    // Determine if to draw any moons
    choice = Math.ceil(Math.random());
    
    if (choice > moonLikelihood) {
        // Determine how many to draw
        moons = Math.ceil(Math.random() * numMoons);
        currentMoonRadius = size + firstMoonRadius;

        if (moons > 0) {
            for (m = 0; m < moons; m++) {

                drawMoonOrbit(currentMoonRadius, xpos, ypos);

                drawMoon(currentMoonRadius, xpos, ypos);

                currentMoonRadius = currentMoonRadius + Math.ceil((Math.random() * moonOrbitIncrement) + 5);
            }
        }
    }
    
    finalMoonRadius = currentMoonRadius;
    
}

function drawMoonOrbit(radius, xpos, ypos) {
    
    context.beginPath();
    context.arc(xpos, ypos, radius, 0*Math.PI, 2*Math.PI);
    context.strokeStyle = "#777";
    context.stroke();    
    
}

function drawMoon(currentMoonRadius, xpos, ypos) {
    
    size = Math.ceil((Math.random() * moonSize)+1);
    moon_angle = ((Math.random() * 200)/100)*Math.PI;
    moon_x = xpos + (currentMoonRadius * Math.cos(moon_angle));
    moon_y = ypos + (currentMoonRadius * Math.sin(moon_angle));
    context.beginPath();
    context.arc(moon_x, moon_y, size, 0*Math.PI, 2*Math.PI);
    //context.fillStyle = generateColor();
    context.fillStyle = "white";
    //context.strokeStyle = "#555";
    context.fill()
    //context.stroke();     
    
}

function drawPlanetRadial(radius, details) {
    
    // Radius is the orbital position of the planet
    planetRadius = details[0];
    planetAngle = details[1];
    
    startCoords = generateCoords(planetAngle, sunRadius + planetRadialGap);
    endCoords = generateCoords(planetAngle, radius - planetRadius - planetRadialGap);
    
    // Draw vertical axis
    context.beginPath();
    context.strokeStyle = "#aaa";
    context.moveTo(startCoords[0] + center_x, startCoords[1] + center_y);
    context.lineTo(endCoords[0] + center_x, endCoords[1] + center_y);
    context.stroke();     
     
}

function generateCoords(angleRadians, orbitRadius) {

    // Converts provided angle and radius to x, y positions

    yposition = Math.sin(angleRadians) * orbitRadius;
    xposition = Math.cos(angleRadians) * orbitRadius;

    return [xposition, yposition];

}

function generateStarColor() {

    // Generates a random Hex color string

    color = "#ff";

    for (c = 0; c < 2; c++) {
        component = (Math.ceil(Math.random() * 255)).toString(16);
        color = color + component;  
    }

    return color;            

}

function generateColor() {

    // Generates a random Hex color string

    color = "#";

    for (c = 0; c < 3; c++) {
        component = (Math.ceil(Math.random() * 255)).toString(16);
        color = color + component;  
    }

    return color;

}

function drawOrbitLegend(radius) {

    // Calculate position along line 45deg up / right from centre
    //legend_x = Math.ceil((Math.cos(1.75*Math.PI) * radius) + (center_x) + 5);
    //legend_y = Math.ceil((Math.sin(1.75*Math.PI) * radius) + (center_y) + 5);
    //legend_x = center_x - radius;
    //legend_y = center_y + 12;
    legend_coords = generateCoords(legendAngle, radius);
    //window.alert(legend_x + "," + legend_y);

    context.beginPath();
    //context.translate(legend_x, legend_y);
    //context.rotate(0.25 * Math.PI);
    context.fillStyle = "white";
    context.font = "12px Verdana";
    context.textAlign = "right";
    context.fillText(radius, center_x - legend_coords[0] - 5, center_y - legend_coords[1]);
    context.stroke(); 
    //context.translate(0,0);

}

function drawPlanetLegend(radius, size) {
    
    planetName = generatePlanetName();
    //legend_x = center_x + 5;
    //legend_y = center_y - radius - 5;
    legend_coords = generateCoords(legendAngle, radius);
    
    context.beginPath();
    context.textAlign = "left";
    context.fillStyle = "white";
    context.font = "12px Verdana";
    context.fillText(planetName + "-" + size, center_x - legend_coords[0] + 10, center_y - legend_coords[1]);
    context.stroke();
    
}

function generatePlanetName() {
    
    syllables = Math.ceil(Math.random() * 3);
    planetName = "";

    for (s = 0; s <= syllables; s++) {

        consonant = "a";
        while (consonant == "a" || consonant == "e" || consonant == "i" || consonant == "o" || consonant == "u" || consonant == "x") {
            consonant = String.fromCharCode(Math.ceil((Math.random() * 25) + 97));
        }

        vowel = "x";
        while (vowel != "a" && vowel != "e" && vowel != "i" && vowel != "o" && vowel != "u") {
                vowel = String.fromCharCode(Math.ceil((Math.random() * 25) + 97));
        }

        planetName = planetName + consonant + vowel;
        consonant = "a";
        vowel = "x";

    }

    return planetName;
	
}
