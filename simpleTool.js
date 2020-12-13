const addToCartButtons = document.getElementsByClassName("btn-primary")
var myAudio = new Audio(chrome.runtime.getURL("Alarm01.wav"))
console.log(addToCartButtons)
let flag = false

if (addToCartButtons.length){
    for(let i = 0; i<addToCartButtons.length; i++){
        if(addToCartButtons[i].innerText === "ADD TO CART "){
            flag = true
        }
    }
}
window.setTimeout(hunt, 5000)
function hunt(){
    if(flag){
        myAudio.play()
    }else{
        window.location.reload()
    }
}