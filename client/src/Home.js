import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import Axios from "axios";
import { Link } from "react-router-dom";
import ReadMoreReadLess from "./ReadMoreReadLess";
import { motion } from "framer-motion";

const background = require("./assets/BakgrundJazz-min.png");
const logoWhite = require("./assets/Logo-white.png");
const slogan = require("./assets/slogan.png");

const stringBlack = require("./assets/codeString-01.png");
const stringWhite = require("./assets/codeString-02.png");

const circles = require("./assets/TESTing-02.png");
const stripes = require("./assets/stripes.png");
const pacMan = require("./assets/pacMan.png");
const BlueStripes = require("./assets/BlueStripes.png");
const BWPacman = require("./assets/BWpacMan.png");
const BWstripes = require("./assets/BWstripes.png");

const downArrow = require("./assets/arrow.png");

const insta = require("./assets/instagram.png");
const youtube = require("./assets/youtube.png");
const facebook = require("./assets/facebook.png");

function Home() {
  const [artistsList, setArtistsList] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [hovered, setHovered] = useState(false);
  const [costumerName, setCostumerName] = useState();
  const [costumerMail, setCostumerMail] = useState();
  const [costumerPhone, setCostumerPhone] = useState();
  const [costumerInterest, setCostumerInterest] = useState();
  const div = useRef();
  const popUp = useRef();

  /*---------------ADDING KAIJAS-FRIENDS TO DB-----------*/

  const addCostumer = () => {
    Axios.post("https://kaijasalong.com/api/uploadCostumer", {
      costumerName: costumerName,
      costumerMail: costumerMail,
      costumerPhone: costumerPhone,
      costumerInterest: costumerInterest,
    }).then(() => {
      alert(
        "Du är registrerad! Håll utkik i inkorgen för spännande nyheter :)"
      );
    });
  };

  const toggleHover = () => {
    setHovered(!hovered);
    if (!hovered) {
      div.current.style.borderRadius = "0%";
      div.current.style.width = "80%";
      div.current.style.paddingLeft = "10px";
      div.current.style.textAlign = "left";
    } else {
      div.current.style.borderRadius = "50%";
      div.current.style.width = "10%";
      div.current.style.textAlign = "center";
    }
  };

  useEffect(() => {
    fetchConcerts();
  }, []);

  setTimeout(() => {
    popUp.current.classList.remove("hidden");
  }, 6000);

  const fetchConcerts = async () => {
    await Axios.get("https://kaijasalong.com/api/getConcert").then(
      (response) => {
        setArtistsList(response.data);
      }
    );
  };

  const closeDiv = () => {
    popUp.current.classList.add("hidden");
  };

  return (
    <motion.div
      // initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0 }}
      transition={{ duration: 0.2 }}
      className="first__page"
    >
      <img
        alt="Kaijas Background"
        src={background}
        className="frontPage__bkgr--img"
      />
      <div className="center__div">
        <img
          alt="Kaijas logo"
          src={logoWhite}
          className="frontpage__logo"
        ></img>
        <img
          alt="Kaijas slogan"
          src={slogan}
          className="frontpage__slogan"
        ></img>
        <p className="frontpage__text">Stockholms tiniest live-stage</p>
      </div>
      <div className="socials">
        <a href="https://instagram.com/kaijasalong">
          {" "}
          <img alt="Kaijas Instagram" src={insta} className="IG"></img>
        </a>
        <a href="https://www.youtube.com/channel/UCO_zGTRaiQCafOBQrK9bIkA">
          <img alt="Kaijas Youtube" src={youtube} className="YT"></img>
        </a>
        <a href="https://module.lafourchette.com/sv_SE/module/742658-b98e8#/4815696/pdh">
          <img alt="Kaijas at The Fork" src={facebook} className="fork"></img>
        </a>
      </div>
      <div className="frontpage__contact">
        <a
          href="https://www.google.com/maps/place/Kaijas+Musiksalong/@59.333415,18.0906118,15z/data=!4m2!3m1!1s0x0:0x21196749cc621178?sa=X&ved=2ahUKEwiT94228Y_6AhWp_CoKHdYwCtAQ_BJ6BAhHEAU"
          className="frontpage__adress"
        >
          Storgatan 44, Östermalm
        </a>
        <a href="tel:0734233504" className="frontpage__email">
          +46 73-423 35 04
        </a>
        <a href="mailto:info@kaijasalong.com" className="frontpage__email">
          info@kaijasalong.com
        </a>
      </div>
      <div className="buttom__frontpage">
        <img
          alt="Kaijas Scroll thorugh concerts"
          src={downArrow}
          className="downArrow"
        />
      </div>
      <div className="concert__list" onClick={(e) => {}}>
        <div className="search__div">
          <input
            ref={div}
            className="input__search "
            placeholder="🔍"
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
            onChange={(event) => {
              setSearchName(event.target.value);
            }}
          ></input>
        </div>
        <div ref={popUp} className="pop-up__div hidden">
          <button
            className="close__btn"
            onClick={(e) => {
              closeDiv();
            }}
          >
            x
          </button>
          <div className="pop-up__close--div">
            <h2 className="pop-up__text">Bli Kaijas Vän!</h2>
            <p className="pop-up__text">
              Var först med nyheter, erbjudanden och konserter
            </p>
          </div>
          <div className="pop-up__form">
            <input
              className="costumer__input--name"
              type="text"
              name="costumerName"
              placeholder="För- & efternamn.."
              onChange={(event) => {
                setCostumerName(event.target.value);
              }}
            />
            <input
              className="costumer__input--mail"
              type="email"
              name="costumerMail"
              placeholder="Mail"
              onChange={(event) => {
                setCostumerMail(event.target.value);
              }}
            />
            <input
              className="costumer__input--tel"
              type="tel"
              name="costumerNumber"
              placeholder="Tel"
              onChange={(event) => {
                setCostumerPhone(event.target.value);
              }}
            />
            <textarea
              className="costumer__input--interest"
              type="text"
              name="costumerGenre"
              placeholder="Intresserad av"
              onChange={(event) => {
                setCostumerInterest(event.target.value);
              }}
            />
            <button
              type="submit"
              name="costumerButton"
              className="artists--btn"
              onClick={(e) => {
                e.preventDefault();
                if (
                  !costumerName &&
                  !costumerMail &&
                  !costumerInterest &&
                  !costumerPhone
                ) {
                  return;
                }
                if (!costumerName || !costumerMail || !costumerInterest) {
                  alert("Fyll i nog med fält så vi kan kontakta er!");
                  return;
                }
                addCostumer();
                closeDiv(e.target.parentElement.parentElement);
              }}
            >
              Bli vän!
            </button>
          </div>
        </div>
        {artistsList
          // eslint-disable-next-line
          .filter((val) => {
            if (searchName === "") {
              return val;
            } else if (
              val.artists_name.toLowerCase().includes(searchName.toLowerCase())
            ) {
              return val;
            } else if (
              val.artists_genre.toLowerCase().includes(searchName.toLowerCase())
            ) {
              return val;
            } else if (
              searchName.toLowerCase() === "j" ||
              searchName.toLowerCase() === "ja" ||
              searchName.toLowerCase() === "jan" ||
              searchName.toLowerCase() === "janu" ||
              searchName.toLowerCase() === "janua" ||
              searchName.toLowerCase() === "januar" ||
              searchName.toLowerCase() === "january"
            ) {
              return val.artists_date.includes(`-01-`);
            } else if (
              searchName.toLowerCase() === "f" ||
              searchName.toLowerCase() === "fe" ||
              searchName.toLowerCase() === "feb" ||
              searchName.toLowerCase() === "febr" ||
              searchName.toLowerCase() === "febru" ||
              searchName.toLowerCase() === "februa" ||
              searchName.toLowerCase() === "februar" ||
              searchName.toLowerCase() === "february"
            ) {
              return val.artists_date.includes(`-02-`);
            } else if (
              searchName.toLowerCase() === "m" ||
              searchName.toLowerCase() === "ma" ||
              searchName.toLowerCase() === "mar" ||
              searchName.toLowerCase() === "marc" ||
              searchName.toLowerCase() === "march"
            ) {
              return val.artists_date.includes(`-03-`);
            } else if (
              searchName.toLowerCase() === "a" ||
              searchName.toLowerCase() === "ap" ||
              searchName.toLowerCase() === "apr" ||
              searchName.toLowerCase() === "apri" ||
              searchName.toLowerCase() === "april"
            ) {
              return val.artists_date.includes(`-04-`);
            } else if (
              searchName.toLowerCase() === "m" ||
              searchName.toLowerCase() === "ma" ||
              searchName.toLowerCase() === "may"
            ) {
              return val.artists_date.includes(`-05-`);
            } else if (
              searchName.toLowerCase() === "j" ||
              searchName.toLowerCase() === "ju" ||
              searchName.toLowerCase() === "jun" ||
              searchName.toLowerCase() === "june"
            ) {
              return val.artists_date.includes(`-06-`);
            } else if (
              searchName.toLowerCase() === "j" ||
              searchName.toLowerCase() === "ju" ||
              searchName.toLowerCase() === "jul" ||
              searchName.toLowerCase() === "july"
            ) {
              return val.artists_date.includes(`-07-`);
            } else if (
              searchName.toLowerCase() === "a" ||
              searchName.toLowerCase() === "au" ||
              searchName.toLowerCase() === "aug" ||
              searchName.toLowerCase() === "augu" ||
              searchName.toLowerCase() === "augus" ||
              searchName.toLowerCase() === "august"
            ) {
              return val.artists_date.includes(`-08-`);
            } else if (
              searchName.toLowerCase() === "s" ||
              searchName.toLowerCase() === "se" ||
              searchName.toLowerCase() === "sep" ||
              searchName.toLowerCase() === "sept" ||
              searchName.toLowerCase() === "septe" ||
              searchName.toLowerCase() === "septem" ||
              searchName.toLowerCase() === "septemb" ||
              searchName.toLowerCase() === "septembe" ||
              searchName.toLowerCase() === "september"
            ) {
              return val.artists_date.includes(`-09-`);
            } else if (
              searchName.toLowerCase() === "o" ||
              searchName.toLowerCase() === "oc" ||
              searchName.toLowerCase() === "oct" ||
              searchName.toLowerCase() === "octo" ||
              searchName.toLowerCase() === "octob" ||
              searchName.toLowerCase() === "octobe" ||
              searchName.toLowerCase() === "october"
            ) {
              return val.artists_date.includes(`-10-`);
            } else if (
              searchName.toLowerCase() === "n" ||
              searchName.toLowerCase() === "no" ||
              searchName.toLowerCase() === "nov" ||
              searchName.toLowerCase() === "nove" ||
              searchName.toLowerCase() === "novem" ||
              searchName.toLowerCase() === "novemb" ||
              searchName.toLowerCase() === "novembe" ||
              searchName.toLowerCase() === "november"
            ) {
              return val.artists_date.includes(`-11-`);
            } else if (
              searchName.toLowerCase() === "d" ||
              searchName.toLowerCase() === "de" ||
              searchName.toLowerCase() === "dec" ||
              searchName.toLowerCase() === "dece" ||
              searchName.toLowerCase() === "decem" ||
              searchName.toLowerCase() === "decemb" ||
              searchName.toLowerCase() === "decembe" ||
              searchName.toLowerCase() === "december"
            ) {
              return val.artists_date.includes(`-12-`);
            }
          })
          .map((val, key) => {
            const name = val.artists_name;
            const genre = val.artists_genre;
            const price = val.artists_price;
            const date = val.artists_date;
            const desc = val.artists_desc;
            const id = val.artists_id;

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
              <div
                key={val.artists_id}
                className={`artists__bkgr bkgr__color--${cssStyle}`}
              >
                <div className={`artists__container artists__container--${id}`}>
                  <img
                    alt="Kaijas Ticked Code"
                    className="code__img"
                    src={artWork}
                  ></img>
                  <h1 className="artists__genre">{genre.toUpperCase()}</h1>
                  <h1 className="artists__name">{name.toUpperCase()}</h1>
                  <h2 className="artists__date">{date}</h2>

                  <ReadMoreReadLess>{desc}</ReadMoreReadLess>

                  <Link to={`/${id}`}>
                    <p className={`artists__time--${cssStyle} hover`}>
                      <strong>{`${price} SEK / ticket`}</strong>
                    </p>
                  </Link>

                  <img
                    alt="Kaijas Ticked Code"
                    className="code__img"
                    src={strings}
                  ></img>

                  {/* <p className="artists__price">TICKET {price} SEK</p> */}
                </div>
              </div>
            );
          })}
      </div>
      <div className="Footer">
        <h2>© Kaijas Salong AB</h2>
        <p>559335-9077</p>
        <p>073-423 35 04</p>
        <a href="https://www.google.com/maps/place/Kaijas+Musiksalong/@59.3334177,18.0884231,17z/data=!4m13!1m7!3m6!1s0x465f9d519442bf59:0xd2f26e85871509f8!2sStorgatan+44,+114+55+Stockholm!3b1!8m2!3d59.333415!4d18.0906118!3m4!1s0x465f9dee2af59155:0x21196749cc621178!8m2!3d59.333415!4d18.0906118">
          Storgatan 44, 114 55 Sthlm
        </a>
      </div>
      {/* <GoToTop /> */}
    </motion.div>
  );
}

export default Home;
