# node-panic-button
Code to run the Panic Button demo (Nexmo voice API, SMS API, Olympus)

Credits to Michael Heap and its DrDash code: https://github.com/mheap/DrDash


Installation
- set your button (Dash or AWS IoT) to use your WiFi
- get your button MAC ADDRESS

https://docs.aws.amazon.com/iot/latest/developerguide/configure-iot.html

Settings
- rename env file to .env
- set the environment variables (.env)

ALERT_RECIPIENT_NUMBER=

NEXMO_API_KEY=
NEXMO_API_SECRET=
NEXMO_APPLICATION_ID=
NEXMO_PRIVATE_KEY=./private.key
NEXMO_FROM_NUMBER=

OLYMPUS_FROM=
OLYMPUS_TO=

AMAZON_DASH_MAC_ADDR=

DOMAIN=

Run the demo
- run ngrok (e.g. ./ngrok http -subdomain=oli 3000)
- run sudo node index.js 
