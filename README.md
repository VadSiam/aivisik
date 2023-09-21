# AIVisik

## About function which generating AI image by random country ggl trends and post it to insta

## Installation

```bash
$ npm install
```

add .env file - check .example_env file

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deploy to AWS Lambda function

```bash

$ npm run build
# it will create 'dist' dir with full build

# move to 'dist' dir file 'package copy.json' and change name to 'package.json'
# then 
$ cd dist && npm i

# make .zip file from 'dist' dir
# upload to AWS lambda function via AWS dashboard this .zip file
# change the path to lambda 'handler' function in AWS dashboard - 'your func page -> Code -> Runtime settings -> Edit -> in "Handler" field change to "dist/lambda.handlerFunc" -> save'
# in same function page add all env vars from .env file
# in AWS lambda func add trigger by time (Cron) - "EventBridge (CloudWatch Events)
# in AWS func dashboard run test - should work
```

################

'https://developers.facebook.com/tools/explorer?method=GET&path=me%3Ffields%3Did%2Cname&version=v16.0' 

Facebook does provide a way to extend the lifespan of an Access Token. Here's a step-by-step process to obtain a long-lived token using the Facebook Graph API:

Get Short-Lived Token:

Navigate to the Graph API Explorer.
Select your app from the top-right corner.
Click on "Generate Access Token".
You'll receive a short-lived token.
Convert Short-Lived Token to Long-Lived Token:

Use the following endpoint:

bash
Copy code
https://graph.facebook.com/v16.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}
Replace {app-id}, {app-secret}, and {short-lived-token} with your App ID, App Secret, and the short-lived token you got from step 1 respectively.

Make a GET request to this endpoint, either by pasting it in your browser or using tools like Postman.

If successful, the response will contain the long-lived token.

Confirm Token Longevity:

You can inspect your new long-lived token's info (such as expiration) using the following:

Copy code
https://graph.facebook.com/debug_token?input_token={long-lived-token}&access_token={your-app-access-token}
Replace {long-lived-token} with your new token and {your-app-access-token} with an access token for your app.

Making a GET request to this URL will give you information about the token, including its expiration time.

Note:

Security Caution: Never expose your client_secret or any access tokens. Use server-side code to exchange the short-lived token for a long-lived token to ensure your app credentials remain confidential.
The long-lived user access token, once retrieved, will last for about 60 days.
Remember to handle these tokens with care due to security implications!

## {app-id}: 
This represents your Facebook App ID. In the given "App Token", the part before the pipe (|) character is the App ID. So, in your case, the {app-id} would be:

Copy code
209143678289800
## {app-secret}: 
Navigate to the Facebook Developers Portal:
Open your browser and head to Facebook Developers.

Log In:
If you're not already logged in, click on "Log In" in the top right corner and sign in with your Facebook credentials.

Select Your App:
Once logged in, you'll see a list of your apps in the top right corner. Click on the app for which you want to retrieve the App Secret.

Access App Settings:
On the left sidebar, click on the "Settings" dropdown and then select "Basic".

Locate App Secret:
On this page, you'll see various details about your app. One of them is the "App Secret". For security reasons, it will be hidden by default.

Reveal App Secret:
Next to the hidden App Secret, there will be a "Show" button. Click on it. Facebook might prompt you to enter your Facebook password again to reveal the App Secret.

Take Note and Be Cautious:
Once the App Secret is revealed, you can take note of it. Always remember to never share this key publicly or with unauthorized individuals. Treat it as you would any password.

Important Note: The App Secret allows complete access to your Facebook app, which could be misused if it falls into the wrong hands. Always ensure you keep it confidential and only use it in secure server-side operations.
