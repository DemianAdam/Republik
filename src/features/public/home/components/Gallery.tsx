const galleryImages = [
  '/Gallery/gallery-1.webp',
  '/Gallery/gallery-2.webp',
  '/Gallery/gallery-3.webp',
  '/Gallery/gallery-4.webp',
  '/Gallery/gallery-5.webp',
  '/Gallery/gallery-6.webp',
];

export default function Gallery() {
  return (
    <section className="relative bg-black py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="text-red-600">Experiencia</span> Republik
          </h2>
          <p className="text-xl text-gray-400">Vive las noches más inolvidables</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            >
              <img
                src={image}
                alt={`Republik ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-red-600/0  transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
