import React from 'react';

export default function Badge({
    children,
    variant = 'neutral',
    className = '',
    ...props
}) {
    const variants = {
        neutral: "bg-surface-100 text-surface-800 border-surface-200",
        primary: "bg-primary-50 text-primary-800 border-primary-200",
        success: "bg-secondary-50 text-secondary-800 border-secondary-200",
        danger: "bg-accent-50 text-accent-800 border-accent-200",
        warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
        info: "bg-blue-50 text-blue-800 border-blue-200",
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}
