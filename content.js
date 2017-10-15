var loadNewDom = function(searchWord, removeFormat){
    var sendingData = {
        searchWord: searchWord,
        sender: 'content'
    }

    chrome.runtime.sendMessage(sendingData,function(response){
        if (response && response.sender === 'background' && !response.err){
            document.designMode = "on";
            document.execCommand("SelectAll", false, null);
            document.execCommand("RemoveFormat", false, null);
            document.designMode = "off";
            response.synonyms.forEach(function(word) {
                searchDOM(word);
            });
            searchDOM(response.word, "original");
        }
            /*
            var parser = new DOMParser();
            var doc = parser.parseFromString(response.documentResponse, "text/html");
            document.getElementsByTagName('body')[0].outerHTML = doc.getElementsByTagName('body')[0].outerHTML;
            addCSSStyling();
            currentPageState.synonymList = response.synonyms;
        }else if(response && response.err){
            console.log(response.errMessage);
        }*/
    });
};

function searchDOM(text, type = "syn") {
    if (window.find && window.getSelection) {
        document.designMode = "on";
        var sel = window.getSelection();
        sel.collapse(document.body, 0);
        //document.execCommand("styleWithCSS", true, null);
        while (window.find(text)) {
            document.execCommand("HiliteColor", false, type == "syn" ? "orange" : "yellow");
            sel.collapseToEnd();

        }
        document.designMode = "off";
    }
    // Use HiliteColor since some browsers apply BackColor to the whole block
    
}

/*
// Scrolls to the current highlighted element
var scrollIntoElement = function(element){
    Element.prototype.documentTop = function () {
        return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentTop() : 0 );
    };
    window.scrollTo( 0 , element.documentTop() - ( window.innerHeight / 2 ) );
}
*/

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.sender === 'popup'){
        if (request.command === 'updateWord'){
            loadNewDom(request.searchWord, request.removeFormat);
            sendResponse({err: false});
        }
    }else{
        sendResponse({ 
            err: true, 
            errMessage: 'Content did not recieve message from popup.'
        });        
    }
});
