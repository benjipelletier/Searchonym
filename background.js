chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    if (response && response.sender === 'content') {
        sendResponse({
            sender: 'background',
            word: "lol",
            synonyms: [ "cool", "no"],
            err: false
        });
    } else {
        sendResponse({
            err: true,
            errMessage: 'Empty dom element from content.'
        });
    }
    return true;
});

        /*
        var parser = new DOMParser()
        var doc = parser.parseFromString(response.documentData, "text/html");
        // Modifications required to look for synonyms from the api
        setSearch(doc, response.mainWordClass, response.synonymWordClass, response.universalWordClass);
        request(response.searchWord, function (synonymList) {
            getSearchonym(synonymList, function (newDoc,synonymList) {
                sendResponse({
                    sender: 'background',
                    documentResponse: newDoc.getElementsByTagName('body')[0].outerHTML,
                    synonyms: synonymList,
                    err: false
                });
            })
        })
    } else {
        sendResponse({
            err: true,
            errMessage: 'Empty dom element from content.'
        });
    }
    return true;
});


var request = function (search, callback) {
    var xhttp = new XMLHttpRequest();
    var key = 'c00a40ffd5c80a888434113afc8ccdf8';
    var synonyms = [search];
    xhttp.onload = function () {
        if (this.readyState !== XMLHttpRequest.LOADING && this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            var response = JSON.parse(this.responseText);
            var keys = Object.keys(response);
            for (var i = 0; i < keys.length; i++) {
                synonyms = synonyms.concat(response[keys[i]].syn);
            }
        }
        callback(synonyms);     
    };
    xhttp.open('GET', 'http://words.bighugelabs.com/api/2/' + key + '/' + search + '/json');
    xhttp.send();
}

//The following functions parses through an html and updates the dom for the search results

var replaceTextWithTag = function (text, word, className) {
    var allLocations = text.split(new RegExp(word, 'gi'));
    var allWords = text.match(new RegExp(word, 'gi'));
    if (allLocations.length > 1) {
        var highlightedText = allLocations[0];
        for (var index = 1; index < allLocations.length; index++) {
            highlightedText += "<span style='display:block;float:left;' class='" + className + "'>" + allWords[index - 1] + '</span>' + allLocations[index];
            state.counter += 1;
        }
        return highlightedText;
    } else {
        return text;
    }
}

var replaceWordInElement = function (element, word, className) {

    var allText = element.innerHTML.split(/<[^>]*>/gi);
    var allTags = element.innerHTML.match(/<[^>]*>/gi);

    var newElement = replaceTextWithTag(allText[0], word, className);
    for (var index = 1; index < allText.length; index++) {
        newElement += allTags[index - 1] + replaceTextWithTag(allText[index], word, className);
    }
    return newElement;
}

var getSearchWord = function (word, wordClass, documentElement) {
    if (word) {
        var allElements = documentElement.getElementsByTagName('*');
        state.counter = allElements.length;
        for (var element = 0; element < state.counter; element++) {
            if (allElements[element]) {
                if (allElements[element].childElementCount === 0 && allElements[element].innerText !== undefined && allElements[element].innerText !== "" && allElements[element].className !== wordClass) {
                    if (allElements[element].innerText.search(new RegExp(word, 'gi')) !== -1) {
                        allElements[element].innerHTML = replaceWordInElement(allElements[element], word, wordClass);
                    }
                } else if (allElements[element].childElementCount !== 0 && allElements[element].innerText !== "" && allElements[element].className !== wordClass) {

                    for (child in allElements[element].childNodes) {
                        if (allElements[element].childNodes[child].nodeName === '#text') {
                            if (allElements[element].childNodes[child].nodeValue.search(new RegExp(word, 'gi')) !== -1) {
                                allElements[element].innerHTML = replaceWordInElement(allElements[element], word, wordClass);
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
    universalClass: ''
};

var setSearch = function (documentElement, wordClass, synonymClass, universalClass) {
    state.wordClass = wordClass;
    state.synonymClass = synonymClass;
    state.documentElement = documentElement;
    state.universalClass = universalClass;
}

var getSearchonym = function (arrayWords, callback) {

    // Hightlights the main word 
    getSearchWord(arrayWords[0], state.universalClass + ' ' + state.wordClass, state.documentElement);

    //Highlights all the synonyms
    for (var word = 1; word < arrayWords.length; word++) {
        getSearchWord(arrayWords[word], state.universalClass + ' ' + state.synonymClass, state.documentElement);
    }

    //Call the callback 
    callback(state.documentElement,arrayWords);
}
*/

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
