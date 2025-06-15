
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
    title: "Best Deals on Fashion & Accessories",
    desc: "Shop the latest trends at unbeatable prices.",
  },
  {
    src: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
    title: "Upgrade Your Home",
    desc: "Amazing discounts on furniture and home decor.",
  },
  {
    src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80",
    title: "Electronics Blowout",
    desc: "Top gadgets for less. Shop now!",
  },
];

export default function ShopHeroCarousel() {
  return (
    <div className="relative mb-10">
      <Carousel className="rounded-lg overflow-hidden">
        <CarouselContent>
          {carouselImages.map((img, idx) => (
            <CarouselItem key={idx}>
              <div className="w-full h-52 md:h-72 relative bg-gray-200 flex items-center justify-center">
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <h2 className="text-white text-xl md:text-3xl font-bold drop-shadow mb-2">{img.title}</h2>
                  <p className="text-white/80 md:text-lg">{img.desc}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
