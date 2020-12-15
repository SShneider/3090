chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) =>{
        (async ()=>{
            if(request.addToCart){
                window.setTimeout(()=>chrome.tabs.sendMessage(sender.tab.id, {addToCart:true}), 5000)
            }
            if(request.found){
                chrome.windows.update(sender.tab.windowId, {focused: true})
            }
        })()
        return true;
    }
);

// chrome.runtime.onMessage.addListener(
//     (request, sender, sendResponse) =>{
//         (async ()=>{
//             console.log(request)
//             if(request.addToCart){
                
//                 window.setTimeout(()=>chrome.runtime.sendMessage({addToCart:true}), 10000)
//             }
//         })()
//         return true;
//     }
// );