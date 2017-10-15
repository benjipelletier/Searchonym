var updateDom = function(searchWord){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        var sendingData = {
            sender: 'popup',
            command: 'updateWord',
            searchWord: searchWord,
            removeFormat: true
        }
        chrome.tabs.sendMessage(tabs[0].id, sendingData, function(response) {
            console.log(response);
            if (!response.err) {
                //document.getElementById("list-container").innerHTML = JSON.stringify(response);
            }
        });  
    });
};

window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("search-bar").focus();
    document.getElementById("search-button").addEventListener("click", function(event) {
        if (document.getElementById("search-bar").value != '') {
            updateDom(document.getElementById("search-bar").value);
        }
    });
    document.getElementById("search-bar").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13 && document.getElementById("search-bar").value != '') {
            updateDom(document.getElementById("search-bar").value);
        }
    });
});
