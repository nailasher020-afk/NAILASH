import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ClothingSize, ColorVariant } from '../../types';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Tag,
  Star,
  CheckCircle2,
  X,
  Upload,
  AlertCircle,
  Sparkles,
  Link,
  Layers,
  ArrowUp,
  FolderOpen
} from 'lucide-react';
import {
  normalizeAssetUrl,
  fallbackProductImage,
  compressImageFile,
  ATELIER_GALLERY_PRESETS
} from '../../utils/assets';

export const AdminProducts: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    togglePublishProduct,
    showToast
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Women');
  const [subcategory, setSubcategory] = useState('Luxury Lawn');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState<number>(18500);
  const [salePrice, setSalePrice] = useState<number | undefined>(undefined);
  const [images, setImages] = useState<string[]>([
    '/assets/hero_fashion_editorial.jpg'
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [brand, setBrand] = useState('Nailash Atelier');
  const [tagsInput, setTagsInput] = useState('Lawn, Summer, Pret');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [fabric, setFabric] = useState('Pure Fine Lawn with Silk Chiffon Dupatta');
  const [careInstructions, setCareInstructions] = useState('Dry clean recommended. Gentle hand wash.');

  // Color & Size Matrix
  const [colors, setColors] = useState<ColorVariant[]>([
    {
      id: 'col-1',
      name: 'Sage Green',
      hex: '#97A87A',
      sizes: [
        { size: 'XS', stock: 5 },
        { size: 'S', stock: 10 },
        { size: 'M', stock: 12 },
        { size: 'L', stock: 8 },
        { size: 'XL', stock: 4 },
        { size: 'XXL', stock: 2 }
      ]
    },
    {
      id: 'col-2',
      name: 'Terracotta Gold',
      hex: '#DB9558',
      sizes: [
        { size: 'XS', stock: 4 },
        { size: 'S', stock: 8 },
        { size: 'M', stock: 10 },
        { size: 'L', stock: 5 },
        { size: 'XL', stock: 3 },
        { size: 'XXL', stock: 1 }
      ]
    }
  ]);

  const openAddModal = () => {
    setEditingProductId(null);
    setName('');
    const randomSku = `NL-${Math.floor(100 + Math.random() * 900)}`;
    setSku(randomSku);
    setCategory('Women');
    setSubcategory('Luxury Lawn');
    setDescription('');
    setShortDescription('');
    setPrice(16500);
    setSalePrice(undefined);
    setImages([]);
    setImageUrlInput('');
    setTagsInput('Pret, Summer, Silk');
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsNewArrival(true);
    setStatus('published');
    setLowStockThreshold(4);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setName(p.name);
    setSku(p.sku);
    setCategory(p.category);
    setSubcategory(p.subcategory);
    setDescription(p.description);
    setShortDescription(p.shortDescription);
    setPrice(p.price);
    setSalePrice(p.salePrice);
    setImages(p.images.length > 0 ? p.images.map((im) => normalizeAssetUrl(im)) : ['/assets/hero_fashion_editorial.jpg']);
    setBrand(p.brand);
    setTagsInput(p.tags.join(', '));
    setIsFeatured(p.isFeatured);
    setIsBestSeller(p.isBestSeller);
    setIsNewArrival(p.isNewArrival);
    setStatus(p.status);
    setLowStockThreshold(p.lowStockThreshold);
    setFabric(p.fabric || '');
    setCareInstructions(p.careInstructions || '');
    setColors(p.colors);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) {
      showToast('Please enter product name and SKU', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const discountPercentage =
      salePrice && salePrice < price
        ? Math.round(((price - salePrice) / price) * 100)
        : undefined;

    // Auto-include any pending image URL typed by user
    let finalImages = [...images];
    if (imageUrlInput.trim() && !finalImages.includes(imageUrlInput.trim())) {
      finalImages.push(imageUrlInput.trim());
      setImageUrlInput('');
    }

    if (finalImages.length === 0) {
      finalImages = [fallbackProductImage];
    }

    const payload = {
      name,
      sku,
      category,
      subcategory,
      description: description || `${name} - meticulously handcrafted luxury creation.`,
      shortDescription: shortDescription || `${category} luxury pret by ${brand}.`,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      discountPercentage,
      images: finalImages,
      colors,
      brand,
      tags,
      isFeatured,
      isBestSeller,
      isNewArrival,
      status,
      lowStockThreshold: Number(lowStockThreshold),
      fabric,
      careInstructions
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      if (!images.includes(imageUrlInput.trim())) {
        setImages((prev) => [...prev, imageUrlInput.trim()]);
        showToast('Image URL added', 'success');
      } else {
        showToast('Image URL already added', 'info');
      }
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
    showToast('Cover image updated', 'info');
  };

  const handleAddPreset = (presetUrl: string) => {
    if (!images.includes(presetUrl)) {
      setImages((prev) => [...prev, presetUrl]);
      showToast('Collection photo added', 'success');
    } else {
      showToast('Photo already in gallery', 'info');
    }
  };

  const processFiles = async (fileList: File[]) => {
    setIsUploading(true);
    try {
      const added: string[] = [];
      for (const file of fileList) {
        if (!file.type.startsWith('image/')) {
          showToast(`File "${file.name}" is not an image`, 'error');
          continue;
        }
        const dataUrl = await compressImageFile(file);
        added.push(dataUrl);
      }
      if (added.length > 0) {
        setImages((prev) => [...prev, ...added]);
        showToast(`${added.length} photo(s) added successfully!`, 'success');
      }
    } catch (err) {
      console.error('File process error:', err);
      showToast('Could not process image file', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFiles(Array.from(files));
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleStockChange = (colorIndex: number, sizeIndex: number, val: number) => {
    const updated = [...colors];
    updated[colorIndex].sizes[sizeIndex].stock = Math.max(0, val);
    setColors(updated);
  };

  // Filtered product list
  const filteredProducts = products.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#DB9558]">
            Catalog & SKU Management
          </span>
          <h1 className="text-2xl font-serif-title font-semibold text-stone-900">
            Product Management ({products.length})
          </h1>
          <p className="text-xs text-stone-500">
            Publish, edit pricing, manage sizes and individual color stock matrices.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#97A87A] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#839367] transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or SKU..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FCF9EA]/40 border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:border-[#DB9558]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-700"
          >
            <option value="all">All Departments</option>
            <option value="Women">Women</option>
            <option value="Men">Men</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-700"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 font-semibold text-stone-400 uppercase tracking-wider bg-stone-50">
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-2">SKU</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2 text-right">Price</th>
                <th className="py-3 px-2 text-center">Total Stock</th>
                <th className="py-3 px-2">Flags</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredProducts.map((p) => {
                const totalStock = p.colors.reduce(
                  (acc, c) => acc + c.sizes.reduce((sum, s) => sum + s.stock, 0),
                  0
                );
                const isLow = totalStock <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={normalizeAssetUrl(p.images[0])}
                          alt=""
                          className="w-10 h-12 object-cover rounded bg-stone-100 shrink-0"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.dataset.triedFallback !== 'true') {
                              target.dataset.triedFallback = 'true';
                              target.src = fallbackProductImage;
                            }
                          }}
                        />
                        <div>
                          <p className="font-semibold text-stone-900">{p.name}</p>
                          <p className="text-[11px] text-stone-400">
                            {p.colors.length} shades · {p.colors.map((c) => c.name).join(', ')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-stone-800">{p.sku}</td>
                    <td className="py-3 px-2">
                      <span className="font-medium text-stone-800">{p.category}</span>
                      <span className="block text-[10px] text-stone-400">{p.subcategory}</span>
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums font-bold text-stone-900">
                      <div>Rs. {(p.salePrice ?? p.price).toLocaleString()}</div>
                      {p.salePrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          Rs. {p.price.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center font-mono tabular-nums">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          totalStock === 0
                            ? 'bg-rose-100 text-rose-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {totalStock} units
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1 flex-wrap text-[10px]">
                        {p.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-[#DB9558]/15 text-[#8e5321] rounded">
                            Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="px-1.5 py-0.5 bg-[#97A87A]/15 text-[#2d421d] rounded">
                            Best Seller
                          </span>
                        )}
                        {p.isNewArrival && (
                          <span className="px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => togglePublishProduct(p.id)}
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded cursor-pointer ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                        }`}
                        title="Click to toggle publish/draft"
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateProduct(p.id)}
                          className="p-1.5 text-stone-500 hover:text-[#DB9558] rounded hover:bg-stone-100"
                          title="Duplicate Product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete product "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-stone-500 hover:text-rose-600 rounded hover:bg-stone-100"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 my-8">
            <div className="sticky top-0 bg-[#FCF9EA] px-6 py-4 border-b border-stone-200 flex justify-between items-center z-10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#DB9558] font-bold">
                  {editingProductId ? 'Editing Mode' : 'Catalog Creation'}
                </span>
                <h2 className="text-xl font-serif-title font-semibold text-stone-900">
                  {editingProductId ? `Edit ${name}` : 'Add New Sartorial Piece'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 sm:p-8 space-y-6 text-xs">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">
                    Product Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Embroidered Lawn Suit"
                    className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    SKU Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="NL-LWN-001"
                    className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded font-mono text-stone-800"
                  />
                </div>
              </div>

              {/* Department & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Department</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded text-stone-800"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="Luxury Lawn, Festive Pret, Eastern..."
                    className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Brand Atelier</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800"
                  />
                </div>
              </div>

              {/* Price & Sale Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Regular Price (Rs.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded font-mono text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Sale Price (Rs., Optional)
                  </label>
                  <input
                    type="number"
                    value={salePrice ?? ''}
                    onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Leave empty if not on sale"
                    className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded font-mono text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded font-mono text-stone-800"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Artisanal details, fabric weave, embroidery techniques..."
                  className="w-full px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded text-stone-800"
                />
              </div>

              {/* Multi-Option Image Manager */}
              <div className="space-y-4 border-t border-stone-200 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-stone-900 font-bold text-sm">
                      Product Images & Visual Media
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Add images from your computer or phone, paste an image link, or pick from Nailash collection presets.
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-[#FCF9EA] text-[#8e5220] border border-[#DB9558]/30 font-medium rounded-full">
                    {images.length} {images.length === 1 ? 'image' : 'images'}
                  </span>
                </div>

                {/* Option 1: Direct File Upload & Drag-and-Drop */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`p-4 rounded-xl border-2 border-dashed transition-all text-center ${
                    isDragOver
                      ? 'border-[#DB9558] bg-[#DB9558]/10'
                      : 'border-stone-300 bg-stone-50/70 hover:bg-[#FCF9EA]/50 hover:border-[#DB9558]/60'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#DB9558]/15 text-[#DB9558] flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
                      >
                        {isUploading ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing Photo...</span>
                          </>
                        ) : (
                          <>
                            <FolderOpen className="w-4 h-4" />
                            <span>Upload Image from Device (Phone / PC)</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Drag & drop image files here, or click the button to select photos (JPG, PNG, WEBP)
                    </p>
                  </div>
                </div>

                {/* Option 2: Image URL Input */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-[#DB9558]" />
                    <span>Or Add Image via Web Link / Asset Path</span>
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImage();
                        }
                      }}
                      placeholder="https://images.unsplash.com/... or /assets/..."
                      className="flex-1 px-3 py-2 bg-[#FCF9EA]/40 border border-stone-300 rounded-lg text-stone-800 text-xs focus:outline-none focus:border-[#DB9558]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-stone-800 text-white rounded-lg text-xs font-semibold hover:bg-stone-700 cursor-pointer transition-colors"
                    >
                      Add Link
                    </button>
                  </div>
                </div>

                {/* Option 3: Presets from Nailash Editorial Catalog */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#97A87A]" />
                    <span>Quick-Select from Atelier Catalog Presets</span>
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {ATELIER_GALLERY_PRESETS.map((preset, pIdx) => {
                      const isAdded = images.includes(preset.url);
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleAddPreset(preset.url)}
                          className={`flex items-center gap-2 p-1.5 pr-3 rounded-lg border text-left shrink-0 text-xs transition-colors cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'bg-white border-stone-200 hover:border-[#DB9558] text-stone-700'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt=""
                            className="w-7 h-7 rounded object-cover border border-stone-200"
                          />
                          <div className="leading-tight">
                            <span className="font-semibold block text-[11px] truncate max-w-[110px]">
                              {preset.title}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {isAdded ? '✓ Added' : '+ Click to Add'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Visual Gallery of Added Images */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-700">
                      Product Gallery ({images.length} photos)
                    </span>
                    <span className="text-[11px] text-stone-400">
                      ★ First photo is the primary cover image
                    </span>
                  </div>

                  {images.length === 0 ? (
                    <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg text-center text-stone-400 text-xs">
                      No photos added yet. Upload an image above or pick a preset.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-xl border overflow-hidden group bg-stone-100 shadow-xs ${
                            idx === 0
                              ? 'border-2 border-[#DB9558] ring-2 ring-[#DB9558]/20'
                              : 'border-stone-200'
                          }`}
                        >
                          <div className="w-full h-32 overflow-hidden bg-stone-50">
                            <img
                              src={normalizeAssetUrl(img)}
                              alt={`Product image ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement;
                                if (target.dataset.triedFallback !== 'true') {
                                  target.dataset.triedFallback = 'true';
                                  target.src = fallbackProductImage;
                                }
                              }}
                            />
                          </div>

                          {/* Cover badge */}
                          {idx === 0 && (
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#DB9558] text-white text-[10px] font-bold rounded shadow-xs uppercase tracking-wider">
                              Cover Photo
                            </span>
                          )}

                          {/* Quick Actions overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-1.5 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
                            {idx !== 0 ? (
                              <button
                                type="button"
                                onClick={() => handleMakeCover(idx)}
                                className="text-[10px] bg-white/20 hover:bg-[#DB9558] px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                                title="Set as primary cover photo"
                              >
                                <ArrowUp className="w-3 h-3" />
                                <span>Set Cover</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-amber-200 font-medium pl-1">Primary</span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 bg-black/50 hover:bg-rose-600 text-white rounded transition-colors ml-auto cursor-pointer"
                              title="Delete photo from product"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Variant Stock Matrix: Colors x Sizes */}
              <div className="space-y-3 border-t border-stone-200 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-stone-900 uppercase tracking-wider text-xs">
                    Color & Size Stock Quantities
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    Each color variant has individual stock levels per size.
                  </span>
                </div>

                <div className="space-y-4">
                  {colors.map((color, cIdx) => (
                    <div key={color.id} className="p-4 bg-[#FCF9EA]/60 rounded-lg border border-stone-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-stone-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <strong className="text-stone-900 font-semibold">{color.name}</strong>
                      </div>

                      <div className="grid grid-cols-6 gap-2">
                        {color.sizes.map((s, sIdx) => (
                          <div key={s.size} className="space-y-1 text-center">
                            <span className="font-bold text-stone-700">{s.size}</span>
                            <input
                              type="number"
                              min="0"
                              value={s.stock}
                              onChange={(e) => handleStockChange(cIdx, sIdx, Number(e.target.value))}
                              className="w-full px-2 py-1 text-center font-mono font-bold bg-white border border-stone-300 rounded text-stone-900"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Merchandising Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t border-stone-200 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#DB9558]"
                  />
                  <span className="font-medium text-stone-800">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="accent-[#DB9558]"
                  />
                  <span className="font-medium text-stone-800">Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-[#DB9558]"
                  />
                  <span className="font-medium text-stone-800">New Arrival</span>
                </label>

                <div>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded font-semibold text-stone-800"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-stone-200 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#97A87A] text-white font-semibold uppercase tracking-wider rounded hover:bg-[#839367]"
                >
                  {editingProductId ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
