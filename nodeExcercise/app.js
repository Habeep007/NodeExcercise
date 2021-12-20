const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const querystring = require('querystring');

const fetch = require('node-fetch');

      


const port = 8000;

const server = http.createServer((req, res) => {

    const urll = "http://127.0.0.1"+ url.parse(req.url,true).path;


   //geting the query string
    if(url.parse(req.url,true).pathname == "/I/want/title"){
        console.log("route valid");

        const current_url = new URL(urll);
        const searchadd = current_url.searchParams;
        const address = searchadd.get('address');
      //  console.log(address);


      const parseTitle = (body) => {
        let matchedtags = body.match(/<title>([^<]*)<\/title>/);
        if (!matchedtags || typeof matchedtags[1] !== 'string'){
         throw new Error('Unable to parse the title tag');
        }
        return matchedtags[1];
      }
          fetch("http://"+address)
          .then(res => res.text()) 
          .then(body => parseTitle(body)) 
          .then(title => {
               fs.appendFile('lists.html', "<br> <li>"+ title + "</li>", function (err) {
            if (err) throw err;
            console.log('Saved!');
          })
        

        }) 
          .catch((e) =>    {fs.appendFile('lists.html', "<br> <li> 404: site not found  </li>", function (err) {
            if (err) throw err;
            console.log('Saved!')
            console.log(e);
          })}) ;
    
        
    
    res.writeHead(200, {'content-type': 'text/html' });
    
    fs.readFile('lists.html', (err,data)=>{
        if(err){
            res.writeHead(404);
            res.write('Error: File not found'); 
        }
        else{            
            res.write(data);
        }
        res.end();
    });
}
else{
 
    res.write('Error: invalid route'); 
    res.end()
}


});
  




server.listen(port,(error) => {
        if(error){
            console.log('something went wrong ', error);
        }
        else{
            console.log('server is listening on port ' + port);
        }
    });


