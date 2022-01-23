import notFoundImage from "../images/404.png";

const NoMatch = () => {
  return (
    <div>
      <img src={notFoundImage} />
    </div>
  );
};

export default NoMatch;
