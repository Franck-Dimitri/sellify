import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ShopConsoleLayout from '../../../Layouts/ShopConsoleLayout';
import { 
    ArrowLeft, 
    Upload, 
    Package, 
    X,
    Info
} from 'lucide-react';

export default function Create({ shop, remainingStock = 30, maxStockLimit = 30 }) {
    const activeColor = shop.theme_color || '#F59E0B';
    const [imagePreviews, setImagePreviews] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        stock: '',
        description: '',
        images: []
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImages = [...data.images, ...files];
        setData('images', newImages);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        const updatedImages = [...data.images];
        updatedImages.splice(index, 1);
        setData('images', updatedImages);

        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);
        setImagePreviews(updatedPreviews);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('seller.shop.products.store', shop.slug));
    };

    return (
        <ShopConsoleLayout shop={shop} title="Ajouter un produit">
            <Head title={`Créer un produit - ${shop.name}`} />

            <div className="w-full max-w-3xl mx-auto space-y-5 text-stone-800 font-sans antialiased pb-16">
                
                {/* Back Link */}
                <div>
                    <Link 
                        href={route('seller.shop.products.index', shop.slug)}
                        className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Retour au catalogue</span>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white border border-stone-200/70 rounded-xl p-6 shadow-xs space-y-5">
                    <div className="border-b border-stone-100 pb-3">
                        <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                            <Package className="w-4 h-4 text-amber-600" />
                            <span>Nouveau Produit pour {shop.name}</span>
                        </h2>
                        <p className="text-xs text-stone-400 font-normal">Saisissez les caractéristiques et ajoutez des photos de présentation.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-stone-700 mb-1">Nom du Produit *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                placeholder="ex: iPhone 15 Pro Max 256GB"
                                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                required
                            />
                            {errors.name && <p className="text-[11px] text-red-600 mt-1 font-normal">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-stone-700 mb-1">Prix unitaire (FCFA) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    placeholder="ex: 25000"
                                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                    required
                                />
                                {errors.price && <p className="text-[11px] text-red-600 mt-1 font-normal">{errors.price}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-stone-700 mb-1">Stock Initial (Max dispo : {remainingStock}) *</label>
                                <input
                                    type="number"
                                    value={data.stock}
                                    onChange={e => setData('stock', e.target.value)}
                                    placeholder={`Max ${remainingStock} unités`}
                                    max={remainingStock}
                                    min="1"
                                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none font-normal"
                                    required
                                />
                                {errors.stock && <p className="text-[11px] text-red-600 mt-1 font-normal">{errors.stock}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-stone-700 mb-1">Description Détaillée du Produit</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Fiche technique, dimensions, couleur, caractéristiques principales..."
                                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none min-h-[100px] font-normal"
                            />
                        </div>

                        {/* Images Upload Dropzone */}
                        <div>
                            <label className="block text-xs font-medium text-stone-700 mb-1">Photos de Présentation du Produit</label>
                            <div className="border border-dashed border-stone-300 rounded-xl p-4 text-center bg-stone-50 hover:bg-stone-100 transition-colors relative cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1 group-hover:text-amber-600 transition-colors" />
                                <span className="text-xs font-medium text-stone-700 block">Cliquez ou glissez-déposez des images</span>
                                <span className="text-[10px] text-stone-400 block font-normal">Formats acceptés : PNG, JPG, WEBP</span>
                            </div>

                            {/* Image previews grid */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-3">
                                    {imagePreviews.map((src, idx) => (
                                        <div key={idx} className="relative w-full h-16 rounded-lg overflow-hidden border border-stone-200 group">
                                            <img src={src} alt="Aperçu" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-90 hover:opacity-100"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                            <Link href={route('seller.shop.products.index', shop.slug)}>
                                <button type="button" className="px-4 py-2 border border-stone-200 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50">
                                    Annuler
                                </button>
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-amber-950 rounded-lg text-xs font-semibold shadow-xs"
                            >
                                {processing ? 'Enregistrement...' : 'Enregistrer le Produit'}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </ShopConsoleLayout>
    );
}
