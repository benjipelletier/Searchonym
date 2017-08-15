var initSearchonym = function(tab){
    var searchWord = document.getElementById("search-bar").value;
    updateDom(searchWord);
}

var updateDom = function(searchWord){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        var sendingData = {
            sender: 'popup',
            searchWord: searchWord
        }
        chrome.tabs.sendMessage(tabs[0].id, sendingData, function(response) {
            if(response.err){
                console.log(reponse.errMessage);
            }
        });  
    });
};

window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("search-button").addEventListener("click", initSearchonym);
});
