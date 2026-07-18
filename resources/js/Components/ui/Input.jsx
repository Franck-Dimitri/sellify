import React from 'react';

export default function Input({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    className = '',
    required = false,
    ...props
}) {
    return (
        <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
            {label && (
                <label htmlFor={name} className="text-sm font-semibold text-surface-700">
                    {label} {required && <span className="text-accent-500">*</span>}
                </label>
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full px-3.5 py-2 text-surface-900 bg-white border rounded-lg transition-all duration-200 outline-none text-sm md:text-base
                    ${error 
                        ? 'border-accent-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-100' 
                        : 'border-surface-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                    }`}
                {...props}
            />
            {error && (
                <p className="text-xs text-accent-500 font-medium animate-fade-in">{error}</p>
            )}
        </div>
    );
}
