const express = require('express')
const router = express.Router()
const {
  promisify
} = require('util')
const {
  resolve
} = require('path')
const configSchema = require('../Bot/handler/dist/models/config')

const fs = require('fs')
const appendFile = promisify(fs.appendFile);
const dashboardLogsPath = resolve('./logs');
const sessionDate = new Date()
  .toISOString()
  .replace(/:/g, '');
const OAuthClient = require('./auth')
const AuthClient = new OAuthClient({
  clientId: "870380646042837052",
  clientSecret: "CCg-ACGuNY-xYbh1w8-p_hCimBrBng0_",
  redirectUri: "https://public.shadowsniper784.repl.co/api/auth",
});
router.get('/guild/:id/config',async (req,res)=>{
  let data = await configSchema.findById(req.params.id)
  res.json(data)
})
router.put('/guild/:id/config', async (req, res) => {
  if(!req.headers.Authorization) return res.status(403).json({error:'Unauthorised'})
  let guilds = await AuthClient.getUserGuilds(req.headers.Authorization)
  
  if(!guilds || !guilds[req.params.id] || !guilds[req.params.id].permissions == ) return res.status(403).json({error:'Invalid guild or user does not have permissions'})
  let body = req.body
  client.handler.setConfig(client.guilds.cache.get(req.params.id))
  configSchema.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          _id: req.params.id,
          ...data
        },
        {
          upsert: true,
        }
      )

  res.json({
    ...data,
    ...body
  })
})
router.post('/guilds', async (req, res) => {
  try {
    console.log(req.body)
    if (!req.body.access_token) return res.status(400).json({
      error: 'no access token'
    })
    const key = await AuthClient.getUserGuilds(req.body.access_token)

    res.json(key)
  } catch (e) {
    sendError(res, 400, e)
  }
});
router.post('/refresh', async (req, res) => {
  try {
    if (!req.body.refresh_token) return res.status(400).json({
      error: 'no refresh'
    })
    console.log(req.body)
    let data = await AuthClient.refresh(req.body.refresh_token)
    data.refresh_on = Date.now() + data.expires_in
    console.log('refresh data %o' + data)
    res.json(data)
  } catch (e) {
    sendError(res, 400, e)
  }
});
router.get('/auth', async (req, res) => {
  try {
    if (!req.query.code) return sendError(res, 400, new Error("No code"))
    res.redirect('http://localhost:3000/?code=' + req.query.code)
  } catch (error) {
    sendError(res, 400, error);
  }
});
router.get('/access', async (req, res) => {
  try {
    if (!req.query.code) return sendError(res, 400, new Error("No code"))
    const key = await AuthClient.getAccess(req.query.code.toString());
    key.refresh_on = Date.now() + key.expires_in
    res.json(key);
  } catch (error) {
    sendError(res, 400, error);
  }
});
router.post('/error', async (req, res) => {
  try {
    const {
      message
    } = req.body;

    await appendFile(`${dashboardLogsPath}`, Date.now().getTime() + ' ' + message + '\n');

    res.json({
      code: 200,
      message: 'Success!'
    });
  } catch (error) {
    sendError(res, 400, error);
  }
});

router.get('/invite', (req, res) =>
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${AuthClient.clientId}&redirect_uri=${encodeURI('https://public.shadowsniper784.repl.co')}/dashboard&permissions=8&scope=bot`));

router.get('/login', (req, res) => res.redirect('https://discord.com/api/oauth2/authorize?client_id=870380646042837052&redirect_uri=https%3A%2F%2Fpublic.shadowsniper784.repl.co%2Fapi%2Fauth&response_type=code&scope=identify%20guilds'));

router.get('*', (req, res) => res.status(404).json({
  code: 404
}));
async function sendError(res, code, error) {
  await appendFile(`${dashboardLogsPath}/latest.log`, ' ' + error.stack + '\n');
  return res.status(code).json({
    code,
    message: error.message
  })
}
module.exports = router