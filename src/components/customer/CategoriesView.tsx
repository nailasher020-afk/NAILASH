import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const CategoriesView: React.FC = () => {
  const { setSelectedCategory, setActiveView } = useStore();

  const categories = [
    {
      name: 'Women',
      tagline: 'Luxury Pret, Festive Couture & Fine Lawn',
      image: '/assets/cat_women_collection.jpg',
      count: '18 Designs'
    },
    {
      name: 'Men',
      tagline: 'Tailored Raw Silk Kurtas & Regal Prince Coats',
      image: '/assets/cat_men_collection.jpg',
      count: '12 Designs'
    },
    {
      name: 'New Arrivals',
      tagline: 'Spring / Summer 2026 Season Drops',
      image: '/assets/cat_new_arrivals.jpg',
      count: '8 Limited Pieces'
    },
    {
      name: 'Festive Pret',
      tagline: 'Organza Kalidars, Peshwas & Gota Embellishments',
      image: '/assets/banner_promotional_silk.jpg',
      count: '14 Designs'
    }
  ];

  const handleSelect = (catName: string) => {
    setSelectedCategory(catName === 'New Arrivals' ? null : catName);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
          Sartorial Taxonomy
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-title font-semibold text-stone-900">
          Curated Atelier Categories
        </h1>
        <p className="text-xs text-stone-500">
          Discover our collections categorized by artisanal discipline, fabric weight, and occasion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => handleSelect(cat.name)}
            className="group relative h-96 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all bg-stone-100"
          >
            <img
              src={normalizeAssetUrl(cat.image)}
              alt={cat.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.dataset.triedFallback !== 'true') {
                  target.dataset.triedFallback = 'true';
                  target.src = fallbackProductImage;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
                {cat.count}
              </span>
              <h2 className="text-3xl font-serif-title font-semibold text-white flex items-center justify-between">
                <span>{cat.name}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </h2>
              <p className="text-xs text-stone-300 font-light">{cat.tagline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
