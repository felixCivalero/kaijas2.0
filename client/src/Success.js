import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

function Success() {
  return (
    <div>
      <h1>Thanks for your order!</h1>
      <p>We look forward seeing you @kaijas!</p>
      <p>
        <strong>Important!</strong> We have sent and comfirmation email,
        sometimes it ends up in the junk mail!
      </p>
      <p>
        Got questions?{" "}
        <a href="mailto:info@kaijasalong.com">info@kaijasalong.com</a>
      </p>
      <Link to={"/"}>
        <button>Go to homepage</button>
      </Link>
    </div>
  );
}

export default Success;
