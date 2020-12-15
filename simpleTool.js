const settingStorage = window.sessionStorage
let details = false
const myAudio = new Audio(chrome.runtime.getURL("Alarm01.wav"))
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
// if(window.location.pathname==="/shop/cart" ){
//     window.setTimeout(addToCart(document.getElementsByClassName("btn-wide")), 1000)
// }
hunt3080()

function hunt3080(){
    const userChoices = loadFromStorage()
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
    }else{
        sendMessageEnd()
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
    const viewDetailsButtons = document.getElementsByClassName("btn-mini")
    let flag = false
    let addCartButtonArray = []
    if (addToCartButtons.length){
        for(let i = 0; i<addToCartButtons.length; i++){
            if(addToCartButtons[i].innerText.toUpperCase() === "ADD TO CART "){
                flag = true
                addCartButtonArray.push(addToCartButtons[i])
            }
        }
    }
    details = !flag
    if(!flag||userChoices.stopMultiple){
        if (viewDetailsButtons.length){
            for(let i = 0; i<viewDetailsButtons.length; i++){
                if(viewDetailsButtons[i].innerText.toUpperCase() === "VIEW DETAILS "){
                    flag = true
                    addCartButtonArray.push(viewDetailsButtons[i])
                }
            }
        }
    }
    if(flag){
        sendMessageEnd()
        if(addCartButtonArray.length>1 && userChoices.stopMultiple || !userChoices.addToCart){
            if(userChoices.playSound) myAudio.play()
            addCartButtonArray[0].focus()
        }else if(userChoices.addToCart){
            console.log("Details: ", details)
            if(details) chrome.runtime.sendMessage({addToCart:true})
            if(userChoices.playSound) myAudio.play()
            const addedSingle = addToCart(addCartButtonArray)
            if(addedSingle){
                let stepTwoAddCartButtons = document.getElementsByClassName("btn-undefined")
                if(stepTwoAddCartButtons.length){
                    window.setTimeout(() => addToCart(stepTwoAddCartButtons), 2000)
                }
            }
        }
    }else{
        window.location.reload()
    }
}

function randomInterval(min, max){
    return Math.floor(Math.random()*(max-min+1)) + min
}

function addToCart(buttonIn){
    const evObj = document.createEvent('Events')
    evObj.initEvent('click', true, false)
    buttonIn[0].dispatchEvent(evObj)
    if(userChoices.stopMultiple && !addToCartButtons.length) return 0
    return 1
}

function sendMessageEnd(){
    chrome.runtime.sendMessage({found:true, toFront: userChoices.windowUp})
}