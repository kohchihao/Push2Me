require('dotenv').config()
const Telegraf = require('telegraf')
const express = require('express')
var bodyParser = require("body-parser");
var multer  = require('multer')
var path = require("path");
var uuid = require("uuid");
const fs = require('fs');
const app = express()

const bot = new Telegraf(process.env.PUSH2ME_BOT_TOKEN)
const Markup = new Telegraf.Markup();
const Extra = new Telegraf.Extra()
app.use(express.static('public'))
bot.telegram.setWebhook(process.env.PUSH2ME_WEBHOOK)
app.use(bot.webhookCallback(process.env.PUSH2ME_WEBHOOK_CALLBACK))

var keyboard = []
var kx = [Markup.urlButton("Donate here","https://www.paypal.me/ChiHao")]
keyboard.push(kx)

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, uuid.v4() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage, fileFilter: function (req, file, cb) {

    var filetypes = /jpeg|jpg|png/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(null,false)
  } })

 app.get('/',(req,res) => {
 	res.send("Application is working fine")
 })

app.get('/:telegramId/:message', (req, res) => {
  var telegramId = req.params.telegramId 
  var message = req.params.message
  bot.telegram.sendMessage(telegramId,message,Markup.inlineKeyboard(keyboard).extra())
  .then((data)=>{ //successfully sent 
  	console.log(data)
  	res.status(200).json({status : 200})
  }).catch(function(reason){ //promise catch function 
  	console.log(reason)
  	console.log(reason.code)
  	res.status(reason.code).json({ status: reason.code , description: reason.description });
  })

})

app.post('/:telegramId/image', upload.single('image'), function(req, res, next) {

    if(req.file){
		console.log("files = ", req.file.filename)
		var telegramId = req.params.telegramId 
		bot.telegram.sendPhoto(telegramId,{
			source: fs.createReadStream('uploads/'+req.file.filename)
		},Markup.inlineKeyboard(keyboard).extra()).then((data)=>{ //successfully sent 
  			console.log(data)
  			res.status(200).json({status : 200})
  		}).catch(function(reason){ //promise catch function 
			console.log(reason)
			console.log(reason.code)
			res.status(reason.code).json({ status: reason.code , description: reason.description });
		})
		

		fs.unlink('uploads/'+req.file.filename, (err) => {
		  if (err) throw err;
		  console.log('successfully deleted ' + req.file.filename)
		});

		
    }else {
    	console.log("key doesnt exist | wrong file format")
    	res.status(400).json({status:400 , description: "image field does not exist or wrong file format. Only jpeg/jpg/png are supported"})
    }
    
   	
    // res.status(204).end()
    
});

bot.command('start',(ctx) => {
	var telegram_id = ctx.message.chat.id

	ctx.reply("Hello! Welcome to Push2Me 😁 To start using this bot as your push notification it's easy 😉 \n\nThis will be your personal url https://push2mebot.herokuapp.com/" + telegram_id)

	ctx.reply("Here are some examples to get you started off. \n\nIf you want to send yourself some text message, it's easy just send it to your url in this manner https://push2mebot.herokuapp.com/"+telegram_id+encodeURI("/wow this is how you get a message") 
	 	+ "\n\nRemember to always URI encode your messages")

	ctx.replyWithPhoto({url: 'https://push2mebot.herokuapp.com/images/push2me_phone.png'})

	
 
})

bot.command('supportme',(ctx)=>{
  var keyboard = []
  var kx = [Markup.urlButton("Donate here","https://www.paypal.me/ChiHao")]
  keyboard.push(kx)
  ctx.replyWithMarkdown("If you love this service and use it on a regular basis. Please consider donating. Thanks for supporting me and my server :)",Markup.inlineKeyboard(keyboard).extra())
})

bot.command('contactme',(ctx)=>{
  ctx.reply("You can ping me at @kohchihao")
})



bot.command('help', (ctx) => {
	var telegram_id = ctx.message.chat.id

	ctx.reply("This is your personal URL incase you've forgotten https://push2mebot.herokuapp.com/" + telegram_id)

	ctx.reply("If you want to send yourself some text message, it's easy just send it to your url in this manner https://push2mebot.herokuapp.com/"+telegram_id+encodeURI("/wow this is how you get a message")
		+ "\n\nRemember to always URI encode your messages"
		+ "\n\nPlease visit this website for more information")
})


// your express error handler
app.use(function(err, req, res, next) {
    // in case of specific URIError
    if (err instanceof URIError) {
        err.message = 'Failed to decode param: ' + req.url;
        err.status = err.statusCode = 400;

        res.status(err.status).json({status: err.status , description: err.message})
    } else {
        // ..
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log('App listening on port 5000!')
})


//bot.startPolling()
