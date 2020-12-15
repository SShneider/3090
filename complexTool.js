const inputForm = document.getElementById("settingsForm")
const myButton = document.getElementById("start")
const userSettings = window.localStorage
let started = false;
const userChoicesDefault = { //default user Choices
    addToCart: false,
    playSound: true,
    windowUp: false,
    stopMultiple: false,
    refresh: {min: 3*1000, max: 5*1000},
    durationTotal: 3*60*60*1000,
    durationBatch: 45*60*1000,
    breakLength: 15*60*1000,
    startTime: Date.now(),
    endTime: Date.now()
}
let userChoices
try{
    userChoices = JSON.parse(userSettings.getItem("OMR3080user"))
}catch{
    userSettings.setItem("OMR3080user", JSON.stringify(userChoicesDefault))
    userChoices = userChoicesDefault
}
if(!userChoices){
    userSettings.setItem("OMR3080user", JSON.stringify(userChoicesDefault))
    userChoices = userChoicesDefault
}else{
    document.getElementById("toCart").checked = userChoices.addToCart
    document.getElementById("processMultiple").checked = userChoices.stopMultiple
    document.getElementById("sound").checked = userChoices.playSound
    document.getElementById("toFront").checked = userChoices.windowUp
    document.getElementById("refreshMin").value = userChoices.refresh.min/1000
    document.getElementById("refreshMax").value = userChoices.refresh.max/1000
    document.getElementById("totalRuntime").value = userChoices.durationTotal/60/60/1000
    document.getElementById("batchRuntime").value = userChoices.durationBatch/60/1000
    document.getElementById("breakDuration").value = userChoices.breakLength/60/1000
}
sendMessage(userChoices, false)//clears refresh trigger
inputForm.addEventListener("submit", processInput)

function processInput(e){
    e.preventDefault()
    if(started){
        sendMessage(userChoices, false)
        started = false
        myButton.innerText = "START"
    }else{
        extractValues(e)
        started = true
        myButton.innerText="STOP"
        sendMessage(userChoices, true)
    }
}

function extractValues(e){
    console.log(e)
    userChoices.addToCart = e.srcElement[0].checked
    userChoices.stopMultiple = e.srcElement[1].checked
    userChoices.playSound = e.srcElement[2].checked
    userChoices.windowUp = e.srcElement[3].checked
    userChoices.refresh.min = parseInt(e.srcElement[4].value)*1000 //used up setting delay before running hunt3080
    userChoices.refresh.max = parseInt(e.srcElement[5].value)*1000 //used up setting delay before running hunt3080
    userChoices.durationTotal = parseInt(e.srcElement[6].value)*60*60*1000 //used up setting endTime
    userChoices.durationBatch = parseInt(e.srcElement[7].value)*60*1000
    userChoices.breakLength = parseInt(e.srcElement[8].value)*60*1000
    userChoices.startTime = Date.now()
    userChoices.endTime = Date.now()+userChoices.durationTotal
    userSettings.setItem("OMR3080user", JSON.stringify(userChoices))
}

function sendMessage(payloadIn, boolIn){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {start: boolIn, userChoices: payloadIn})
     })
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse)=>{
        if(request.found){
            sendMessage(userChoices, false)
            started = false
            myButton.innerText = "START"
        }
    }
)
