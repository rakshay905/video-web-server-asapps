// Angular requires Zone.js
const express = require('express');
var engines = require('consolidate');
const fetch = require('node-fetch')

const thirdPartyAPIURL = 'https://streamhub.to/api/';

// print process.argv
let isSsl= false;
process.argv.forEach(function (val, index, array) {
    // console.log("indexx:::;",index + ': ' + val);
    if(val == "ssl"){
        isSsl = true;
    }
});
  


var fs = require('fs');
var http = require('http');
var https = require('https');
// create express app
const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    'geolocation=(self), microphone=(self)'
  );
  next();
});

app.get("/api/file/list", async(req, res) => {
  console.log('333333333333333333333333333333 :: ', req.query.key)
  const method = 'GET'
  const url = thirdPartyAPIURL + 'file/list' + '?key=' + req.query.key;
  const headers = {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
  const json = await fetch(url, {method, headers}).then(res=> res.text());
  console.log(json)// use it somehow 
  console.log('232323232 ', JSON.parse(json));
  // res.setHeader('Content-Type', 'application/json')
  res.end(json)
});

app.get("/api/folder/list", async(req, res) => {
  const method = 'GET'
  let url = thirdPartyAPIURL + 'folder/list' + '?key=' + req.query.key;
  if (req.query.fld_id) url = url + '&fld_id=' + req.query.fld_id;
  if (req.query.files) url = url + '&files=' + req.query.files;
  const headers = {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
  const json = await fetch(url, {method, headers}).then(res=> res.text());
  console.log(json)// use it somehow 
  console.log('232323232 ', JSON.parse(json));
  // res.setHeader('Content-Type', 'application/json')
  res.end(json)
});

app.engine('html', engines.mustache);

app.set('view engine', 'html');
// app.set('views', 'dist/adit-material-app');
// server static files
// app.use(express.static(__dirname + '/dist/adit-material-app', { index: false }));
// app.use(express.static('./', { index: false }));

// return rendered index.html on every request
// app.get('*', (req, res) => {
//     res.render('index', { req, res });
//     // console.log(`Nitin :: new GET request at : ${req.originalUrl}`);
// });
// app.get("/api", (req, res) => {
//   res.sendFile(__dirname + "/");
// });
//apis


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/app");
});

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });
// app.get("/phone.css", (req, res) => {
//     res.sendFile(__dirname + "/phone.css");
// });
// app.get("/phone.js", (req, res) => {
//     res.sendFile(__dirname + "/phone.js");
// });
// app.get("/sw.js", (req, res) => {
//     res.sendFile(__dirname + "/sw.js");
// });
app.use('/', express.static(__dirname + '/app'));
app.use('/lang', express.static(__dirname + '/lang'));
app.use('/icons', express.static(__dirname + '/icons'));
function getArgs () {
  const args = {}
  process.argv
    .slice(2, process.argv.length)
    .forEach( arg => {
      // long arg
      if (arg.slice(0,2) === '--') {
        const longArg = arg.split('=')
        args[longArg[0].slice(2,longArg[0].length)] = longArg[1]
      }
     // flags
      else if (arg[0] === '-') {
        const flags = arg.slice(1,arg.length).split('')
        flags.forEach(flag => {
          args[flag] = true
        })
      }
    })
  return args
}
const args = getArgs()
// start server and listen
// app.listen(3000, () => {
//     console.log('Angular server started on port 3000');
// });

let port = args.port||4200;
// console.log("isSsl::",isSsl);
const server = http.createServer(app).listen(port, () => {
  console.log('server running at ' + port)
})

// your express configuration here

// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

// httpServer.listen(3000);
// httpsServer.listen(4000);