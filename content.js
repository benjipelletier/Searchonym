var loadNewDom = function() {
    chrome.runtime.sendMessage(document.getElementsByTagName('body')[0].outerHTML,function(message){
        var parser = new DOMParser();
        var doc = parser.parseFromString(message.documentResponse, "text/html");
        document.getElementsByTagName('body')[0].outerHTML = doc.getElementsByTagName('body')[0].outerHTML;
    });
}

loadNewDom();