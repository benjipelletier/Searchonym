var initSearchonym = function(tab){
    popupState.searchWord = document.getElementById("search-bar").value;
    updateDom(popupState.searchWord);
}

var updateDom = function(searchWord){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        var sendingData = {
            sender: 'popup',
            command: 'updateWord',
            searchWord: searchWord
        }
        chrome.tabs.sendMessage(tabs[0].id, sendingData, function(response) {
            if(response.err){
                console.log(reponse.errMessage);
            }else{
                // On pressing enter , change focus will be called after dom has been updated
                popupState.enterFunction = changeFocus;
            }
        });  
    });
};

var changeFocus = function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        var sendingData = {
            sender: 'popup',
            command: 'shiftFocus'
        }
        chrome.tabs.sendMessage(tabs[0].id, sendingData, function(response) {
            if(response.err){
                console.log(reponse.errMessage);
            }
        });  
    });
}


// Initially when dom has not been initialized for new search, initSearchonym will be called
var popupState = {
    enterFunction: initSearchonym,
    searchWord : '',
}

window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("search-button").addEventListener("click", initSearchonym);
    document.getElementById("search-bar").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            popupState.enterFunction();
        }

        if(document.getElementById("search-bar").value !== popupState.searchWord) {
            //If search data is changed then enterFunction is set back to initSearchonym to initialize new search
            popupState.enterFunction = initSearchonym;
        }
    });
});
