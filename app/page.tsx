import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandsCloud } from "@/components/BrandsCloud";
import { Services } from "@/components/Services";
import { Models } from "@/components/Models";
import { Russian } from "@/components/Russian";
import { About } from "@/components/About";
import { Formats } from "@/components/Formats";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
    <main id="home" tabIndex={-1}>
      <Hero />
      <BrandsCloud />
      <Services />
      <Models />
      <Russian />
      <About />
      <Formats />
      <Faq />
    </main>
    <Footer />
    </>
  );
}
