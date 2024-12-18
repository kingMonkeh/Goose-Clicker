/*

TO DO

1. Add RESET Error Box (COMPLETE)
2. Round Geese (COMPLETE)
5/2. News Station (COMPLETE)
3. Add Artifacts
4. Make Game Look Better 
5. Stats
6. Plinko
7. Add goose click luckmaxx
8. Fries in the bag
9. Add commas to the numbers
...
inf. Learn React

*/

var gooses = 0;
var multiplier = 1;
var clickMultiplier = 1;
var gooseThisSecond = 0; //number of geese produced this second

//items = [[owned, price, produce], ...]
var items = [[0, 10, 1], [0, 100, 10], [0, 1019, 111], [0, 10000, 1010], [0, 1000000, 12345], [0, 10000000, 123456], [0, 100000000, 1234567], [0, 1000000000, 12345678], [0, 10000000000, 123456789]];
const origItems = [[0, 10, 1], [0, 100, 10], [0, 1019, 111], [0, 10000, 1010], [0, 1000000, 12345], [0, 10000000, 123456], [0, 100000000, 1234567], [0, 1000000000, 12345678], [0, 10000000000, 123456789]];

var artifacts = ["fertilizer", "betterSeeds", "goldenWheatStrain", "babylonianIrrigationSystem", "shinyCoating", "featherInsulation", "geeseScholarship", "gooseAngel", "superchargedPolarity", "cloningMachine", "click+", "click++", "click+++", "click++++", "click+++++", "petRock", "fourLeafClover", "magicScroll", "duck", "industrialRevolution", "kingGoose", "eggscalibur", "eagle", "babyGoose"];
var artifactsOwned = new Map();

//helper1: string -> [mainbox html, price html, owned html]
//let document.getElementById() = d.gEBI()
//helper1("grass") -> [d.gEBI("grass"), d.gEBI("grassRightTop", d.gEBI("grassRightBottom"), d.gEBI("grassLeft"), d.gEBI("grassImage")]
function helper1(item){
    return [document.getElementById(item), document.getElementById(item + "Price"), document.getElementById(item + "Owned"), document.getElementById(item + "Image")];
}

const htmlItems = [helper1("grass"), helper1("wheat"), helper1("gooseStatue"), helper1("gooseNest"), helper1("uwaterloo"), helper1("gooseTemple"), helper1("gooseMagnet"), helper1("gooseLab"), helper1("portal")];

//Initialize game, aka local save file
function init(){

    console.log("Working");

    //Init goose count
    if (localStorage.getItem("gooses") != null)
        gooses = parseInt(localStorage.getItem("gooses"));

    if (localStorage.getItem("multiplier") != null)
        multiplier = parseFloat(localStorage.getItem("multiplier"));

    if (localStorage.getItem("clickMultiplier") != null)
        clickMultiplier = parseFloat(localStorage.getItem("clickMultiplier"));

    for (let i = 0; i < items.length; i++){
        //Init items
        for (let j = 0; j < 3; j++){
            if (localStorage.getItem(i + "_" + j) != null){
                items[i][j] = parseInt(localStorage.getItem(i + "_" + j));
            }
        }
        //Update html text
        if (localStorage.getItem(i + "_" + 1) != null){
            htmlItems[i][1].innerHTML = "Price: " + localStorage.getItem(i + "_" + 1);
            htmlItems[i][2].innerHTML = "Owned: " + localStorage.getItem(i + "_" + 0);
        }
        
    }

    for (let i = 0; i < artifacts.length; i++){
        artifactsOwned.set(artifacts[i], localStorage.getItem(artifacts[i]));
    }

}

function reset(){

    localStorage.clear();
    gooses = 0;
    multiplier = 1;
    clickMultiplier = 1;
    artifactsOwned = new Map(); //make new map

    for (let i = 0; i < items.length; i++){
        items[i] = Array.from(origItems[i], (x) => x); //we are cloning array of arrays, we need to shallow copy each inner array
        //Update html text
        htmlItems[i][1].innerHTML = "Price: " + items[i][1];
        htmlItems[i][2].innerHTML = "Owned: " + items[i][0];
    }

    console.log("RESET");

}

const mainGoose = document.getElementById("mainGoose");
const gooseCount = document.getElementById("gooseCount");
const goosePerSecond = document.getElementById("goosePerSecond");

//On-click of goose, display geese gained
function createClickGain(gained, x, y){
    var clickGain = document.createElement("div");
    clickGain.innerHTML = "+" + gained;
    //Styling
    clickGain.style.pointerEvents = "none"; //Allows user to click through the div, not supported on old browsers
    clickGain.style.position = "absolute";
    clickGain.style.left = x.toString() + "px";
    clickGain.style.top = y.toString() + "px";
    clickGain.style.fontFamily = "sans-serif";
    clickGain.style.color = "rgb(89, 21, 9)";
    document.body.appendChild(clickGain); //Append to document body
    //Fading of text
    var opacity = 100; //Initial opacity
    var intervalID = setInterval(function(){
        opacity--;
        clickGain.style.opacity = opacity.toString() + "%";
        clickGain.style.top = (y--).toString() + "px";
        if (opacity == 0){
            clearInterval(intervalID);
        }
    }, 25);
}

//Click on goose event
mainGoose.addEventListener('click', function(event){
    gooses += 1 * multiplier * clickMultiplier;
    gooseThisSecond += 1 * multiplier * clickMultiplier;
    gooseCount.innerHTML = Math.round(gooses) + " Geese";
    createClickGain(1 * multiplier * clickMultiplier, event.x, event.y);
});

/////////////////////////////////////////////////////////////////
//EXTRAS/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

//Chipmunk click event
const chipmunk = document.getElementById("chipmunk");
chipmunk.addEventListener('click', function(){
    for (let i = 0; i < 3; i++){
        if (Math.random() >= 0.55) gooses *= 2;
        else gooses *= 0.5;
        console.log(gooses);
    }
});

//Prestige overlay activate
const prestigeOverlay = document.getElementById("prestigeOverlay");
const prestigeButton = document.getElementById("prestigeButton");
prestigeButton.addEventListener('click', function(){
    prestigeOverlay.style.visibility = "visible";
});

const prestigeNo = document.getElementById("prestigeNo");
prestigeNo.addEventListener('click', function(){
    prestigeOverlay.style.visibility = "hidden";
});

//Prestige
const prestigeYes = document.getElementById("prestigeYes");
prestigeYes.addEventListener('click', function(){
    var multiplierCopy = multiplier.valueOf();
    reset();
    multiplier = multiplierCopy.valueOf();
    prestigeOverlay.style.visibility = "hidden";
})

//Settings//

const settingsOverlay = document.getElementById("settingsOverlay");

//Open settings
const settingsButton = document.getElementById("settingsButton");
settingsButton.addEventListener('click', function(){
    settingsOverlay.style.visibility = "visible";
});

//Close settings
const settingsClose = document.getElementById("settingsClose");
settingsClose.addEventListener('click', function(){
    settingsOverlay.style.visibility = "hidden";
});

//Reset Button
const resetOverlay = document.getElementById("resetOverlay");
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener('click', function(){
    resetOverlay.style.visibility = "visible";
});

//Textbox
const twoFactor = document.getElementById("twoFactor");

const resetClose = document.getElementById("resetClose");
resetClose.addEventListener('click', function(){
    resetOverlay.style.visibility = "hidden";
});

//Reset Error Box
var opacity = 100;
const resetError = document.getElementById("resetError");
const resetConfirm = document.getElementById("resetConfirm");
resetConfirm.addEventListener('click', function(){
    //SUCCESSFUL
    if (twoFactor.value === "RESET"){
        reset();
        resetOverlay.style.visibility = "hidden";
        settingsOverlay.style.visibility = "hidden";
    }
    //If First Click
    else if (opacity == 100){
        opacity = 99;
        resetError.style.opacity = "100%";
        setTimeout(function(){
            var intervalID = setInterval(function(){
                opacity--;
                resetError.style.opacity = opacity + "%";
                if (opacity == 0){
                    clearInterval(intervalID);
                    opacity = 100;
                }
            }, 15);
        }, 1000);
    }
    //Already Clicked, Mid Fading
    else{
        resetError.style.opacity = "99%";
        opacity = 99;
    }
    twoFactor.value = "";
});

//Settings END//

//////////
//NEWS////
//////////

const news = document.getElementById(("news"));
var newsBank = ["After geese took over the world in 2069, geese have now become the main currency.", "Scientists say it may start raining geese!", "News: 420 geese have moved into the University of Waterloo today."]

setInterval(function(){
    news.innerHTML = newsBank[Math.floor(newsBank.length * Math.random())];
}, 15000);

//ITEMS//

for (let i = 0; i < htmlItems.length; i++){
    htmlItems[i][0].addEventListener('click', function(){
        //Check if you can buy
        if (gooses >= items[i][1]){
            items[i][0]++;
            gooses -= items[i][1];
        }
        //Update display
        htmlItems[i][1].innerHTML = "Price: " + items[i][1];
        htmlItems[i][2].innerHTML = "Owned: " + items[i][0];
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ARTIFACTS
//NOTE: Artifacts are too specialized and randomized to be condensed into a class
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function canBuy(price, name){
    var can = false;
    if (gooses >= price && artifactsOwned.get(name) != "true"){
        gooses -= price;
        artifactsOwned.set(name, "true");
        can = true;
    }
    return can;
}

function createArtifactPurchase(name, price, upgradeFunction){
    var artifactHTML = document.getElementById(name);
    artifactHTML.addEventListener('click', function(){
        if (canBuy(price, name)){
            upgradeFunction();
        }
    });
}

//Fertilizer
createArtifactPurchase("fertilizer", 1000, function(){
    items[0][2] *= 2;    
});

//Better Seeds
createArtifactPurchase("betterSeeds", 2500, function(){
    items[0][2] *= 2;
});

//Golden Wheat Strain
createArtifactPurchase("goldenWheatStrain", 5000, function(){
    items[1][2] *= 2;
});

//Babylonian Irrigation System
createArtifactPurchase("babylonianIrrigationSystem", 10000, function(){
    items[1][2] *= 2;
});

//shinyCoating
createArtifactPurchase("shinyCoating", 25000, function(){
    items[2][2] *= 2;
})

//Feather Insulation
createArtifactPurchase("featherInsulation", 100000, function(){
    items[3][2] *= 2;
});

///
///
///

//click+
createArtifactPurchase("click+", 100, function(){
    clickMultiplier *= 2;
});

//click++
createArtifactPurchase("click++", 1000, function(){
    clickMultiplier *= 2;
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ARTIFACTS END
/////////////////////////////////////////////////////////////////////////////////////////////////////////////


//This interval does 2 things:
//Add geese from items
//Count geese per second
setInterval(function(){

    for (let i = 0; i < items.length; i++){
        gooses += items[i][0] * items[i][2] * multiplier;
        gooseThisSecond += items[i][0] * items[i][2] * multiplier;
    }

    goosePerSecond.innerHTML = "Geese per second: " + gooseThisSecond;
    gooseThisSecond = 0;

    gooseCount.innerHTML = Math.round(gooses) + " Geese";
    
}, 1000);

//Autosave Feature
setInterval(function(){

    localStorage.setItem("gooses", gooses);
    localStorage.setItem("multiplier", multiplier);
    localStorage.setItem("clickMultiplier", clickMultiplier);

    for (let i = 0; i < items.length; i++){
        for (let j = 0; j < 3; j++){
            localStorage.setItem(i + "_" + j, items[i][j]);
        }
    }

    for (let [key, value] of artifactsOwned){
        localStorage.setItem(key, value);
    }

    console.log("Saved!");

}, 30000);