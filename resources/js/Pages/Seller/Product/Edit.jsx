import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ShopConsoleLayout from '../../../Layouts/ShopConsoleLayout';
import { Card, CardContent } from '../../../Components/ui/Card';
import Input from '../../../Components/ui/Input';
import Button from '../../../Components/ui/Button';
import { 
    ArrowLeft, 
    Upload, 
    Package, 
    X,
    Info
} from 'lucide-react';

export default function Edit({ shop, product, remainingStock = 30, maxStockLimit = 30 }) {
    const activeColor = shop.theme_color || '#CA8A04';
    
    // Existing images from the database
    const [existingImages, setExistingImages] = useState(product.image_paths || []);
    const [imagePreviews, setImagePreviews] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        images: [],
        keep_images: product.image_paths || [] // Initially keep all
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

    const removeExistingImage = (pathToRemove) => {
        const updatedKeep = data.keep_images.filter(path => path !== pathToRemove);
        setData('keep_images', updatedKeep);
        setExistingImages(existingImages.filter(path => path !== pathToRemove));
    };

    const removeNewImage = (index) => {
        const updatedImages = [...data.images];
        updatedImages.splice(index, 1);
        setData('images', updatedImages);

        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);
        setImagePreviews(updatedPreviews);
    };

    const submit = (e) => {
        e.preventDefault();
        // Since Laravel can't process multipart/form-data natively with PUT/PATCH, we submit via POST
        post(route('seller.shop.products.update', { shop: shop.slug, product: product.slug }));
    };

    return (
        <ShopConsoleLayout shop={shop} title="Modifier le produit">
            <Head title={`Modifier le produit - ${shop.name}`} />

            <div className="max-w-2xl mx-auto space-y-6 px-1">
                {/* Back Link */}
                <div className="flex items-center space-x-2">
                    <Link 
                        href={route('seller.shop.products.index', shop.slug)}
                        className="text-xs text-surface-450 hover:text-surface-650 flex items-center space-x-1 font-semibold"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Retour au catalogue</span>
                    </Link>
                </div>

                {/* Form Card */}
                <Card className="border-surface-200">
                    <div className="border-b border-surface-100 p-5">
                        <h2 className="text-base font-bold text-surface-750 flex items-center space-x-2">
                            <Package className="w-5 h-5" style={{ color: activeColor }} />
                            <span>Modifier le produit : {product.name}</span>
                        </h2>
                        <p className="text-xs text-surface-400 mt-1">Mettez à jour les informations, tarifs ou gérez les images.</p>
                    </div>

                    <CardContent className="p-5">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Name */}
                            <Input
                                label="Nom du produit"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                error={errors.name}
                            />

                            {/* Grid for Price & Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Prix de vente (€)"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={e => setData('price', e.target.value)}
                                    required
                                    error={errors.price}
                                />

                                <div className="space-y-1.5">
                                    <Input
                                        label="Stock du produit"
                                        name="stock"
                                        type="number"
                                        value={data.stock}
                                        onChange={e => setData('stock', e.target.value)}
                                        required
                                        error={errors.stock}
                                    />
                                    <div className="flex items-center space-x-1.5 text-[10px] text-surface-450 font-medium">
                                        <Info className="w-3 h-3 text-surface-400" />
                                        <span>
                                            Stock max global disponible : <strong className="text-surface-700">{remainingStock}</strong> unités (inclut le stock actuel de ce produit).
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col space-y-1.5">
                                <label className="text-xs font-semibold text-surface-600">Description du produit</label>
                                <textarea
                                    className="w-full px-3 py-2 text-surface-700 bg-white border border-surface-200 rounded-lg outline-none text-xs min-h-[120px] focus:border-surface-300 focus:ring-1 focus:ring-surface-200 transition-all duration-200 placeholder-surface-400 font-semibold"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                />
                                {errors.description && <p className="text-xs text-rose-600 font-medium">{errors.description}</p>}
                            </div>

                            {/* Existing and New Images */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-surface-600 block">Photos du produit</label>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {/* Upload trigger slot */}
                                    <div className="border-2 border-dashed border-surface-200 rounded-2xl p-4 flex flex-col items-center justify-center hover:border-surface-300 transition-all bg-surface-50 cursor-pointer relative overflow-hidden group min-h-[110px]">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <Upload className="w-5 h-5 text-surface-400 mb-1 group-hover:text-surface-555 transition-colors" />
                                        <span className="text-[10px] font-semibold text-surface-600">Ajouter photos</span>
                                        <span className="text-[8px] text-surface-400 mt-0.5">JPEG, PNG (Max 5Mo)</span>
                                    </div>

                                    {/* Existing images list */}
                                    {existingImages.map((path, idx) => (
                                        <div key={`exist-${idx}`} className="border border-surface-200 rounded-2xl overflow-hidden relative group min-h-[110px] bg-surface-50 flex items-center justify-center">
                                            <img src={`/storage/${path}`} alt="Photo existante" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(path)}
                                                className="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors z-20"
                                                title="Retirer cette photo"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New uploaded previews */}
                                    {imagePreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="border border-surface-200 rounded-2xl overflow-hidden relative group min-h-[110px] bg-surface-50 flex items-center justify-center border-yellow-600/30">
                                            <img src={preview} alt="Nouveau cliché" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-1.5 right-1.5 p-1 bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors z-20"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="absolute bottom-1 right-1 bg-yellow-50 text-[8px] font-bold text-yellow-800 border border-yellow-200 px-1 py-0.2 rounded uppercase">Nouveau</span>
                                        </div>
                                    ))}
                                </div>
                                {errors.images && <p className="text-xs text-rose-600 font-medium">{errors.images}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="border-t border-surface-100 pt-4 flex justify-end space-x-3">
                                <Link href={route('seller.shop.products.index', shop.slug)}>
                                    <Button variant="outline" className="font-semibold text-xs py-1.5">
                                        Annuler
                                    </Button>
                                </Link>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="font-semibold text-xs py-1.5 text-white shadow-sm"
                                    style={{ backgroundColor: activeColor }}
                                >
                                    {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </ShopConsoleLayout>
    );
}
