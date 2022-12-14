const express = require("express");
const app = express();
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const path = require("path");
const Stripe = require("stripe");
const bodyParser = require("body-parser");

//cors allow to send from front-end to my own API
const cors = require("cors");
require("dotenv").config({ path: "../.env" });
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// req from front-end to back-end
app.use(cors());

//parsin the json "buddy" sent from front-end to back-end
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
});

const transporter = nodemailer.createTransport({
  host: process.env.NM_HOST,
  port: process.env.NM_PORT,
  auth: {
    user: process.env.NM_USER,
    pass: process.env.NM_PASS,
  },
});

/*-----------------STRIPE STUFF */

app.post("/api/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    customer_email: req.body.guestsMail,
    submit_type: "pay",
    line_items: [
      {
        price_data: {
          currency: "sek",
          product_data: {
            name: req.body.bookingEventName,
          },
          unit_amount: req.body.bookingPrice * 100,
        },
        quantity: req.body.amount,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}checkout-success/`,
    cancel_url: `${process.env.CLIENT_URL}${req.body.bookingEventId}`,
  });
  res.send({ url: session.url });
});

/*-----------------UPLOAD CONCERT TO SERVER-----------*/
app.post("/api/uploadArtist", (req, res) => {
  const { name, genre, price, date, time, desc } = req.body;
  const options = {
    from: "do-not-reply@kaijasalong.com",
    to: "artist@kaijasalong.com",
    subject: `Koncert uppladdad! `,
    html: `<h1>${name} har precis lagt upp en koncert!</h1>
    <h3>S?? h??r ser det ut:</h3>
    <ul>
      <li>${name}</li>
      <li><strong>${genre}</strong></li>
      <li><strong>${date} ${time}</strong></li>
      <li><strong>${price}</strong></li>
    </ul>
    <p>${desc}</p>
<p>---------------------------</p>
    <p>F??r att redigera: Skrik till Felix!</p>
    <p>Vsg brysh,<br>Felix</p>
    `,
  };

  db.query(
    "INSERT INTO concerts (artists_name, artists_genre, artists_price, artists_date, artists_time, artists_desc, max_guests) VALUES (?,?,?,?,?,?,?)",
    [name, genre, price, date, time, desc, 25],
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send("Values Inserted");
        transporter.sendMail(options, function (err, info) {
          if (err) throw err;
        });
      }
    }
  );
});

//////// MAP CONCERTS ON FRON PAGE
app.get("/api/getConcert", (req, res) => {
  let currDate = new Date();
  let date =
    currDate.getFullYear() +
    "-" +
    ("0" + (currDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + currDate.getDate()).slice(-2);
  db.query(
    `select * from concerts where artists_date >= '${date}' ORDER BY artists_date`,
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send(result);
        res.end();
      }
    }
  );
});

////GET SINGLE CONCERT DYNAMICALLY
app.get("/api/getArtist", (req, res) => {
  const id = req.query.id;
  db.query(`select * from concerts where artists_id = ${id}`, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
      res.end();
    }
  });
});

////// UPLOAD BOOKING
app.post("/api/uploadBooking", (req, res) => {
  const {
    guestsName: bookingName,
    guestsMail: bookingMail,
    guestsTel: bookingTel,
    guestsComment: bookingComment,
    amount: bookingAmount,
    bookingEventId: eventId,
    bookingEventName: eventName,
    bookingEventDate: eventDate,
    bookingEventTime: eventTime,
    totalPrice,
  } = req.body;

  const options = {
    from: "do-not-reply@kaijasalong.com",
    to: bookingMail,
    subject: `Kaijas <> ${eventName}`,
    html: `<h1>Tack f??r din bokning ${bookingName.split(" ")[0]}!</h1>
    <h3>V??lkommen till svergies minsta live-scen!</h3>
    <ul>
      <li>Artist: <strong>${eventName}</strong></li>
      <li>Datum: <strong>${eventDate}</strong></li>
      <li>Tid: <strong>${eventTime}</strong></li>
      <li>Adress: <strong>Storgatan 44, Stockholm</strong></li>
    </ul>
    <p>Totalt biljettpris: ${totalPrice} kr</p>
    <p>N??r din betalning ??r genomf??rd kommer kvitto p?? mail.</p>
    <p>Vi ses snart!</p>
    <p>Med v??nliga h??lsningar,<br>Saga och Felix p?? Kaijas</p>

    <p>Har du fr??gor inf??r bes??ket? Ring <a href="tel:073-4233504">073-423 35 04</a> eller maila till <a href="mailto:info@kaijasalong.com">info@kaijasalong.com</a> s?? hj??lper vi dig!</p>
    <small>Biljetten ??terbetalas ej</small>
    `,
  };

  db.query(
    "INSERT INTO bookings (booking_name, booking_mail, booking_tel, booking_comment, booking_amount, booking_event_id) VALUES (?,?,?,?,?,?)",
    [
      bookingName,
      bookingMail,
      bookingTel,
      bookingComment,
      bookingAmount,
      eventId,
    ],
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send(req.body);

        transporter.sendMail(options, function (err, info) {
          if (err) {
            throw err;
          }
        });
      }
    }
  );
});

app.post("/api/updateConcert", (req, res) => {
  const { id, capacity: availability } = req.body;
  db.query(
    `UPDATE concerts SET max_guests = '${availability}' WHERE concerts.artists_id = '${id}';`,
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

/*-----------------UPLOAD BAND REGUEST TO SERVER AND EMAIL artist@kaijasalong.com-----------*/

app.post("/api/uploadBand", (req, res) => {
  const {
    bandName,
    bandContact,
    bandMail,
    bandTel,
    bandGenre,
    bandLink,
    bandSocial,
    bandDesc,
  } = req.body;
  const bandPIN = Math.floor(1000 + Math.random() * 9000);

  const options = {
    from: "do-not-reply@kaijasalong.com",
    to: "artist@kaijasalong.com",
    subject: `Ny f??rfr??gan: ${bandName}`,
    html: `<h1>${bandName} vill upptr??da p?? Kaijas!</h1>
    <h3>Info om bandet</h3>
    <ul>
      <li>Kontaktperson: <strong>${bandName}</strong></li>
      <li>Mail: <strong>${bandMail}</strong></li>
      <li>PIN-kod: <strong>${bandPIN}</strong></li>
      <li>Tel: <strong>${bandTel}</strong></li>
      <li>Genre: <strong>${bandGenre}</strong></li>
      <li>L??nk: ${bandLink}</li>
      <li>Social: ${bandSocial}</li>
    </ul>
    <h4>Beskrivning</h4>
    <p>${bandDesc}</p>

    <p>Vsg brysh,<br>Felix</p>
    `,
  };

  db.query(
    "INSERT INTO artists (band_name, contact_name, email, phone, genre, artists_link, band_social, band_desc, band_PIN) VALUES (?,?,?,?,?,?,?,?,?)",
    [
      bandName,
      bandContact,
      bandMail,
      bandTel,
      bandGenre,
      bandLink,
      bandSocial,
      bandDesc,
      bandPIN,
    ],
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send("Values Inserted");

        transporter.sendMail(options, function (err, info) {
          if (err) {
            throw err;
          }
        });
      }
    }
  );
});

/*-----------------UPLOAD v??nner TO SERVER and EMAIL confimration-----------*/

app.post("/api/uploadCostumer", (req, res) => {
  const { costumerName, costumerMail, costumerPhone, costumerInterest } =
    req.body;

  const options = {
    from: "do-not-reply@kaijasalong.com",
    to: costumerMail,
    subject: `Kaijas <3 ${costumerName.split(" ")[0]}`,
    html: `<h1>Du har registrerats som en av Kaijas v??nner</h1>
      <h3>Nu ??r du f??rst med att f?? nys om v??ra nyheter</h3>
     
      <p>Som Sveriges minsta live-scen blir v??ra intima konserter snabbt uts??lda. Som Kaijas-v??n f??r du information om v??ra spelningar och events f??re de publiceras offentligt. Du f??r ocks?? ta del av specialerbjudanden och b??ttre priser!</p>
  
      <p>Vi h??rs snart igen!<br>Felix och Saga p?? Kaijas</p>
      `,
  };

  db.query(
    "INSERT INTO vanner (costumer_name, costumer_email, costumer_phone, costumer_interest) VALUES (?,?,?,?)",
    [costumerName, costumerMail, costumerPhone, costumerInterest],
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send("Values Inserted");

        transporter.sendMail(options, function (err, info) {
          if (err) {
            throw err;
          }
        });
      }
    }
  );
});

app.post("/api/uploadWaiting", (req, res) => {
  const {
    bookingName,
    bookingMail,
    bookingTel,
    bookingComment,
    bookingAmount,
    waitingEventName,
    waitingEventDate,
    waitingEventTime,
    waitingEventId,
  } = req.body;

  const options = {
    from: "do-not-reply@kaijasalong.com",
    to: bookingMail,
    subject: `V??ntelista <> ${waitingEventName}`,
    html: `<h1>Tack ${
      bookingName.split(" ")[0]
    }, du ??r uppskriven p?? v??ntelistan!</h1>
    <h3>Svergies minsta live-scen!</h3>
    <ul>
      <li>Artist: <strong>${waitingEventName}</strong></li>
      <li>Datum: <strong>${waitingEventDate}</strong></li>
      <li>Tid: <strong>${waitingEventTime}</strong></li>
      <li>Adress: <strong>Storgatan 44, Stockholm</strong></li>
    </ul>
    <p>
    Vid eventuell avbokning g??r vi igenom v??ntelistan i turorning!
    </p>
    <p>Vi kanske h??rs snart! :)</p>
    <p>Med v??nliga h??lsningar,<br>Saga och Felix p?? Kaijas</p>

    <p>Har du fr??gor? Ring <a href="tel:073-4233504">073-423 35 04</a> eller maila till <a href="mailto:info@kaijasalong.com">info@kaijasalong.com</a> s?? hj??lper vi dig!</p>
    `,
  };

  db.query(
    "INSERT INTO waiting (waiting_name, waiting_mail, waiting_phone, waiting_amount, waiting_comment, waiting_event_id) VALUES (?,?,?,?,?,?)",
    [
      bookingName,
      bookingMail,
      bookingTel,
      bookingAmount,
      bookingComment,
      waitingEventId,
    ],
    (err, result) => {
      if (err) {
        throw err;
      } else {
        res.send("Values Inserted");

        transporter.sendMail(options, function (err, info) {
          if (err) {
            throw err;
          }
        });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Your server is running on server 3001");
});
