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

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function addEpisodes (limit, skip) {
  request({url:'_view/episodes?descending=true&include_docs=true&limit='+limit+'&skip='+skip}, function (err, resp) {
    if (err) $("#content").html("<p>Error loading episodes.</p>");
    
    if(resp.rows.length > 0){
      $("#content").html('<ul id="episode-list"></ul>');
      resp.rows.forEach(function (row) {
        var d = new Date(parseInt(row.doc.published));
        $("#episode-list").append(
          '<li class="episode-container">' + 
            '<h2 class="episode-title">Episode ' + row.doc.episode + '</h2>' +
            '<h3 class="episode-date">Released <time datetime="'+row.doc.published+'">'+d.getDate()+' '+months[d.getMonth()]+'</time></h3>' +
            '<p class="episode-description">' + row.doc.longdesc + '</p>' +
            '<p class="player">'+
              '<span id="playtoggle" />'+
              '<span id="gutter">'+
                '<span id="loading" />'+
                '<span id="handle"/>'+
              '</span>'+
              '<span id="timeleft" />'+
            '</p>'+
          '</li>'
        );
      });
    } else {
      $("#content").html("<p>Sorry! There's no episodes online yet, check back soon.</p>");
    }
  });
};

var app = {
  index: function () {
    addEpisodes(10, 0);
  },
  
  about: function(){
    $("#content").html("About The Noded.");
  }
}

var a = $.sammy(function () {
  // Index of all databases
  this.get('', app.index);
  this.get("#/", app.index);
  this.get('#/about', app.about);
  
})

$(function () {a.use('Mustache'); a.run(); });
