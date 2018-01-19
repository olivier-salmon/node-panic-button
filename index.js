const dash_button = require("node-dash-button");
const Nexmo = require("nexmo");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
  applicationId: process.env.NEXMO_APPLICATION_ID,
  privateKey: process.env.NEXMO_PRIVATE_KEY
},{debug:true});

const nexmoSMS = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET,
},{debug:true})

var dash = dash_button(process.env.AMAZON_DASH_MAC_ADDR, null, null, "udp");
dash.on("detected", function() {
  console.log("Call triggered");
  nexmo.calls.create(
    {
      to: [
        {
          type: "phone",
          number: process.env.ALERT_RECIPIENT_NUMBER
        }
      ],
      from: {
        type: "phone",
        number: process.env.NEXMO_FROM_NUMBER
      },
      answer_url: [`${process.env.DOMAIN}/answer`],
      event_url: [`${process.env.DOMAIN}/event`]
    },
    function(err, data) {
      if (err) {
      	console.log(err.body.invalid_parameters[0])
        throw err;
      }
      if (data.status == 'started') {
        console.log("Call made");
      } else {
        console.log(data);
      }
    }
  );
});

// Serve NCCO and handle events
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/event", (req, rs) => {
    if (req.body.to) {
    console.log(`Call from ${req.body.from} to ${req.body.to} is ${req.body.status}`);
}
});

app.get("/answer", (req, res) => {
  res.json([
    {
      action: "talk",
      text: "Press 1 followed by hash if you want to text your emergency contact",
      voiceName: "Amy",
        bargeIn: false
    },
    {
        action: "talk",
        text: "Press 2 followed by hash if you want to call your emergency contact",
        voiceName: "Amy",
        bargeIn: true
    },
    {
        action: "talk",
        text: "Press 3  followed by hash  if you pressed the button by error or if you don't need help",
        voiceName: "Amy",
        bargeIn: true
    },
    {
        action: "input",
        submitOnHash: true,
        eventUrl: ["http://oli.ngrok.io.ngrok.io/ivr"]
    }
  ]);
});

app.post("/ivr", (req, res) => {
    //console.log(`Body ${req.body}`);
    //console.log(req.query);
    const util = require('util');
    console.log(util.inspect(req.body, {depth: 3}));
    console.log(`Input ${req.body.dtmf}`);

if (req.body.dtmf) {
    //Create an NCCO in function of the button pressed by your user
    if (req.body.dtmf == '1') {
        nexmoSMS.message.sendSms(process.env.SENDER_ID, process.env.USER_NUMBER, "Someone you know needs your help urgently");
        res.json([
            {
                "action": "talk",
                "text": "Thank you, we've sent a text to your emergency contact",
                "voiceName": "Amy"
            }
        ]);
    } else if (req.body.dtmf == '2') {
        res.json([
            {
                "action": "talk",
                "text": "Thank you, I'll forward you to your emergency contact",
                "voiceName": "Amy"
            },
            {
                "action": "connect",
                "eventUrl": ["http://oli.ngrok.io.ngrok.io/event"],
                "from": "447520618978",
                "endpoint": [
                    {
                        "type": "phone",
                        "number": "441344309374"
                    }
                ]
            }
        ]);
    }
    ;
};
});

app.listen(3000, () => console.log("Panic Button listening on port 3000!"));
