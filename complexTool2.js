const inputForm = document.getElementById("settingsForm")
const settingStorage = window.localStorage //saves settings for refresh
let fetched = false 
let userChoicesDefault = { //default user Choices
    addToCart: false,
    playSound: true,
    windowUp: false,
    refresh: {min: 3*1000, max: 5*1000},
    durationTotal: 3*60*60*1000,
    durationBatch: 45*60*1000,
    breakLength: 15*60*1000,
    startTime: Date.now(),
    endTime: Date.now()
}
let userChoices = {}
inputForm.addEventListener("submit", processInput)

try{
    userChoices = JSON.parse(settingStorage.getItem("OMR3080"))   
}catch{
    settingStorage.removeItem("OMR3080")
    userChoices = userChoicesDefault
}//checks if this is a refresh state or a new instance
if(userChoices){
    fetched = true
}else{
    userChoices = userChoicesDefault
}
if(userChoices.endTime>Date.now()){
    let delay = 0
    if (Date.now()-userChoices.startTime>userChoices.durationBatch){
        delay = userChoices.breakLength
    }else{
        delay = randomInterval(userChoices.refresh.min, userChoices.refresh.max)
    }
    window.setTimeout(hunt3080, delay)
}

function processInput(e){
    e.preventDefault()
    //console.log("hunt3080")
    extractValues(e)
    settingStorage.setItem("OMR3080", JSON.stringify(userChoices))
    let delay = randomInterval(userChoices.refresh.min, userChoices.refresh.max)
    window.setTimeout(hunt3080, delay)
}

function extractValues(e){
    userChoices.addToCart = e.srcElement[0].checked
    userChoices.playSound = e.srcElement[1].checked
    userChoices.windowUp = e.srcElement[2].checked
    userChoices.refresh.min = parseInt(e.srcElement[3].value)*1000 //used up setting delay before running hunt3080
    userChoices.refresh.max = parseInt(e.srcElement[4].value)*1000 //used up setting delay before running hunt3080
    userChoices.durationTotal = parseInt(e.srcElement[5].value)*60*60*1000 //used up setting endTime
    userChoices.durationBatch = parseInt(e.srcElement[6].value)*60*1000
    userChoices.breakLength = parseInt(e.srcElement[7].value)*60*1000
    userChoices.startTime = Date.now()
    userChoices.endTime = Date.now()+userChoices.durationTotal
    //console.log(userChoices)
}

function randomInterval(min, max){
    return Math.floor(Math.random()*(max-min+1)) + min
}

function hunt3080(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.executeScript(tabs[0].id,{
            file: "simpleTool.js"
        })
    })
}
