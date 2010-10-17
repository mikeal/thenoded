var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = { _id:'_design/app'
  , rewrites : [
        {from:"/", to:'index.html'}
      , {from:"/api", to:'../../'}
      , {from:"/api/*", to:'../../*'}
      , {from:"/rss", to:'_list/rss/episodes', query: {descending:true, limit:10, include_docs:true} }
      , {from:"/*", to:'*'}
    ]
  }

ddoc.views = {episodes: {map: function (doc) {
  if (doc._attachments) {
    emit(doc.published, 1);
  }
}}};


ddoc.lists = {
  rss : function (head, req) {
    start({code:200, headers:{'Content-Type':'application/rss'}})
    
    send(
      '<?xml version="1.0" encoding="UTF-8"?>' +
        '<rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">' +
        '<channel>' +
          '<title>The Noded</title>' +
          '<link>http://www.thenoded.com</link>' +
          '<language>en-us</language>' +
          '<copyright>Mikeal and Micheil</copyright>' +
          '<itunes:subtitle>A show about node.js</itunes:subtitle>' +
          '<itunes:author>Micheil Smith</itunes:author>' +
          '<itunes:author>Mikeal Rogers</itunes:author>' +
          '<itunes:summary>Weekly Podcast about node.js</itunes:summary>' +
          '<description>Weekly Podcast about node.js</description>' +
          '<itunes:owner>' +
            '<itunes:name>John Doe</itunes:name>' +
            '<itunes:email>john.doe@example.com</itunes:email>' +
          '</itunes:owner>' +
          '<itunes:image href="http://example.com/podcasts/everything/AllAboutEverything.jpg" />' +
          '<itunes:category text="Technology">' +
            '<itunes:category text="Programming"/>' +
          '</itunes:category>' 
    )
    var row;
    while (row = getRow()) {
      send(
        '<item>' +
          '<title>Episode '+row.doc.episode+'</title>' +
          '<itunes:author>Mikeal & Micheil</itunes:author>' +
          '<itunes:subtitle>A short primer on table spices</itunes:subtitle>' +
          '<itunes:summary>This week we talk about salt and pepper shakers, comparing and contrasting pour rates, construction materials, and overall aesthetics. Come and join the party!</itunes:summary>' +
          '<enclosure url="http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a" length="8727310" type="audio/x-m4a" />' +
          '<guid>http://example.com/podcasts/archive/aae20050615.m4a</guid>' +
          '<pubDate>Wed, 15 Jun 2005 19:00:00 GMT</pubDate>' +
          '<itunes:keywords>salt, pepper, shaker, exciting</itunes:keywords>' +
        '</item>'
      )
      
    } 
    send(
        '</channel>' +
      '</rss>'
    );
  }
}

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {     
    throw "Only admin can delete documents on this database."   
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'))

exports.app = ddoc