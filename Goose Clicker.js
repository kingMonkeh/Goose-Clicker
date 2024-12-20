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
var clickExponent = 1;
var gooseThisSecond = 0; //number of geese produced this second

//items = [[owned, price, produce], ...]
var items = [[0, 10, 1], [0, 100, 10], [0, 1019, 111], [0, 10000, 1010], [0, 1000000, 12345], [0, 10000000, 123456], [0, 100000000, 1234567], [0, 1000000000, 12345678], [0, 10000000000, 123456789]];
const origItems = [[0, 10, 1], [0, 100, 10], [0, 1019, 111], [0, 10000, 1010], [0, 1000000, 12345], [0, 10000000, 123456], [0, 100000000, 1234567], [0, 1000000000, 12345678], [0, 10000000000, 123456789]];

var artifacts = ["fertilizer", "betterSeeds", "goldenWheatStrain", "babylonianIrrigationSystem", "shinyCoating", "featherInsulation", "geeseScholarship", "gooseAngel", "superchargedPolarity", "cloningMachine", "click+", "click++", "click+++", "click++++", "click+++++", "petRock", "fourLeafClover", "magicScroll", "duck", "industrialRevolution", "kingGoose", "eggscalibur", "eagle", "babyGoose", "prestigeButton"];
var artifactPrice = [1000, 2500, 5000, 10000, 25000, 100000, 1000000, 77777777, 500000000, 3000000000, 100, 1000, 10000, 100000, 1000000, 100, 8888, 11235813213, 1, 12345678910, 99999999999, 99999999999, 9999999999, 9999999999, 999999999999999];
var artifactsOwned = new Map();

//helper1: string -> [mainbox html, price html, owned html]
//let document.getElementById() = d.gEBI()
//helper1("grass") -> [d.gEBI("grass"), d.gEBI("grassPrice", d.gEBI("grassOwned"), d.gEBI("grassImage"), itemMask]
function helper1(item){
    return [document.getElementById(item), document.getElementById(item + "Price"), document.getElementById(item + "Owned"), document.getElementById(item + "Image"), document.getElementById(item).firstElementChild];
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

    if (localStorage.getItem("clickExponent") != null)
        clickExponent = parseFloat(localStorage.getItem("clickExponent"));

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
    clickExponent = 1;
    artifactsOwned = new Map(); //make new map

    for (let i = 0; i < items.length; i++){
        items[i] = Array.from(origItems[i], (x) => x); //we are cloning array of arrays, we need to shallow copy each inner array
        //Update html text
        htmlItems[i][1].innerHTML = "Price: " + items[i][1];
        htmlItems[i][2].innerHTML = "Owned: " + items[i][0];
    }

    console.log("RESET");

}

function kingGooseEggscalibur(){
    if (artifactsOwned.get("kingGoose") == 'true' && artifactsOwned.get("eggscalibur") == 'true'){
        return 2;
    }
    return 1;
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
    clickGain.style.fontFamily = "'VT323', sans-serif";
    clickGain.style.color = "rgb(89, 21, 9)";
    document.body.appendChild(clickGain); //Append to document body
    //Fading of text
    var opacity = 100; //Initial opacity
    var intervalID = setInterval(function(){
        opacity -= 2;
        clickGain.style.opacity = opacity.toString() + "%";
        clickGain.style.top = (y--).toString() + "px";
        if (opacity == 0){
            clearInterval(intervalID);
            clickGain.remove();
        }
    }, 25);
}

//Click on goose event
mainGoose.addEventListener('click', function(event){
    var gain = Math.pow(1 * multiplier * clickMultiplier * kingGooseEggscalibur(), clickExponent);
    //Four leaf clover effect
    if (artifactsOwned.get("fourLeafClover") == 'true'){
        if (Math.random() < 0.088){
            gain *= 8;
        }
    }
    var displayGain = Math.round(gain.valueOf());
    gooses += gain;
    gooseThisSecond += displayGain;
    createClickGain(displayGain, event.x, event.y);
    //Draw sword pattern if we own eggscalibur
    if (artifactsOwned.get("eggscalibur") == 'true'){
        gooses += gain * 8;
        gooseThisSecond += gain * 8;
        createClickGain(displayGain, event.x - 10, event.y);
        createClickGain(displayGain, event.x + 10, event.y);
        createClickGain(displayGain, event.x, event.y + 10);
        createClickGain(displayGain, event.x, event.y + 20);
        createClickGain(displayGain, event.x, event.y - 10);
        createClickGain(displayGain, event.x, event.y - 20);
        createClickGain(displayGain, event.x, event.y - 30);
        createClickGain(displayGain, event.x, event.y - 40);
    }
    gooseCount.innerHTML = Math.round(gooses) + " Geese";
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

////////////////////////////////////////////////////////////////////
//Settings//////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////
//Patch Notes/////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//Close patch notes when X button is clicked
document.getElementById("patchNotesClose").addEventListener('click', function(){
    document.getElementById("patchNotesOverlay").style.visibility = "hidden";
});

//////////
//NEWS////
//////////

const news = document.getElementById(("news"));
var newsBank = ["After geese took over the world in 2069, geese have now become the main currency.", "Scientists say it may start raining geese!", "News: 420 geese have moved into the University of Waterloo today."]

setInterval(function(){
    news.innerHTML = newsBank[Math.floor(newsBank.length * Math.random())];
}, 15000);

/////////////////////////////////////////////////////////////////////////////
//ITEMS//////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

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
createArtifactPurchase("fertilizer", artifactPrice[0], function(){
    items[0][2] *= 2;    
});

//Better Seeds
createArtifactPurchase("betterSeeds", artifactPrice[1], function(){
    items[0][2] *= 2;
});

//Golden Wheat Strain
createArtifactPurchase("goldenWheatStrain", artifactPrice[2], function(){
    items[1][2] *= 2;
});

//Babylonian Irrigation System
createArtifactPurchase("babylonianIrrigationSystem", artifactPrice[3], function(){
    items[1][2] *= 2;
});

//shinyCoating
createArtifactPurchase("shinyCoating", artifactPrice[4], function(){
    items[2][2] *= 2;
})

//Feather Insulation
createArtifactPurchase("featherInsulation", artifactPrice[5], function(){
    items[3][2] *= 2;
});

//Geese Scholarship
createArtifactPurchase("geeseScholarship", artifactPrice[6], function(){
    items[4][2] *= 2;
});

//Goose Angel
createArtifactPurchase("gooseAngel", artifactPrice[7], function(){
    items[5][2] *= 2;
    clickMultiplier *= 7;
});

//Supercharged Polarity
createArtifactPurchase("superchargedPolarity", artifactPrice[8], function(){
    items[6][2] *= 2;
});

//Cloning Machine
createArtifactPurchase("cloningMachine", artifactPrice[9], function(){
    items[7][2] *= 2;
});

///
///
///

//click+
createArtifactPurchase("click+", artifactPrice[10], function(){
    clickMultiplier *= 2;
});

//click++
createArtifactPurchase("click++", artifactPrice[11], function(){
    clickMultiplier *= 2;
});

//click+++
createArtifactPurchase("click+++", artifactPrice[12], function(){
    clickMultiplier *= 4;
});

//click++++
createArtifactPurchase("click++++", artifactPrice[13], function(){
    clickMultiplier *= 8;
});

//click+++++
//e time :)
createArtifactPurchase("click+++++", artifactPrice[14], function(){
    clickExponent = Math.E;
});

///
///
///

//Pet Rock
createArtifactPurchase("petRock", artifactPrice[15], function(){
    multiplier += 0.01; //User would never notice lmao
});

//Four Leaf Clover
createArtifactPurchase("fourLeafClover", artifactPrice[16], function(){});

//Magic Scroll
createArtifactPurchase("magicScroll", artifactPrice[17], function(){
    items[8][2] *= 2;
});

//Duck
createArtifactPurchase("duck", artifactPrice[18], function(){});

//Industrial Revolution
createArtifactPurchase("industrialRevolution", artifactPrice[19], function(){
    for (let i = 0; i < items.length; i++){
        items[i][2] *= 2; //Double efficiency of all items
    }
});

///
///
///

//King Goose
createArtifactPurchase("kingGoose", artifactPrice[20], function(){
    multiplier *= 2;
});

//Eggscalibur
createArtifactPurchase("eggscalibur", artifactPrice[21], function(){});

//Eagle
createArtifactPurchase("eagle", artifactPrice[22], function(){
    items[4][2] *= 12345;
});

//Eagle
createArtifactPurchase("babyGoose", artifactPrice[23], function(){
    multiplier *= 1.5;
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ARTIFACTS END
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//This interval does 2 things:
//Add geese from items
//Count geese per second
//Check what artifacts are purchasable
//Check what items are purchasable
setInterval(function(){

    //Check what artifacts are purchasable
    for (let i = 0; i < artifacts.length; i++){
        if (artifactsOwned.get(artifacts[i]) != 'true'){
            document.getElementById(artifacts[i]).firstElementChild.innerHTML = "";
            if (gooses < artifactPrice[i]){
                document.getElementById(artifacts[i]).firstElementChild.style.visibility = "visible";
            }
            else{
                document.getElementById(artifacts[i]).firstElementChild.style.visibility = "hidden";
            }
        }
        else{
            document.getElementById(artifacts[i]).firstElementChild.style.visibility = "visible";
            document.getElementById(artifacts[i]).firstElementChild.innerHTML = "Sold!";
        }
    }

    for (let i = 0; i < items.length; i++){
        //Add geese from items
        gooses += items[i][0] * items[i][2] * multiplier * kingGooseEggscalibur();
        gooseThisSecond += items[i][0] * items[i][2] * multiplier * kingGooseEggscalibur();
        //Check if item is purchasable
        if (gooses < items[i][1]){
            htmlItems[i][4].style.visibility = "visible";
        }
        else{
            htmlItems[i][4].style.visibility = "hidden";
        }
    }

    goosePerSecond.innerHTML = "Geese per second: " + Math.round(gooseThisSecond);
    gooseThisSecond = 0;

    gooseCount.innerHTML = Math.round(gooses) + " Geese";
    
}, 1000);

//////////////////////////////////////////////////////////////////////////
//Autosave Feature////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

setInterval(function(){

    localStorage.setItem("gooses", gooses);
    localStorage.setItem("multiplier", multiplier);
    localStorage.setItem("clickMultiplier", clickMultiplier);
    localStorage.setItem("clickExponent", clickExponent);

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