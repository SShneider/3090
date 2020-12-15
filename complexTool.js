const inputForm = document.getElementById("settingsForm")


let userChoices = { //default user Choices
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
sendMessage(userChoices, false)
inputForm.addEventListener("submit", processInput)

function processInput(e){
    e.preventDefault()
    //console.log("hunt3080")
    extractValues(e)
    sendMessage(userChoices, true)
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

function sendMessage(payloadIn, boolIn){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {start: boolIn, userChoices: payloadIn})
     })
}