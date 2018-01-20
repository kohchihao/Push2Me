## Push2Me
So what can PUSH2ME bot do ? 2 things actually. Following the url endpoint, you can send text messages and photos to yourself. So why is this good? Out in vastness of the web, there are of course many solutions to having a push notification server. Like pushbullet , simplepush , etc . The main reason i did it on Telegram , it’s because i do not want another app on my phone anymore(it’s already full with photos).

Building it on Telegram have of course multiple benefits 

1. Available on most platforms (iOS/Android/Windows) 
2. Fast/Easy to build 
3. Easily deployable ( Don’t need to wait for hours for Apple/Google to approve) 
4. Chatbots are the future

## Some stuff it can work with

1. Use it with your existing Arduino projects! You can send notification about ANYTHING related to your Arduino project, temperature , humidity ,etc
2. Integrate it with your raspberry pi. You can send your server stats to yourself
3. Anything IOT , someone pressed your doorbell? You can simply send yourself a notification .
4. Have your own personal bot to look for stuff online and want to notify yourself? this can do it too!

## How to run this bot?

- Create an ``.env`` file in main directory
- Inside the ``.env`` put these 2 stuff inside 

```
PUSH2ME_WEBHOOK=your bot webhook 
PUSH2ME_WEBHOOK_CALLBACK=your bot callback
```

- ``npm install``
- ``node app.js``
