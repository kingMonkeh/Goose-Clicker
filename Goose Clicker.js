var gooses = 0;
var gooseThisSecond = 0; //number of geese produced this second

//items = [[owned, price, produce], ...]
const items = [[0, 10, 1], [0, 100, 10], [0, 1000000, 12345]];

function init(){
    for (let i = 0; i < items.length; i++){
        for (let j = 0; j < 3; j++){
            if (localStorage.getItem(i + "_" + j) != null){
                items[i][j] = localStorage.getItem(i + "_" + j);
            }
        }
    }
}

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
    if (gooses >= items[0][1]){
        items[0][0]++;
        gooses -= items[0][1];
    }
    //Update display
    grassRightTop.innerHTML = "Price: " + items[0][1];
    grassRightBottom.innerHTML = "Owned: " + items[0][0];
});

//Buy wheat
wheat.addEventListener('click', function(){
    if (gooses >= items[1][1]){
        items[1][0]++;
        gooses -= items[1][1];
    }
    wheatRightTop.innerHTML = "Price: " + items[1][1];
    wheatRightBottom.innerHTML = "Owned: " + items[1][0];
});

//Buy uwaterloo campus
uwaterloo.addEventListener('click', function(){
    if (gooses >= items[2][1]){
        items[2][0]++;
        gooses -= items[2][1];
    }
    //update display
    uwaterlooRightTop.innerHTML = "Price: " + items[2][1];
    uwaterlooRightBottom.innerHTML = "Owned: " + items[2][0];
});

//This interval does 2 things:
//Add geese from items
//Count geese per second
setInterval(function(){

    for (let i = 0; i < items.length; i++){
        gooses += items[i][0] * items[i][2];
        gooseThisSecond += items[i][0] * items[i][2];
    }

    goosePerSecond.innerHTML = "Geese per second: " + gooseThisSecond;
    gooseThisSecond = 0;

    gooseCount.innerHTML = gooses + " Geese";
    
}, 1000);

setInterval(function(){

    for (let i = 0; i < items.length; i++){
        for (let j = 0; j < 3; j++){
            localStorage.setItem(i + "_" + j, items[i][j]);
        }
    }

    console.log("Saved!");

}, 30000);