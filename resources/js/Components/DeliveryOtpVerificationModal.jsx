import React, { useRef, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Key, PenTool, Camera, ShieldCheck, X, CheckCircle2, Eraser, ArrowRight } from 'lucide-react';

export default function DeliveryOtpVerificationModal({ order, onClose }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize Canvas Context
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    // Canvas Drawing Handlers (Touch & Mouse)
    const startDrawing = (e) => {
        setIsDrawing(true);
        setHasSignature(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!otpInput || otpInput.length < 4) {
            alert("Veuillez saisir le code OTP transmis par le client.");
            return;
        }

        setIsSubmitting(true);

        const canvas = canvasRef.current;
        const signatureData = hasSignature && canvas ? canvas.toDataURL() : null;

        const formData = new FormData();
        formData.append('otp', otpInput);
        if (signatureData) formData.append('signature_data', signatureData);
        if (photoFile) formData.append('dropoff_photo', photoFile);

        router.post(
            route('driver.delivery.verify_otp', order.order_number),
            formData,
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    onClose();
                },
                onError: () => {
                    setIsSubmitting(false);
                }
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-yellow-400 text-yellow-950 flex items-center justify-center font-bold text-xs shadow-2xs border border-yellow-500">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-stone-900">Validation Double Sécurité #{order.order_number}</h3>
                            <span className="text-[10px] text-stone-400 font-normal block">Code OTP + Signature Manuscrite + Photo de dépôt</span>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* 1. CODE OTP INPUT */}
                <div className="space-y-1.5 text-xs">
                    <label className="block font-bold text-stone-800 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-yellow-600" />
                        <span>Étape 1 : Saisir le Code OTP Client à 6 chiffres</span>
                    </label>
                    <input
                        type="text"
                        maxLength="6"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="Ex: 890124"
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-center text-lg font-mono font-bold tracking-widest text-stone-900 focus:ring-2 focus:ring-yellow-400 outline-none"
                    />
                </div>

                {/* 2. DIGITAL TOUCH SIGNATURE PAD */}
                <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                        <label className="font-bold text-stone-800 flex items-center gap-1.5">
                            <PenTool className="w-3.5 h-3.5 text-yellow-600" />
                            <span>Étape 2 : Signature Manuscrite du Client (Écran tactile)</span>
                        </label>
                        {hasSignature && (
                            <button
                                type="button"
                                onClick={clearCanvas}
                                className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                            >
                                <Eraser className="w-3 h-3" />
                                <span>Effacer</span>
                            </button>
                        )}
                    </div>

                    <div className="border-2 border-dashed border-stone-300 rounded-xl bg-stone-50 relative overflow-hidden touch-none">
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={140}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                            className="w-full h-32 cursor-crosshair"
                        />
                        {!hasSignature && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-stone-400 text-xs italic">
                                ✍️ Le client signe avec son doigt ici...
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. OPTIONAL DROPOFF PHOTO PROOF */}
                <div className="space-y-1.5 text-xs">
                    <label className="block font-bold text-stone-800 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-yellow-600" />
                        <span>Étape 3 : Photo de preuve de dépôt du colis (Facultatif)</span>
                    </label>

                    <div className="flex items-center gap-3">
                        <label className="flex-1 py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center gap-2">
                            <Camera className="w-4 h-4 text-stone-400" />
                            <span>{photoFile ? photoFile.name : "Prendre une photo du colis..."}</span>
                            <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" />
                        </label>

                        {photoPreview && (
                            <img src={photoPreview} alt="Aperçu dépôt" className="w-12 h-12 rounded-xl object-cover border border-stone-300 shrink-0" />
                        )}
                    </div>
                </div>

                {/* ESCROW RELEASE PAYOUT BADGE */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between text-emerald-900 font-semibold">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Frais de livraison perçus :</span>
                    </div>
                    <strong className="text-emerald-700 text-sm font-bold">+{Number(order.shipping_fee || 2500).toLocaleString('fr-FR')} FCFA</strong>
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-xs rounded-xl shadow-2xs transition-colors border border-yellow-500 flex items-center justify-center gap-1.5"
                    >
                        <span>{isSubmitting ? 'Validation...' : 'Valider & Clôturer la livraison'}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                </div>

            </form>
        </div>
    );
}
