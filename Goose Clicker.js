var gooses = 0;
var gooseThisSecond = 0; //number of geese produced this second

const owned = [0, 0, 0];
const price = [10, 1000000, 100];
const produce = [1, 12345, 10];

const mainGoose = document.getElementById("mainGoose");
const gooseCount = document.getElementById("gooseCount");
const goosePerSecond = document.getElementById("goosePerSecond");
/////////////////////////////////////////////////////////////////
const grass = document.getElementById("grass");
const grassRightTop = document.getElementById("grassRightTop");
const grassRightBottom = document.getElementById("grassRightBottom");
/////////////////////////////////////////////////////////////////
const wheat = document.getElementById("wheat");
const wheatRightTop = document.getElementById("wheatRightTop");
const wheatRightBottom = document.getElementById("wheatRightBottom");
/////////////////////////////////////////////////////////////////
const uwaterloo = document.getElementById("uwaterloo");
const uwaterlooRightTop = document.getElementById("uwaterlooRightTop");
const uwaterlooRightBottom = document.getElementById("uwaterlooRightBottom");

/////////////////////////////////////////////////////////////////
//EXTRAS/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

const chipmunk = document.getElementById("chipmunk");

chipmunk.addEventListener('click', function(){
    for (let i = 0; i < 3; i++){
        if (Math.random() >= 0.54) gooses *= 2;
        else gooses *= 0.5;
        console.log(gooses);
    }
});

//Click on goose event
mainGoose.addEventListener('click', function(){
    gooses++;
    gooseThisSecond++;
    gooseCount.innerHTML = gooses + " Geese";
});

//Buy grass
grass.addEventListener('click', function(){
    //Check if you can buy
    if (gooses >= price[0]){
        owned[0]++;
        gooses -= price[0];
    }
    //Update display
    grassRightTop.innerHTML = "Price: " + price[0];
    grassRightBottom.innerHTML = "Owned: " + owned[0];
});

//Buy wheat
wheat.addEventListener('click', function(){
    if (gooses >= price[2]){
        owned[2]++;
        gooses -= price[2];
    }
    wheatRightTop.innerHTML = "Price: " + price[2];
    wheatRightBottom.innerHTML = "Owned: " + owned[2];
});

//Buy uwaterloo campus
uwaterloo.addEventListener('click', function(){
    if (gooses >= price[1]){
        owned[1]++;
        gooses -= price[1];
    }
    //update display
    uwaterlooRightTop.innerHTML = "Price: " + price[1];
    uwaterlooRightBottom.innerHTML = "Owned: " + owned[1];
});

//This interval does 2 things:
//Add geese from items
//Count geese per second
setInterval(function(){

    for (let i = 0; i < owned.length; i++){
        gooses += owned[i] * produce[i];
        gooseThisSecond += owned[i] * produce[i];
    }

    goosePerSecond.innerHTML = "Geese per second: " + gooseThisSecond;
    gooseThisSecond = 0;

    gooseCount.innerHTML = gooses + " Geese";
    
}, 1000);