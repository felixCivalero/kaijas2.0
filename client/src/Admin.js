import React, { useState } from "react";
import "./App.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import ReadMoreReadLess from "./ReadMoreReadLess";

const stringBlack = require("./assets/codeString-01.png");
const stringWhite = require("./assets/codeString-02.png");

const circles = require("./assets/TESTing-02.png");
const stripes = require("./assets/stripes.png");
const pacMan = require("./assets/pacMan.png");
const BlueStripes = require("./assets/BlueStripes.png");
const BWPacman = require("./assets/BWpacMan.png");
const BWstripes = require("./assets/BWstripes.png");

function Admin() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [desc, setDesc] = useState("");

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const uploadArtistInfo = document.querySelector(".input__concert");
  const welcome = document.querySelector(".welcome");
  const errorMsg = document.querySelector(".err__msg");
  const loginContainer = document.querySelector(".login__container");

  function displayArtistInput(e) {
    e.preventDefault();
    console.log(pwd, user);
    if (pwd === 1234 && user === "info") {
      loginContainer.classList.add("hidden");
      uploadArtistInfo.classList.remove("hidden");

      setUser("");
      setPwd("");
    } else {
      errorMsg.classList.remove("hidden");
      welcome.classList.add("hidden");
      setUser("");
      setPwd("");

      setTimeout(() => {
        errorMsg.classList.add("hidden");
        welcome.classList.remove("hidden");
      }, 2000);
    }
  }

  const addArtist = async () => {
    await Axios.post("http://localhost:3001/api/uploadArtist", {
      name: name,
      genre: genre,
      price: price,
      date: date,
      time: time,
      desc: desc,
    }).then(() => {
      alert("Din spelning är uppladad.");
      return navigate("/");
    });
  };

  let artWork;
  let strings = stringBlack;
  let cssStyle = 1;

  if (genre.toLowerCase().includes("jazz")) {
    artWork = circles;
  } else if (genre.toLowerCase().includes("pop")) {
    artWork = pacMan;
    cssStyle = 2;
    strings = stringWhite;
  } else if (genre.toLowerCase().includes("hip hop")) {
    artWork = BlueStripes;
    cssStyle = 2;
    strings = stringWhite;
  } else if (genre.toLowerCase().includes("indie")) {
    artWork = BWPacman;
    cssStyle = 2;
    strings = stringWhite;
  } else if (genre.toLowerCase().includes("opera")) {
    artWork = BWstripes;
    cssStyle = 2;
    strings = stringWhite;
  } else {
    artWork = stripes;
  }

  return (
    <div className="first__page ">
      <div className="login__container">
        <nav>
          <p className="welcome">Admin? Logga in här</p>
          <p className="err__msg hidden">Fel inlogg..</p>
          <form className="login">
            <input
              type="text"
              name="user"
              placeholder="Email.."
              className="login__input login__input--user"
              onChange={(event) => {
                setUser(event.target.value);
              }}
            />
            <input
              type="password"
              name="pwd"
              placeholder="PIN.."
              className="login__input login__input--pin"
              onChange={(event) => {
                setPwd(+event.target.value);
              }}
            />
            <button
              className="login__btn"
              onClick={(e) => {
                e.preventDefault();
                if (!pwd || !user) return;
                displayArtistInput(e);
              }}
            >
              &rarr;
            </button>
          </form>
        </nav>
      </div>

      <div className="input__concert hidden">
        <div className="concert__input--form">
          <div className="artist__box">
            <input
              type="text"
              name="name"
              placeholder="Bandets namn"
              className="input__artist--name"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <input
              type="text"
              name="genre"
              placeholder="Genre"
              className="input__artist--genre"
              onChange={(event) => {
                setGenre(event.target.value);
              }}
            />
            <input
              type="text"
              name="price"
              className="input__artist--price"
              placeholder="Biljettpris"
              onChange={(event) => {
                setPrice(event.target.value);
              }}
            />
            <input
              type="date"
              name="date"
              className="input__artist--date"
              onChange={(event) => {
                setDate(event.target.value);
              }}
            />
            <input
              type="time"
              name="time"
              className="input__artist--time"
              onChange={(event) => {
                setTime(event.target.value);
              }}
            />
            <textarea
              type="text"
              name="desc"
              placeholder="Ge en målande beskrivning på max 600 tecken :)"
              className="input__artist--desc"
              maxLength={"600"}
              onChange={(event) => {
                setDesc(event.target.value);
              }}
            ></textarea>
            <div className="btn__container">
              <button className="artists--btn" onClick={addArtist}>
                Ladda upp
              </button>
            </div>
          </div>

          <div key={2} className={`artists__bkgr bkgr__color--${cssStyle}`}>
            <div className={`artists__container artists__container`}>
              <img
                alt="Kaijas Ticked Code"
                className="code__img"
                src={artWork}
              ></img>
              <h1 className="artists__genre">{genre.toUpperCase()}</h1>
              <h1 className="artists__name">{name.toUpperCase()}</h1>
              <h2 className="artists__date">{date}</h2>

              <ReadMoreReadLess>{desc}</ReadMoreReadLess>

              <p className={`artists__time--${cssStyle} hover`}>
                <strong>{`${price} SEK / ticket`}</strong>
              </p>

              <img
                alt="Kaijas Ticked Code"
                className="code__img"
                src={strings}
              ></img>

              {/* <p className="artists__price">TICKET {price} SEK</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
