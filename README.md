# Dette er vores README fil til projektet JOE & THE JUICE

## Introduktion
Velkommen til vores JOE & THE JUICE projekt!
Dette projekt er en web applikation der tillader brugere at se menu, placerer ordrer, se lokationer og melde sig til nyhedsbrev. Denne applikation er bygget på Node.js og Express.js og filbaseret database med SQLite.

## Installering af Node packages 
Sørg for at du har de korrekte depenencies i projektet. Kør derfor følgende kommando i terminalen: 

    npm install

# .ENV FIL
For at kunne køre projektet, og benytte dens fulde funktionalitet kræves det i .env filen har følgende variabler:
    EMAIL_USER
    EMAIL_PASS
    TWILIO_ACCOUNT_SID
    TWILIO_AUTH_TOKEN
    TWILIO_PHONE_NUMBER
    TWILIO_VERIFY_SERVICE_SID
    JWT_SECRET
    BCRYPT_SALT_ROUNDS

# OPSTART AF APPLIKATION
For at starte vores applikation åbnes terminalen og indtaster følgende kommando: 

    node app.js

Herefter skulle der Consol.log() oplysninger, som at load balancer kører, og at der er connected til SQLite database.

# Struktur for projekt 
joe-server/
├── DB/
│   ├── createsignup.js
│   ├── createtable.js
│   ├── modifOrders.js
│   ├── newsletterDB.db
│   ├── prodOrd.js
│   ├── updateSchema.js
│   └── users.db
├── middleware/
│   └── authenticateToken.js
├── public/
│   ├── scripts/
│   │   ├── index.js
│   │   ├── locations.js
│   │   ├── menu.js
│   │   ├── orders.js
│   │   ├── signup.js
│   │   ├── navbar.js
│   │   ├── newsletter.js
│   │   ├── orders.js
│   │   ├── profile.js
│   │   └── signup.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── menu.css
│   │   ├── newsletter.css
│   │   ├── orders.css
│   │   └── signup.css
│   ├── index.html
│   ├── locations.html
│   ├── login.html
│   ├── menu.html
│   ├── newsletter.html
│   ├── orders.html
│   ├── profile.html
│   └── signup.html
├── Routes/
│   ├── loginRoutes.js
│   ├── newsletterRoutes.js
│   ├── ordersRoutes.js
│   ├── protectedRoutes.js
│   ├── signupRoutes.js
│   └── twilioRoutes.js
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md







