var h=require('http'),f=require('fs'),p=require('path'),r=require('url');
var root='C:\\Users\\Mark Lorenz\\Desktop\\LibraryWebsite\\public';
var m={js:'text/javascript',css:'text/css',html:'text/html',png:'image/png',jpg:'image/jpeg',svg:'image/svg+xml',ico:'image/x-icon',json:'application/json'};
h.createServer(function(req,res){
  var u=r.parse(req.url).pathname;
  if (u==='/') u='/index.html';
  var fp=p.join(root,u);
  res.setHeader('Access-Control-Allow-Origin','*');
  f.stat(fp,function(err,stat){
    if(err||!stat.isFile()){res.writeHead(404);res.end('Not found');return}
    var ext=p.extname(fp).slice(1);
    res.writeHead(200,{'Content-Type':m[ext]||'text/plain'});
    f.createReadStream(fp).pipe(res);
  });
}).listen(4012,function(){console.log('http://localhost:4012')});
