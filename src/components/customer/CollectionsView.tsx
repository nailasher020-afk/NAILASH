import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { normalizeAssetUrl, fallbackProductImage } from '../../utils/assets';

export const CollectionsView: React.FC = () => {
  const { setActiveView, setSelectedCategory } = useStore();

  const lookbooks = [
    {
      title: 'Noor-e-Bahar 2026',
      subtitle: 'Luxury Fine Lawn & Chiffon Embroideries',
      description: 'Inspired by the blooming Mughal courtyards of Lahore. Featuring feather-light 100% lawn adorned with delicate schiffli lace, resham motifs, and digital silk dupattas.',
      image: '/assets/hero_fashion_editorial.jpg',
      category: 'Women'
    },
    {
      title: 'Festive Reverie',
      subtitle: 'Pure Silk Organza & Marodi Embellishments',
      description: 'Ethereal kalidars and floor-length peshwas rendered in celestial sage and burnt desert gold. Each ensemble is finished with authentic hand-placed gota patti.',
      image: '/assets/banner_promotional_silk.jpg',
      category: 'Women'
    },
    {
      title: 'The Sartorial Gentleman',
      subtitle: 'Structured Raw Silk & Regal Prince Coats',
      description: 'Precision cut menswear designed for celebratory grandeur. Raw silk kurtas with subtle collar piping and embossed Italian jamawar outerwear.',
      image: '/assets/cat_men_collection.jpg',
      category: 'Men'
    }
  ];

  const handleExplore = (cat: string) => {
    setSelectedCategory(cat);
    setActiveView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#DB9558] font-semibold">
          Curated Lookbooks
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif-title font-semibold text-stone-900">
          Seasonal Collections
        </h1>
        <p className="text-xs text-stone-500">
          Each capsule represents an exhaustive dedication to fabric integrity, bespoke color palettes, and artisanal mastercraft.
        </p>
      </div>

      <div className="space-y-16">
        {lookbooks.map((lb, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-md bg-stone-100">
                <img
                  src={normalizeAssetUrl(lb.image)}
                  alt={lb.title}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.dataset.triedFallback !== 'true') {
                      target.dataset.triedFallback = 'true';
                      target.src = fallbackProductImage;
                    }
                  }}
                />
              </div>
            </div>

            <div className={`lg:col-span-5 space-y-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
              <span className="text-xs uppercase tracking-widest text-[#97A87A] font-semibold">
                Capsule {idx + 1}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif-title font-semibold text-stone-900">
                {lb.title}
              </h2>
              <p className="text-xs font-semibold text-[#DB9558] tracking-wider uppercase">
                {lb.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                {lb.description}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleExplore(lb.category)}
                  className="px-6 py-3 bg-stone-900 text-[#FCF9EA] text-xs uppercase tracking-wider font-semibold rounded hover:bg-stone-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Capsule Pieces</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
