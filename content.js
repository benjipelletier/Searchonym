var loadNewDom = function(searchWord){
    
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
            var parser = new DOMParser();
            var doc = parser.parseFromString(response.documentResponse, "text/html");
            document.getElementsByTagName('body')[0].outerHTML = doc.getElementsByTagName('body')[0].outerHTML;
            addCSSStyling();
            currentPageState.synonymList = response.synonyms;
        }else if(response && response.err){
            console.log(response.errMessage);
        }
    });
};


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
var updateFocus = function(){
    if(currentPageState.numberOfHighlights > 0){
        var currentElement = document.getElementsByClassName(currentPageState.universalWordClass)[currentPageState.elementIndex];
        currentElement.style.backgroundColor = currentElement.classList.contains(currentPageState.mainWordClass)?cssProperties.mainWordColor:cssProperties.synonymColor;
        currentPageState.elementIndex += 1;
        if(currentPageState.elementIndex >= currentPageState.numberOfHighlights){
            currentPageState.elementIndex = 0;    
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
        }else if(request.command === 'shiftFocus'){
            updateFocus();
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

