const twilio = require("twilio");
require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");

// Twilio API nøgler
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Twilio client til afsendelse af velkomstbesked
const client = require("twilio")(accountSid, authToken);

// Twilio responses til webhook for opkald og beskeder
const MessagingResponse = require("twilio").twiml.MessagingResponse;

app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint for webhook til SMS beskeder
app.post("/sms", twilio.webhook({ validate: false }), (req, res) => {
    const twiml = new MessagingResponse();

    console.log(req.body);
    console.log("From: ", req.body.From);
    console.log("Country: ", req.body.FromCountry);
    console.log("Message: ", req.body.Body);
    //midlertidige menu
    const menu = `This is the JOE & THE JUICE menu:\n\n` +
        `1. Avokado Sandwich\n` +
        `2. Turkey Sandwich\n` +
        `3. Spicy Tuna Sandwich\n` +
        `4. Joes Club Sandwich\n` +
        `5. Serrano Sandwich\n` +
        `6. Tunacado Sandwich\n` +
        `7. Vegan Avocado Sandwich\n` +
        `8. Power Shake\n` +
        `9. Avo Shake\n` +
        `10. Unicorn Tears shake\n` +
        `11. The Nutty shake\n` +
        `12. Chocolate Flex shake\n` +
        `13. Beets & Berries shake\n` +
        `14. Big Matcha Energy shake`;

    const messageBody = req.body.Body.trim().toLowerCase();
    // Regex Mønster der matcher en ordre på formen "1 x Avokado Sandwich"
    const orderPattern = /^(\d+)\s*x\s*(.+)$/;
    // Matcher ordren i beskeden
    const match = messageBody.match(orderPattern);
    //Første del af beskeden er et nummer og anden del er en streng
    if (match) {
        const quantity = match[1];
        const item = match[2];
        const orderMessage = `You have ordered ${quantity} x ${item}. Thank you for your order!`;
        // Log ordren til konsollen --> Ændrer vi senere til at den kommer i database
        console.log(`Order received: ${quantity} x ${item}`);
        twiml.message(orderMessage);
    } else {
        const errorMessage = `Sorry, I didn't understand that. Please order by sending the number of the item and the quantity. For example: "1 x Avokado Sandwich".\n\n${menu}`;
        console.log("Invalid order format received.");
        twiml.message(errorMessage);
    }

    res.type("text/xml").send(twiml.toString());
});

