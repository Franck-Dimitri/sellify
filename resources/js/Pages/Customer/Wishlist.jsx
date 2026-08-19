import React from 'react';
import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Heart, ShoppingBag, Store, ArrowRight, ExternalLink } from 'lucide-react';

export default function Wishlist({ products = { data: [] } }) {
    return (
        <CustomerLayout title="Mes Favoris & Liste d'Envies">
            <Head title="Mes Favoris - Sellify" />

            <div className="w-full space-y-5 text-stone-800 antialiased font-sans pb-16">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 p-5 rounded-xl">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-yellow-700 uppercase tracking-wide">
                            <Heart className="w-3.5 h-3.5 text-yellow-600 fill-yellow-600" />
                            <span>Produits Sauvegardés</span>
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900 mt-1">
                            Ma Liste d'Envies
                        </h1>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Retrouvez tous vos articles coup de cœur et achetez-les en toute sécurité avec Escrow.
                        </p>
                    </div>

                    <Link
                        href={route('public.products.index')}
                        className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-600 text-stone-950 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                        <span>Parcourir le catalogue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* Products Grid */}
                {products.data && products.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.data.map((prod) => (
                            <div key={prod.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:border-yellow-400 transition-all flex flex-col justify-between">
                                <div className="p-4 space-y-2.5">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] bg-yellow-50 text-yellow-900 font-medium px-2 py-0.5 rounded-md border border-yellow-200">
                                            {prod.shop?.name || 'Boutique'}
                                        </span>
                                        <button className="text-rose-500 hover:text-rose-600">
                                            <Heart className="w-4 h-4 fill-rose-500" />
                                        </button>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-xs text-stone-900 line-clamp-2">{prod.name}</h3>
                                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 font-normal">
                                            {prod.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 pt-0 space-y-3">
                                    <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
                                        <span className="text-xs font-semibold text-stone-900">
                                            {Number(prod.price).toLocaleString('fr-FR')} FCFA
                                        </span>
                                        <span className="text-[10px] text-emerald-600 font-medium">En Stock</span>
                                    </div>

                                    <Link
                                        href={route('public.products.show', prod.slug)}
                                        className="w-full py-2 bg-stone-100 hover:bg-yellow-500 hover:text-stone-950 text-stone-700 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        <span>Commander</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-400 space-y-3">
                        <Heart className="w-10 h-10 text-stone-300 mx-auto" />
                        <p className="text-xs font-medium text-stone-700">Votre liste d'envies est vide</p>
                        <p className="text-[11px] text-stone-400">Ajoutez des produits en favoris lors de votre navigation sur les boutiques.</p>
                    </div>
                )}

            </div>
        </CustomerLayout>
    );
}
