import About from "@/components/About";
import Admins from "@/components/Admins";
import BranchSearch from "@/components/BranchSearch";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Office from "@/components/Office";
import Team from "@/components/Team";
// import Vacancy from "@/components/Vacancy";
import Why from "@/components/Why";

export default function Home() {
  return (
    <div>
      <Header />
      <Navbar />
      <Hero />
      <Why />
      <About />
      <Admins />
      <Team />
      {/* <Vacancy /> */}
      <Office />
      <BranchSearch />
      <Footer />
    </div>
  )
}