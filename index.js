global.version = 0.1
global.abortcontroller = require('abort-controller')
var beautify = require('js-beautify').js,
    fs = require('fs');

function b(){
  const getAllFiles = (dir, extension=null) => {
  const files = fs.readdirSync(dir, {
    withFileTypes: true,
  })
  let jsFiles = []

  for (const file of files) {
    if (file.isDirectory()) {
      jsFiles = [...jsFiles, ...getAllFiles(`${dir}/${file.name}`, extension)]
    } else if (
      file.name.endsWith(extension || '.js') &&
      !file.name.startsWith('!')
    ) {
      let fileName = file.name.replace(/\\/g, '/').split('/')
      fileName = fileName[fileName.length - 1]
      fileName = fileName.split('.')[0].toLowerCase()

      jsFiles.push([`${dir}/${file.name}`, fileName])
    }
  }

  return jsFiles
}
getAllFiles("/home/runner/public/Bot").forEach(e=>{
fs.readFile(e[0], 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    fs.writeFileSync(e[0], beautify(data, { indent_size: 2, space_in_empty_paren: true }));
})
})
}
//b()
const Discord = require('discord.js')
const {Intents, Client} = Discord
const client = new Client({
  intents: [
Intents.FLAGS.GUILDS,    Intents.FLAGS.GUILD_MESSAGES,    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ]
})
require('./Bot')(client)
const dashboard = true
/* Web app */
const express = require('express')
const app = express()
const cors = require("cors")
const bodyParser = require('body-parser')
app.use(cors({
  whitelist: ["*"]
}))
app.use(bodyParser.json())

app.use((req,res,next)=>{
  console.log(new Date().getHours() + ':' + new Date().getMinutes() + '  ' + req.url)
  next()
})
const api = require('./Api')
app.use(express.static('./dashboard/build'))
app.use('/api',api)
app.get('/',(req,res)=>{
  res.render('index')
  //
})
app.get('/dashboard/:id',(req,res)=>{
  res.render('index.html')
})
app.get('*',(req,res)=>{
  res.send(`<!DOCTYPE html>
<html>
<head>
  <title>The page you were looking for doesn't exist (404)</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
  body {
    height: 100%;
    width: 100%;
    background: #fefefe url('https://raw.githubusercontent.com/mhill426/free404/gh-pages/construction/construction.png') center bottom fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    color: #2E2F30;
    font-family: sans-serif;
    margin: 0;
  }

  footer {
    position: absolute;
    bottom: 1%;
    width: 100%;
    text-align: center;
    font-size: .6em;
    color: #fff
  }

  a {
    color: #fff;
  }

  a:hover {
    color: #393939;
  }

  .dialog {
    float:left;
    text-align: left;
    width: 50%;
    margin: 2% auto 0;
    padding-left: 10%;
  }

  h1 { 
    font-size: 3.5em;
    color: #393939;
    line-height: 1em;
  }

  h2 { 
    font-size: 2em;
    color: #393939;
    line-height:' .5em;
  }

  p {
    font-size: 1.4em;
    color: #393939;
    
  }
  
  @media only screen and (max-width: 767px) {
    .dialog {
    float:none;
    text-align: center;
    width: 90%;
  }
  }  
  </style>
</head>

<body>
  <!-- This file lives in public/404.html -->
  
  <div>
    <div class="dialog">
      <h1>Oops!</h1>
      <p>We were unable to find the page you were looking for, but working hard to resolve this issue.</p>
    </div>
  </div> 
</body>
</html>`)
})
if(dashboard) app.listen()
client.login(client.token)
module.exports = client