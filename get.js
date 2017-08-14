var request = function(search, callback) {
  var xhttp = new XMLHttpRequest();
  var key = 'c00a40ffd5c80a888434113afc8ccdf8';
  xhttp.onreadystatechange = function() {
    var synonyms = [ search ];
    if (this.readyState === 4 && this.status === 200) {
      var response = JSON.parse(this.responseText);
      var keys = Object.keys(response);
      for (var i = 0; i < keys.length; i++) {
        synonyms = synonyms.concat(response[keys[i]].syn);
      }
    }
    return callback(synonyms);
  };
  xhttp.open('GET', 'http://words.bighugelabs.com/api/2/' + key + '/' + search + '/json');
  xhttp.send();
}