import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <>
      <section id="home" className="hero text-center">
        <div className="container hero-content">
          <h1>Decentralization Devoid of Boundaries</h1>
          <p>
            Welcome to The Rich Crowd. Enter a domain where decentralization
            prevails, devoid of administrators, but abundant in opportunities.
          </p>
          <Link to="/register" className="btn">
            Join the Revolution
          </Link>
        </div>
      </section>
    </>
  );
};
export default Banner;
