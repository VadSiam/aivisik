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

