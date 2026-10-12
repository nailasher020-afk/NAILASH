import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Layers, Plus, Edit, Trash2, X } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { products, showToast } = useStore();

  const [categories, setCategories] = useState([
    {
      id: 'cat-1',
      name: 'Women',
      slug: 'women',
      description: 'Luxury Pret, Festive Kalidars, Embroidered Lawn & Shawls',
      subcategories: ['Luxury Lawn', 'Festive Pret', 'Ready To Wear', 'Heritage Artisanal']
    },
    {
      id: 'cat-2',
      name: 'Men',
      slug: 'men',
      description: 'Traditional Raw Silk Kurtas, Waistcoats & Bespoke Prince Coats',
      subcategories: ['Eastern Wear', 'Prince Coats', 'Kurta Sets']
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newSubcats, setNewSubcats] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    const subs = newSubcats.split(',').map((s) => s.trim()).filter(Boolean);
    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCatName,
      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
      description: newCatDesc,
      subcategories: subs.length > 0 ? subs : ['General']
    };
    setCategories([...categories, newCat]);
    setIsModalOpen(false);
    setNewCatName('');
    setNewCatDesc('');
    setNewSubcats('');
    showToast(`Category "${newCat.name}" added successfully`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Structure & Departments
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Categories & Subcategories
          </h1>
          <p className="text-xs text-stone-500">
            Organize customer catalog taxonomy, occasion tags, and subcategory groupings.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#97A87A] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#839367] transition-all flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;

          return (
            <div
              key={cat.id}
              className="bg-white p-6 rounded-lg border border-stone-200 shadow-xs space-y-4"
            >
              <div className="flex justify-between items-start border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-xl font-serif-title font-bold text-stone-900">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">{cat.description}</p>
                </div>
                <span className="px-2.5 py-1 bg-[#FCF9EA] text-[#DB9558] border border-stone-200 font-bold font-mono text-xs rounded">
                  {productCount} Products
                </span>
              </div>

              <div>
                <h4 className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-2">
                  Subcategories:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.subcategories.map((sub, i) => {
                    const subCount = products.filter((p) => p.subcategory === sub).length;
                    return (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded text-xs text-stone-700 font-medium"
                      >
                        {sub} <span className="font-mono text-stone-400">({subCount})</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="font-serif-title font-semibold text-lg text-stone-900">
                Add New Department Category
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Category Title</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Unstitched Festive"
                  className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short tagline for storefront..."
                  className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Subcategories (comma-separated)
                </label>
                <input
                  type="text"
                  value={newSubcats}
                  onChange={(e) => setNewSubcats(e.target.value)}
                  placeholder="e.g. Embroidered Lawn, Velvet, Chiffon"
                  className="w-full px-3 py-2 border border-stone-300 rounded text-stone-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#97A87A] text-white font-semibold rounded hover:bg-[#839367]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
