import About from "@/components/About";
import SEO from "@/components/SEO";

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about ZTech Electronics Ltd., a professional ICT company in Kenya offering expert tech solutions, repairs, and installations since day one."
        keywords="about ZTech Electronics, ICT company Kenya, tech solutions team"
      />
      <About />
    </>
  );
}
