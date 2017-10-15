chrome.runtime.onMessage.addListener(function (response, sender, sendResponse) {
    if (response && response.sender === 'content') {
        request(response.searchWord, function(syns) {
            syns = syns.filter(function(x) {
                return x.toLowerCase() != response.searchWord.toLowerCase()
            });
        sendResponse({
            sender: 'background',
            word: response.searchWord,
            synonyms: syns,
            err: false
            });
        });
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
