import { useState } from "react";

const ReadMoreReadLess = ({ children }) => {
  const [isReadMoreShown, setReadMoreShown] = useState(false);

  const toggleBtn = () => {
    setReadMoreShown((prevState) => !prevState);
  };
  return (
    <div className="read-more-read-less">
      <p className={`artists__desc`}>
        {isReadMoreShown
          ? children.substring(0, 350)
          : children.substring(0, 40)}
        <button onClick={toggleBtn} className="read__more">
          {isReadMoreShown ? "READ LESS..." : "...READ MORE"}
        </button>
      </p>
    </div>
  );
};

export default ReadMoreReadLess;
