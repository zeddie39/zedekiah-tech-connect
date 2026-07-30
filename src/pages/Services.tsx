import Services from "@/components/Services";
import SEO from "@/components/SEO";

export default function ServicesPage() {
  return (
    <>
      <SEO
        title="Our Services"
        description="Explore ZTech Electronics' full range of ICT services: web development, phone & laptop repair, CCTV installation, networking, smart home automation, and more."
        keywords="ZTech services, phone repair Kenya, laptop repair, CCTV installation, web development, networking services"
      />
      <Services />
    </>
  );
}
