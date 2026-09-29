import React, { useState, useRef } from 'react';
import {
  Building2,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  FileText,
  DollarSign,
  Image as ImageIcon,
  Trash2,
  Star,
  Plus,
  Link as LinkIcon,
  X,
  AlertCircle
} from 'lucide-react';
import { useRealEstate } from '../context/RealEstateContext';
import { CITIES_AND_AREAS, PROPERTY_TYPES, MOCK_AMENITIES, createArchitecturalArt } from '../data/mockData';
import { PropertyPurpose } from '../types';

interface PostPropertyPageProps {
  navigate: (path: string) => void;
}

export const PostPropertyPage: React.FC<PostPropertyPageProps> = ({ navigate }) => {
  const { submitProperty, currentUser } = useRealEstate();

  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState<PropertyPurpose>('sale');
  const [propertyType, setPropertyType] = useState('Villa / House');
  const [price, setPrice] = useState<number>(45000000);
  const [city, setCity] = useState('Lahore');
  const [area, setArea] = useState('DHA Phase 6');
  const [address, setAddress] = useState('Sector J, DHA Phase 6, Lahore');
  const [bedrooms, setBedrooms] = useState(4);
  const [bathrooms, setBathrooms] = useState(5);
  const [areaSqFt, setAreaSqFt] = useState(4500);
  const [areaMarla, setAreaMarla] = useState(20);
  const [parkingSpaces, setParkingSpaces] = useState(2);
  const [furnishing, setFurnishing] = useState<'unfurnished' | 'semi-furnished' | 'furnished'>('furnished');
  const [description, setDescription] = useState(
    'Brand-new custom architectural design with imported marble flooring, German fittings, solar installation, and a lush landscaped garden.'
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Dedicated Car Parking',
    '24/7 CCTV & Security',
    'Smart Home Automation'
  ]);
  const [selectedTheme, setSelectedTheme] = useState<'villa' | 'penthouse' | 'tower' | 'craftsman' | 'interior'>('villa');
  const [submitting, setSubmitting] = useState(false);
  const [submittedPropertyId, setSubmittedPropertyId] = useState<string | null>(null);

  // Photo Upload State & Handlers
  const [photoMode, setPhotoMode] = useState<'upload' | 'render'>('upload');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress & resize image to max width 1600px for optimal performance
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Only image files (JPG, PNG, WebP) are allowed'));
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 1600;
          const maxHeight = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => reject(new Error('Invalid image file format'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setPhotoError(null);
    setIsProcessingImages(true);

    try {
      const processed: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await processImageFile(files[i]);
        processed.push(dataUrl);
      }
      setUploadedImages((prev) => [...prev, ...processed]);
    } catch (err: any) {
      setPhotoError(err.message || 'Error processing photos');
    } finally {
      setIsProcessingImages(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const url = imageUrlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/')) {
      setPhotoError('Please enter a valid HTTP or HTTPS image URL');
      return;
    }
    setUploadedImages((prev) => [...prev, url]);
    setImageUrlInput('');
    setPhotoError(null);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCoverImage = (indexToCover: number) => {
    setUploadedImages((prev) => {
      const target = prev[indexToCover];
      const rest = prev.filter((_, idx) => idx !== indexToCover);
      return [target, ...rest];
    });
  };

  const activeAreas = CITIES_AND_AREAS.find((c) => c.city === city)?.areas || [];

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let finalImages: string[] = [];
    if (photoMode === 'upload' && uploadedImages.length > 0) {
      finalImages = uploadedImages;
    } else {
      finalImages = [createArchitecturalArt(selectedTheme, title || 'Custom Property')];
    }

    const created = await submitProperty({
      title,
      purpose,
      propertyType,
      price,
      currency: 'PKR',
      bedrooms,
      bathrooms,
      areaSqFt,
      areaMarla,
      parkingSpaces,
      furnishing,
      description,
      amenities: selectedAmenities,
      highlights: ['Verified Listing by Owner', 'High-speed broadband ready', 'Clean title documentation'],
      images: finalImages,
      location: {
        country: 'Pakistan',
        province: city === 'Karachi' ? 'Sindh' : city === 'Islamabad' ? 'ICT' : 'Punjab',
        city,
        area,
        address,
        lat: 31.5204,
        lng: 74.3587
      }
    });

    setSubmitting(false);
    setSubmittedPropertyId(created.id);
  };

  if (submittedPropertyId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            Property Submitted Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Reference ID: <span className="font-mono font-bold text-slate-900">#{submittedPropertyId}</span>
          </p>
        </div>

        {/* Approval Workflow Explanation */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs space-y-3">
          <h3 className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Listing Verification Workflow</span>
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Your property has been placed in <span className="font-semibold text-amber-700">PENDING_APPROVAL</span> status. An assigned administrator will inspect title details and society documentation before publishing it publicly to search results.
          </p>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-slate-500">
            <span>You can review or manage this listing anytime under your</span>
            <button onClick={() => navigate('/profile')} className="font-bold text-slate-900 underline">
              Account Profile
            </button>
            <span>or switch to Admin mode to approve it immediately.</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/properties')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
          >
            Browse Properties
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
          >
            Go to Admin Approvals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Owner & Agent Submission</span>
        <h1 className="text-3xl font-display font-bold text-slate-900">
          List Your Property on PrimeHaven
        </h1>
        <p className="text-xs text-slate-500">
          Submit details for private inspection and verified listing across our national investor network.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>1. Basic Property Details</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Property Listing Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1 Kanal Brand New Contemporary Villa in DHA Phase 6"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose *</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as PropertyPurpose)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="lease">For Commercial Lease</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Property Type *</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asking Price (PKR) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>2. Location & Society</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City *</label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  const firstArea = CITIES_AND_AREAS.find((c) => c.city === e.target.value)?.areas[0] || '';
                  setArea(firstArea);
                }}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
              >
                {CITIES_AND_AREAS.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Area / Society *</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
              >
                {activeAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specific Address / Block *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Sector J, DHA Phase 6"
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Specifications */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>3. Dimensions & Specifications</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Area (Sq Ft)</label>
              <input
                type="number"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Area (Marla)</label>
              <input
                type="number"
                value={areaMarla}
                onChange={(e) => setAreaMarla(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Furnishing Status</label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value as any)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50"
              >
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-Furnished</option>
                <option value="furnished">Fully Furnished</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dedicated Parking Spaces</label>
              <input
                type="number"
                value={parkingSpaces}
                onChange={(e) => setParkingSpaces(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 text-xs">Detailed Description *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>

        {/* Section 4: Amenities */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
            4. Features & Amenities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            {MOCK_AMENITIES.map((am) => (
              <label key={am.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(am.name)}
                  onChange={() => toggleAmenity(am.name)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="text-slate-700">{am.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 5: Property Photos & Visual Media */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>5. Property Photos & Visual Media</span>
            </h2>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setPhotoMode('upload')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                  photoMode === 'upload'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-amber-500" />
                <span>Upload Photos</span>
                {uploadedImages.length > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                    {uploadedImages.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setPhotoMode('render')}
                className={`px-3 py-1 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                  photoMode === 'render'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>3D Architectural Render</span>
              </button>
            </div>
          </div>

          {photoMode === 'upload' ? (
            <div className="space-y-4">
              {/* Drag & Drop File Zone */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFilesSelected(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/50 scale-[0.99]'
                    : 'border-slate-300 hover:border-amber-500 hover:bg-slate-50/80 bg-slate-50/40'
                }`}
              >
                <div className="max-w-md mx-auto space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {isProcessingImages
                        ? 'Compressing & uploading photos...'
                        : 'Click to browse or drag and drop property photos'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports JPG, JPEG, PNG, WebP · High-resolution camera photos welcome
                    </p>
                  </div>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                      <Plus className="w-3.5 h-3.5 text-amber-500" />
                      Browse Files from Computer / Phone
                    </span>
                  </div>
                </div>
              </div>

              {/* Add by Image URL option */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>Or add photo using Web Link (URL)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Photo Error Banner */}
              {photoError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{photoError}</span>
                  <button type="button" onClick={() => setPhotoError(null)} className="ml-auto text-rose-400 hover:text-rose-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Uploaded Photos Gallery Preview */}
              {uploadedImages.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      Uploaded Photos ({uploadedImages.length})
                    </span>
                    <span className="text-slate-400">
                      Drag or set the main cover image
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`group relative rounded-xl overflow-hidden border bg-slate-900 aspect-4/3 transition-all ${
                          idx === 0 ? 'ring-2 ring-amber-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Uploaded Property Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                          {idx === 0 ? (
                            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" /> Cover Photo
                            </span>
                          ) : (
                            <span className="bg-slate-900/80 text-slate-200 text-[10px] font-semibold px-1.5 py-0.5 rounded backdrop-blur-xs">
                              #{idx + 1}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="pointer-events-auto p-1.5 rounded-md bg-rose-600/90 text-white hover:bg-rose-700 transition-colors shadow-xs"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bottom Actions */}
                        {idx !== 0 && (
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleSetCoverImage(idx)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded shadow-xs transition-colors flex items-center gap-1"
                            >
                              <Star className="w-3 h-3" /> Set as Cover
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-amber-50/60 border border-amber-200/60 rounded-lg p-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      The first photo is automatically used as the showcase thumbnail in search cards and top banners.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2 text-xs text-slate-400">
                  No custom photos uploaded yet. You can upload photos above, or switch to 3D Architectural Render style.
                </div>
              )}
            </div>
          ) : (
            /* Architectural Theme Fallback */
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                If you don't have photography ready yet, select an architectural vector style for this listing:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                {(['villa', 'penthouse', 'tower', 'craftsman', 'interior'] as const).map((th) => (
                  <button
                    key={th}
                    type="button"
                    onClick={() => setSelectedTheme(th)}
                    className={`p-3 rounded-xl border text-center capitalize font-semibold transition-all ${
                      selectedTheme === th
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {th} Style
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {currentUser.role === 'GUEST' ? (
              <span>Posting as: <strong className="text-slate-800">Private Property Owner / Agent</strong></span>
            ) : (
              <span>Posting as: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})</span>
            )}
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting for Review...' : 'Submit Property for Verification'}
          </button>
        </div>
      </form>
    </div>
  );
};
