import Banner from "../Components/Banner";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import OurVision from "../Components/OurVision";
import Roadmap from "../Components/Roadmap";
import Technology from "../Components/Technology";
import TokenOverview from "../Components/TokenOverview";

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <OurVision />
      <TokenOverview />
      <Technology />
      <Roadmap />
      <Footer />
    </>
  );
};
export default Home;
