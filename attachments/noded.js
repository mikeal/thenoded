var request = function (options, callback) {
  options.success = function (obj) {
    callback(null, obj);
  }
  options.error = function (err) {
    if (err) callback(err);
    else callback(true);
  }
  options.dataType = 'json';
  options.contentType = 'application/json'
  $.ajax(options)
}

var app = {}

app.index = function ( ) {
  var limit = 10
    , skip = 0
    ;
  function addEpisodes () {
    request({url:'_view/episodes?descending=true&include_docs=true&limit='+limit+'&skip='+skip}, function (err, resp) {
      if (err) throw err;
      resp.rows.forEach(function (row) {
        $("div#content").append($(
          '<div class="episode-container">' + 
            '<div class="episode-title">Episode' + row.doc.episode + '</div>' +
            '<div class="episode-description">' + row.doc.shortdesc + '</div>' +
            '<audio src="/api/' + row.id + '/' + row.id + '.mp3" >Your browser does not support the <code>audio</code> element.  </audio>' +
          '</div>'
        ))
        
      })
    })
  }
  addEpisodes();
}

var a = $.sammy(function () {
  // Index of all databases
  this.get('', app.index);
  this.get("#/", app.index);
  
})

$(function () {a.use('Mustache'); a.run(); });
