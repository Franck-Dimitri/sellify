import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

export default function ImageUploadDropzone({
    label,
    description,
    accept = 'image/jpeg,image/png,image/jpg',
    maxSizeMb = 5,
    value = null,
    onChange,
    error,
    required = false,
    className = '',
}) {
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [localError, setLocalError] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else if (typeof value === 'string' && value.length > 0) {
            setPreviewUrl(value);
        } else {
            setPreviewUrl(null);
        }
    }, [value]);

    const handleFile = (file) => {
        setLocalError(null);
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            setLocalError('Veuillez sélectionner un fichier image valide (JPG, PNG).');
            return;
        }

        // Check file size
        if (file.size > maxSizeMb * 1024 * 1024) {
            setLocalError(`L'image est trop volumineuse. Taille max : ${maxSizeMb} Mo.`);
            return;
        }

        if (onChange) {
            onChange(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        setPreviewUrl(null);
        setLocalError(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        if (onChange) {
            onChange(null);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' octets';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
        return (bytes / (1024 * 1024)).toFixed(2) + ' Mo';
    };

    const displayError = error || localError;

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-stone-800">
                        {label}
                        {required && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                    {description && (
                        <span className="text-[11px] text-stone-500">{description}</span>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
            />

            {!previewUrl ? (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                        dragActive
                            ? 'border-yellow-500 bg-yellow-50/70 scale-[1.01]'
                            : displayError
                            ? 'border-rose-300 bg-rose-50/40 hover:bg-rose-50/70'
                            : 'border-stone-200 bg-stone-50/80 hover:border-yellow-400 hover:bg-yellow-50/30'
                    }`}
                >
                    <div className="flex flex-col items-center justify-center space-y-2 py-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            dragActive ? 'bg-yellow-200 text-yellow-800' : 'bg-white border border-stone-200 text-yellow-600 shadow-2xs'
                        }`}>
                            <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-stone-800">
                                <span className="text-yellow-700 underline underline-offset-2">Cliquez pour importer</span> ou glissez-déposez
                            </p>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                                JPG, PNG ou JPEG jusqu'à {maxSizeMb} Mo
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative border border-stone-200 bg-white rounded-xl p-3 shadow-2xs transition-all hover:border-yellow-400">
                    <div className="flex items-center gap-3">
                        {/* Image Thumbnail Preview */}
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0 group">
                            <img
                                src={previewUrl}
                                alt="Aperçu du document"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-white drop-shadow" />
                            </div>
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-xs font-bold text-stone-800 truncate">
                                    {value instanceof File ? value.name : 'Document importé'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-stone-500">
                                {value instanceof File && (
                                    <span>{formatFileSize(value.size)}</span>
                                )}
                                <span className="inline-block w-1 h-1 rounded-full bg-stone-300"></span>
                                <span className="text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded text-[10px]">
                                    Prêt pour envoi
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                title="Remplacer l'image"
                                className="p-1.5 text-stone-500 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleRemove}
                                title="Supprimer l'image"
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {displayError && (
                <div className="flex items-center gap-1 text-rose-600 text-[11px] font-medium pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{displayError}</span>
                </div>
            )}
        </div>
    );
}
