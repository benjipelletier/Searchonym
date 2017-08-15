chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    if(response && response.sender === 'content'){
        var parser = new DOMParser()
        var doc = parser.parseFromString(response.documentData, "text/html");
        // Modifications required to look for synonyms from the api and changing the css styling (Also remove style property from line 25 for debugging)
        setSearch(doc, "white", "black");
        getSearchonym([response.searchWord], function(newDoc) {
            sendResponse({
                sender: 'background',
                documentResponse: newDoc.getElementsByTagName('body')[0].outerHTML,
                err: false
            });
        })
    }else{
        sendResponse({
            err: true,
            errMessage: 'Empty dom element from content.'
        });
    }
});


//The following functions parses through an html and updates the dom for the search results

var replaceTextWithTag = function( text , word , className ) {
    var allLocations = text.split(new RegExp(word,'gi'));
    var allWords = text.match(new RegExp(word,'gi')); 
    if(allLocations.length > 1){
        var highlightedText = allLocations[0];
        for(var index = 1; index < allLocations.length ; index ++ ) {
            highlightedText += "<span style='background:red;' class='" + className + "'>" + allWords[index-1] + '</span>' + allLocations[index];
            state.counter += 1;
        }
        return highlightedText;
    }else{
        return text;
    }
}

var replaceWordInElement = function( element , word , className ) {

    var allText = element.innerHTML.split(/<[^>]*>/gi);
    var allTags = element.innerHTML.match(/<[^>]*>/gi);
    
    var newElement = replaceTextWithTag(allText[0],word,className);
    for( var index = 1 ; index < allText.length ; index ++ ) {
        newElement += allTags[index-1] + replaceTextWithTag(allText[index],word,className);
    }
    return newElement;
}
    
var getSearchWord = function( word , wordClass , documentElement ) {
    if(word) {
        var allElements = documentElement.getElementsByTagName('*');
        state.counter = allElements.length;
        for (var element = 0; element < state.counter; element++) {
            if(allElements[element]){
                if (allElements[element].childElementCount === 0 && allElements[element].innerText !== undefined && allElements[element].innerText !== "" && allElements[element].className !== wordClass) {
                    if (allElements[element].innerText.search(new RegExp(word,'gi')) !== -1){
                        allElements[element].innerHTML = replaceWordInElement(allElements[element],word,wordClass);
                    }
                } else if (allElements[element].childElementCount !== 0 && allElements[element].innerText !== "" && allElements[element].className !== wordClass) {
                    
                    for (child in allElements[element].childNodes) {
                        if (allElements[element].childNodes[child].nodeName === '#text') {
                            if (allElements[element].childNodes[child].nodeValue.search(new RegExp(word,'gi')) !== -1 ) {
                                allElements[element].innerHTML = replaceWordInElement(allElements[element],word,wordClass);
                            }
                        }
                    }
                }  
            }
        }
    }
}
  
var state = {
    documentElement: '',
    counter: 0,
    wordClass: '',
    synonymClass: '',
    isInit: false
};

var setSearch = function( documentElement , wordClass , synonymClass ) {
    state.wordClass = wordClass;
    state.synonymClass = synonymClass;
    state.documentElement = documentElement;
    state.isInit = true;
} 

var getSearchonym = function( arrayWords , callback ) {
    
    // Hightlights the main word 
    getSearchWord( arrayWords[0] , state.wordClass , state.documentElement );
    
    //Highlights all the synonyms
    for(var word = 1; word < arrayWords.length; word++ ) {
        getSearchWord( arrayWords[word] , state.synonymClass , state.documentElement );
    }

    //Call the callback 
    callback(state.documentElement);
    
}


/*
setSearch( html_document , name_of_class_for_main_word , name_of_class_for_all_synonyms );
Use this function before calling getSearchonyms to set parameters for the documents and stylings for highlights 
Call setSearch only after the DOM is loaded completely

getSearchonyms( [ main_word , synonyms...] , callback );
parses through the html and highlights the words and the searchonyms depending on the styles defined by the css 
calls the callback as soon as highlighting is completed 

Example:

window.addEventListener("DOMContentLoaded", function() {
    setSearch(document,'lol','wow');
    getSearchonym(['lol','div','add'] ,function(){
        console.log('Done');
    });
}, false);

*/
