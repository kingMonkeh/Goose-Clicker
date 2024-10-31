var gooses = 0;
var multiplier = 1;
var gooseThisSecond = 0; //number of geese produced this second

//items = [[owned, price, produce], ...]
const items = [[0, 10, 1], [0, 100, 10], [0, 1019, 111], [0, 10000, 1010], [0, 1000000, 12345], [0, 10000000, 123456], [0, 100000000, 1234567], [0, 1000000000, 12345678], [0, 10000000000, 12345678]];

//helper1: string -> [mainbox html, price html, owned html]
//let document.getElementById() = d.gEBI()
//helper1("grass") -> [d.gEBI("grass"), d.gEBI("grassRightTop", d.gEBI("grassRightBottom"), d.gEBI("grassLeft"), d.gEBI("grassImage")]
function helper1(item){
    return [document.getElementById(item), document.getElementById(item + "RightTop"), document.getElementById(item + "RightBottom"), document.getElementById(item + "Left"), document.getElementById(item + "Image")];
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
        htmlItems[i][1].innerHTML = "Price: " + localStorage.getItem(i + "_" + 1);
        htmlItems[i][2].innerHTML = "Owned: " + localStorage.getItem(i + "_" + 0);
    }

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
    gooses += 1000000;
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

//Click on goose event
mainGoose.addEventListener('click', function(){
    gooses += 1 * multiplier;
    gooseThisSecond += 1 * multiplier;
    gooseCount.innerHTML = gooses + " Geese";
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

    gooseCount.innerHTML = gooses + " Geese";
    
}, 1000);

setInterval(function(){

    localStorage.setItem("gooses", gooses);
    localStorage.setItem("multiplier", multiplier);

    for (let i = 0; i < items.length; i++){
        for (let j = 0; j < 3; j++){
            localStorage.setItem(i + "_" + j, items[i][j]);
        }
    }

    console.log("Saved!");

}, 30000);