const router = require('express').Router();
const { Router } = require('express');
const {google} = require('googleapis')

const GOOGLE_CLIENT_ID = '1006245137990-g8b15vk5bb9acmoqbqb5k7s3vnlnbcfa.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'
const REFRESH_TOKEN = '1//04UAUljXgEwn4CgYIARAAGAQSNwF-L9IrEAcM6hL4U12sfDh8aAOWThKCCB-VSldLuwoKdUqS6tSmfQIHHmDN6joKunscTygU1nQ'
const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:3000'
)

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/create-tokens', async (req, res, next)=>{
  try {
    const {code} = req.body
    const {tokens} = await oauth2client.getToken(code)
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})

router.post('/create-event', async (req, res, next)=>{
  try {
    const {summary, description, location, startDateTime, endDateTime} = req.body
    oauth2client.setCredentials({refresh_token: REFRESH_TOKEN})
    const calendar = google.calendar('v3')
    const response = await calendar.events.insert({
      auth: oauth2client,
      calendarId: 'primary',
      requestBody: {
        summary: summary,
        description: description,
        location:location,
        colorId: '7',
        start: {
          dateTime: new Date(startDateTime),
        },
        end: {
          dateTime: new Date(endDateTime),
        },
      },
    })
    res.send(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router;
