var loadNewDom = function(searchWord){
    alert("loaded new dom")
    var sendingData = {
        documentData : currentPageState.html,
        searchWord: searchWord,
        sender: 'content',
        mainWordClass: currentPageState.mainWordClass,
        synonymWordClass: currentPageState.synonymWordClass,
        universalWordClass: currentPageState.universalWordClass
    }

    chrome.runtime.sendMessage(sendingData,function(response){
        if (response && response.sender==='background' && !response.err){
            alert("responsee " + JSON.stringify(response));
            searchDOM(response.word, "original");
            response.synonyms.forEach(function(word) {
                searchDOM(word);
            });
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



// Sets the initial styling for the mainWords, synonnyms and the highlights the first word
var addCSSStyling = function(){

    var allMainWords = document.getElementsByClassName(currentPageState.mainWordClass);
    for(var index=0;index<allMainWords.length;index++){
        allMainWords[index].style.backgroundColor = cssProperties.mainWordColor;
    }

    var allSynonymWords = document.getElementsByClassName(currentPageState.synonymWordClass);
    for(var index=0;index<allSynonymWords.length;index++){
        allSynonymWords[index].style.backgroundColor = cssProperties.synonymColor;
    }

    currentPageState.numberOfHighlights = document.getElementsByClassName(currentPageState.universalWordClass).length;
    currentPageState.elementIndex = 0;
    document.getElementsByClassName(currentPageState.universalWordClass)[currentPageState.elementIndex].style.backgroundColor = cssProperties.currentElementColor;
    scrollIntoElement(document.getElementsByClassName(currentPageState.universalWordClass)[currentPageState.elementIndex]);

}

// Scrolls to the current highlighted element
var scrollIntoElement = function(element){
    Element.prototype.documentTop = function () {
        return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentTop() : 0 );
    };
    window.scrollTo( 0 , element.documentTop() - ( window.innerHeight / 2 ) );
}


// Updates the highlight to the next word 
var updateFocus = function(direction){
    if(currentPageState.numberOfHighlights > 0 && direction){
        var currentElement = document.getElementsByClassName(currentPageState.universalWordClass)[currentPageState.elementIndex];
        currentElement.style.backgroundColor = currentElement.classList.contains(currentPageState.mainWordClass)?cssProperties.mainWordColor:cssProperties.synonymColor;
        if(direction==='down'){
            currentPageState.elementIndex += 1;
            if(currentPageState.elementIndex >= currentPageState.numberOfHighlights){
                currentPageState.elementIndex = 0;    
            }
        }else if(direction==='up'){
            currentPageState.elementIndex -= 1;
            if(currentPageState.elementIndex === -1){
                currentPageState.elementIndex = currentPageState.numberOfHighlights-1;    
            }
        }
        document.getElementsByClassName(currentPageState.universalWordClass)[currentPageState.elementIndex].style.backgroundColor = cssProperties.currentElementColor;
        scrollIntoElement(document.getElementsByClassName(currentPageState.universalWordClass)[currentPageState.elementIndex]);
    }    
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.sender === 'popup'){
        if(request.command === 'updateWord'){
            loadNewDom(request.searchWord);
            sendResponse({ err: false, synonyms: currentPageState.synonymList});
        }else if(request.command === 'shiftFocus' && request.direction){
            updateFocus(request.direction);
        }
    }else{
        sendResponse({ 
            err: true, 
            errMessage: 'Content did not recieve message from popup.'
        });        
    }
});



/*
MainWordClass : name of the searched word
SynonymWordClass: names of the synonyms
UniversalWordClass: All words combined
*/
var currentPageState = {
    html : document.getElementsByTagName('body')[0].outerHTML,
    mainWordClass: 'white',
    synonymWordClass: 'black',
    universalWordClass: 'grey',
    elementIndex: 0,
    numberOfHighlights: 0,
    synonymList: []
};

/*
currentElementColor: color of the highlighted element
mainWordColor: color of the main word
synonymColor: color of the synonym
*/
var cssProperties = {
    currentElementColor : 'yellow',
    mainWordColor: 'green',
    synonymColor: 'red'
}

