chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) =>{
        (async ()=>{
            const addToCartButtons = document.getElementsByClassName("btn-primary")
            console.log(addToCartButtons)
        })()
        return true;
    }
);
