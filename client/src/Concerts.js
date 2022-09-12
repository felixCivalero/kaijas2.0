import React, { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import GoToTop from "./GoToTop";
import { motion } from "framer-motion";

const circles = require("./assets/TESTing-02.png");
// const stripes = require("./assets/testingigen-02.png");
// const pacMan = require("./assets/testingigen-03.png");
const acceptedPayments = require("./assets/paymentMethod.png");

function Concerts() {
  const params = useParams();
  const [concert, setConcert] = useState([]);
  const [bookingName, setBookingName] = useState("");
  const [bookingMail, setBookingMail] = useState("");
  const [bookingTel, setBookingTel] = useState("");
  const [bookingComment, setBookingComment] = useState("");
  const [bookingAmount, setBookingAmount] = useState("");

  const waitingList = async (val) => {
    await Axios.post("https://kaijasalong.com/api/uploadWaiting", {
      bookingName: bookingName,
      bookingMail: bookingMail,
      bookingTel: bookingTel,
      bookingComment: bookingComment,
      bookingAmount: bookingAmount,
      waitingEventName: val.artists_name,
      waitingEventDate: val.artists_date,
      waitingEventTime: val.artists_time,
      waitingEventId: val.artists_id,
    }).then(() => {
      alert(
        "You have succesfully signed up to the waiting list. A comfirmation email was sent, check junk mail in case."
      );
      window.location.href = "/";
    });
  };

  const displayCart = (val) => {
    const cart = document.querySelector(".cart__div");
    console.log(val);
    if (val === "-") {
      cart.classList.add("hidden");
    } else {
      cart.classList.remove("hidden");
    }
  };

  useEffect(() => {
    fetchConcert();

    // eslint-disable-next-line
  }, []);

  const fetchConcert = async () => {
    await Axios.get(`https://kaijasalong.com/api/getArtist`, {
      params: params,
    }).then((response) => {
      setConcert(response.data[0]);
    });
  };

  const book = async (val) => {
    await Axios.post("https://kaijasalong.com/api/uploadBooking", {
      guestsName: bookingName,
      guestsMail: bookingMail,
      guestsTel: bookingTel,
      guestsComment: bookingComment,
      amount: bookingAmount,
      bookingEventId: val.artists_id,
      bookingEventName: val.artists_name,
      bookingEventDate: val.artists_date,
      bookingEventTime: val.artists_time,
      bookingEventMax: val.max_guests,
      totalPrice: val.artists_price * bookingAmount,
    }).then((res) => {
      updateConcert(res.data.bookingEventId, res.data.bookingEventMax);
    });
  };

  const updateConcert = (concertId, maxGuests) => {
    const updateCapacity = maxGuests - bookingAmount;
    Axios.post("https://kaijasalong.com/api/updateConcert", {
      id: concertId,
      capacity: updateCapacity,
    });
  };
  const randomNumber = Math.floor(Math.random() * 4) + 1;

  const payNow = async (val) => {
    await Axios.post("https://kaijasalong.com/api/create-checkout-session", {
      guestsName: bookingName,
      guestsMail: bookingMail,
      guestsTel: bookingTel,
      guestsComment: bookingComment,
      amount: bookingAmount,
      bookingEventId: val.artists_id,
      bookingEventName: val.artists_name,
      bookingEventDate: val.artists_date,
      bookingEventTime: val.artists_time,
      bookingPrice: val.artists_price,
      totalPrice: val.artists_price * bookingAmount,
    })
      .then((res) => {
        if (res.status === 200) {
          book(concert).then(() => {
            window.location.href = res.data.url;
          });
        }
      })
      .catch((err) => console.log(err.message));
  };

  let availableSeats;
  if (concert.max_guests === "0") {
    availableSeats = "Fully booked*";
  } else if (concert.max_guests >= 10) {
    availableSeats = "More than 10 left";
  } else if (concert.max_guests < 10) {
    availableSeats = `Only ${concert.max_guests} tickets left`;
  }

  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`booking__page random__bkgr--${randomNumber}`}>
        <img
          alt="Kaijas Ticked Code"
          className="concert__icon"
          src={circles}
        ></img>

        <h1 className="concert__name">{concert.artists_name}</h1>
        <p>Date:</p>
        <p className="concert__date">
          <strong>{concert.artists_date}</strong>
        </p>
        <p>Ticket:</p>
        <p>
          <strong>{concert.artists_price} SEK</strong>
        </p>
        <p>Available:</p>
        <p>
          <strong>{availableSeats}</strong>
        </p>
        <p>On stage:</p>
        <p className="concert__time">
          <strong>{concert.artists_time}</strong>
        </p>
        <p className="concert__arrive">
          {concert.max_guests > 0
            ? "* Our space is limited! Please arrive well in time before the music starts. We want to be able to give you the best possible service we can."
            : `*You can sign up to ${concert.artists_name}'s waiting list. Start by choosing the amount of guests.`}
        </p>
        {/* <p className="artists__desc">"{concert.artists_desc}"</p> */}
        <p>Guests </p>
        <select
          className={`booking__input`}
          name="amount"
          onChange={(event) => {
            setBookingAmount(+event.target.value);
            displayCart(event.target.value);
          }}
        >
          <option value="-">-</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
        </select>

        <p>Name</p>
        <input
          className={`booking__input`}
          type="text"
          name="bookingName"
          placeholder="Full name"
          onChange={(event) => {
            setBookingName(event.target.value);
          }}
        ></input>

        <p>Email</p>
        <input
          className={`booking__input `}
          type="email"
          name="bookingMail"
          placeholder="Bokare@mail.com"
          onChange={(event) => {
            setBookingMail(event.target.value);
          }}
        ></input>
        <p>Phone </p>
        <input
          className={`booking__input`}
          type="text"
          name="bookingTel"
          placeholder="0707070707"
          onChange={(event) => {
            setBookingTel(event.target.value);
          }}
        ></input>
        <p>Comment</p>
        <textarea
          className={`booking__input textarea`}
          placeholder="Allergies etc.."
          name="bookingComment"
          onChange={(event) => {
            setBookingComment(event.target.value);
          }}
        ></textarea>
        <p className="concert__reserved">
          Your seats will be reserved for 10 min until payment
        </p>
      </div>
      <div className="cart__div hidden ">
        <Link to={"/"}>
          <p>🛒</p>
        </Link>
        <button
          className={`boka--btn`}
          onClick={(e) => {
            e.preventDefault();
            if (
              !bookingAmount &&
              !bookingName &&
              !bookingComment &&
              !bookingMail &&
              !bookingTel
            ) {
              return;
            }
            if (!bookingAmount || !bookingName || !bookingMail || !bookingTel) {
              alert("Fill in guests, name, number & phone");
              return;
            }
            if (isNaN(bookingAmount) === true) {
              alert("Enter a valid number of guests");
              return;
            }
            if (bookingAmount > concert.max_guests && concert.max_guests > 0) {
              alert(`There's only ${concert.max_guests} tickets left...`);
              return;
            }
            if (concert.max_guests <= 0) {
              waitingList(concert);
            }
            if (concert.max_guests > 0) {
              payNow(concert);
            }
          }}
        >
          {concert.max_guests > 0
            ? `Pay ${bookingAmount * concert.artists_price} SEK`
            : "Waiting List"}
        </button>
        <img
          alt="Accepted payments @ Kaijas"
          className="cart__payment"
          src={acceptedPayments}
        ></img>
      </div>
      <div>
        <Link to={"/"}>
          <button className="home__btn">{"< Go home"}</button>
        </Link>
      </div>
      <GoToTop />
    </motion.div>
  );
}

export default Concerts;
