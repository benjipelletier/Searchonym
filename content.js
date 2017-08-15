var loadNewDom = function(searchWord){
    
    var sendingData = {
        documentData : currentPageState.html,
        searchWord: searchWord,
        sender: 'content'
    }

    chrome.runtime.sendMessage(sendingData,function(response){
        if(response && response.sender==='background' && !response.err){
            var parser = new DOMParser();
            var doc = parser.parseFromString(response.documentResponse, "text/html");
            document.getElementsByTagName('body')[0].outerHTML = doc.getElementsByTagName('body')[0].outerHTML;
        }else if(response.err){
            console.log(response.errMessage);
        }
    });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.sender === 'popup'){
        loadNewDom(request.searchWord);
        sendResponse({ err: false });
    }else{
        sendResponse({ 
            err: true, 
            errMessage: 'Content did not recieve message from popup.'
        });        
    }
});

var currentPageState = {
    html : document.getElementsByTagName('body')[0].outerHTML
};

