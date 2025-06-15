
const Testimonials = () => (
  <section className="py-16 px-4 bg-muted text-center">
    <h2 className="text-2xl font-bold mb-6">Testimonials</h2>
    <div className="max-w-xl mx-auto flex flex-col gap-8">
      <blockquote className="bg-white p-6 rounded shadow">
        <p className="italic">"Fantastic service & fast repairs. My laptop feels brand new!"</p>
        <footer className="mt-4 font-semibold">- Sarah M.</footer>
      </blockquote>
      <blockquote className="bg-white p-6 rounded shadow">
        <p className="italic">"They set up CCTV for our shop quickly and professionally."</p>
        <footer className="mt-4 font-semibold">- Jacob K.</footer>
      </blockquote>
    </div>
  </section>
);

export default Testimonials;
