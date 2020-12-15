
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse)=>{
        if(request.addToCart){
            let stepTwoAddCartButtons = []
            let viewdetailsAddToCart = document.getElementsByClassName("btn-wide")
            for (let i = 0; i<viewdetailsAddToCart.length; i++){
                if(viewdetailsAddToCart[i].innerText.toUpperCase() === "ADD TO CART "){
                    stepTwoAddCartButtons.push(viewdetailsAddToCart[i])
                    break;
                }
            }
            const addedSingle = addToCartCheckout(stepTwoAddCartButtons)
            if(addedSingle){
                window.setTimeout(() =>{
                    let checkoutCartButtons = document.getElementsByClassName("btn-undefined")
                    addToCartCheckout(checkoutCartButtons)
                }, 2000)
            }
        }
    }
)

function addToCartCheckout(buttonIn){
    const evObj = document.createEvent('Events')
    evObj.initEvent('click', true, false)
    buttonIn[0].dispatchEvent(evObj)
    return 1
}