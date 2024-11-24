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
var gooseThisSecond = 0; //number of geese produced this second

//items = [[owned, price, produce], ...]
var items = [[0, 10, 1], [0, 100, 10], [0, 1019, 111], [0, 10000, 1010], [0, 1000000, 12345], [0, 10000000, 123456], [0, 100000000, 1234567], [0, 1000000000, 12345678], [0, 10000000000, 123456789]];
const origItems = [[0, 10, 1], [0, 100, 10], [0, 1019, 111], [0, 10000, 1010], [0, 1000000, 12345], [0, 10000000, 123456], [0, 100000000, 1234567], [0, 1000000000, 12345678], [0, 10000000000, 123456789]];

var artifacts = ["fertilizer", "betterSeeds", "goldenWheatStrain", "babylonianIrrigationSystem", "shinyCoating", "featherInsulation", "geeseScholarship"];
var artifactsOwned = new Map();

//helper1: string -> [mainbox html, price html, owned html]
//let document.getElementById() = d.gEBI()
//helper1("grass") -> [d.gEBI("grass"), d.gEBI("grassRightTop", d.gEBI("grassRightBottom"), d.gEBI("grassLeft"), d.gEBI("grassImage")]
function helper1(item){
    return [document.getElementById(item), document.getElementById(item + "Price"), document.getElementById(item + "Owned"), document.getElementById(item + "Image")];
}

const htmlItems = [helper1("grass"), helper1("wheat"), helper1("gooseStatue"), helper1("gooseNest"), helper1("uwaterloo"), helper1("gooseTemple"), helper1("gooseMagnet"), helper1("gooseLab"), helper1("portal")];

//helper2 takes in itemLeft, and resizes to fit with itemImage
function helper2(left, image){
    left.style.width = "70%";
    left.style.width = String(left.offsetWidth - image.offsetWidth) + "px";
}

//Initialize game, aka local save file
function init(){

    console.log("Working");

    //Init goose count
    if (localStorage.getItem("gooses") != null)
        gooses = parseInt(localStorage.getItem("gooses"));

    if (localStorage.getItem("multiplier") != null)
        multiplier = parseFloat(localStorage.getItem("multiplier"));

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

    gooses = 0;
    multiplier = 1;
    items = origItems.slice(); //slice to create different array, not reference to origItems

    for (let i = 0; i < items.length; i++){
        //Update html text
        htmlItems[i][1].innerHTML = "Price: " + items[i][1];
        htmlItems[i][2].innerHTML = "Owned: " + items[i][0];
    }

    console.log("RESET");

}

const mainGoose = document.getElementById("mainGoose");
const gooseCount = document.getElementById("gooseCount");
const goosePerSecond = document.getElementById("goosePerSecond");

/////////////////////////////////////////////////////////////////
//EXTRAS/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

//Chipmunk click event
const chipmunk = document.getElementById("chipmunk");
chipmunk.addEventListener('click', function(){
    for (let i = 0; i < 3; i++){
        if (Math.random() >= 0.54) gooses *= 2;
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
    gooses = 0; //Reset geese
    multiplier += 0.01; //Update multiplier
    //Reset all items
    for (let i = 0; i < items.length; i++){
        items[i][0] = 0;
    }
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
        localStorage.clear();
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

//Click on goose event
mainGoose.addEventListener('click', function(){
    gooses += 1 * multiplier;
    gooseThisSecond += 1 * multiplier;
    gooseCount.innerHTML = Math.round(gooses) + " Geese";
});

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

const fertilizer = document.getElementById("fertilizer");
fertilizer.addEventListener('click', function(){
    console.log("clicked");
    if (gooses >= 1000 && artifactsOwned.get("fertilizer") != "true"){
        gooses -= 1000;
        artifactsOwned.set("fertilizer", "true");
        items[0][2] *= 2;
    }
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