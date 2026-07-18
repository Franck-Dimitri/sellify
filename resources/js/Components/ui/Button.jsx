import React from 'react';

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    onClick,
    ...props
}) {
    const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
    
    const variants = {
        primary: "bg-primary-500 hover:bg-primary-600 text-surface-950 font-semibold focus:ring-primary-500 shadow-sm",
        secondary: "bg-surface-100 hover:bg-surface-200 text-surface-800 border border-surface-200 focus:ring-surface-500",
        danger: "bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-500",
        success: "bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-500",
        outline: "bg-transparent border border-surface-300 hover:bg-surface-50 text-surface-700 focus:ring-surface-500",
        link: "bg-transparent text-primary-600 hover:text-primary-700 hover:underline p-0 focus:ring-0",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm md:text-base",
        lg: "px-6 py-3 text-base md:text-lg",
    };

    return (
        <button
            type={type}
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}
