const settingStorage = window.sessionStorage 

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse)=>{
        if(request.start){
            settingStorage.setItem("OMR3080", JSON.stringify(request.userChoices))
            hunt3080()
        }
        else if(!request.start){
            settingStorage.removeItem("OMR3080")
        }
    }
)

hunt3080()

function hunt3080(){
    const userChoices = loadFromStorage()
    console.log(userChoices)
    if(!userChoices){
        //error("sTl")
        return 0
    }
    if(userChoices.endTime>Date.now()){
        let delay = 0
        if (Date.now()-userChoices.startTime>userChoices.durationBatch){
            delay = userChoices.breakLength
        }else{
            delay = randomInterval(userChoices.refresh.min, userChoices.refresh.max)
        }
        userChoices.startTime = userChoices.startTime+userChoices.durationBatch+userChoices.breakLength
        settingStorage.setItem("OMR3080", JSON.stringify(userChoices))
        window.setTimeout(hunt, delay)
    }
}

function loadFromStorage(){
    try{
        userChoices = JSON.parse(settingStorage.getItem("OMR3080"))   
    }catch{
        settingStorage.removeItem("OMR3080")
        //error("sTl")
        return 0
    }
    if(userChoices){
        return userChoices
    }else{
        //error("sTl")
        return 0
    }
}

function error(lineErr){
    console.error(`Error, please refresh, Error code ${lineErr}`)
}



function hunt(){
    const addToCartButtons = document.getElementsByClassName("btn-primary")
    var myAudio = new Audio(chrome.runtime.getURL("Alarm01.wav"))
    let flag = false
    if (addToCartButtons.length){
        for(let i = 0; i<addToCartButtons.length; i++){
            if(addToCartButtons[i].innerText === "ADD TO CART "){
                flag = true
            }
        }
    }
    if(flag){
        myAudio.play()
    }else{
        window.location.reload()
    }
}

function randomInterval(min, max){
    return Math.floor(Math.random()*(max-min+1)) + min
}