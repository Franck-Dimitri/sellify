import React from 'react';

export function Card({ children, className = '', hoverable = false, ...props }) {
    return (
        <div
            className={`bg-white border border-surface-200 rounded-2xl p-6 shadow-sm transition-all duration-200
                ${hoverable ? 'hover:shadow-md hover:border-primary-200' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={`border-b border-surface-100 pb-4 mb-4 flex justify-between items-center ${className}`}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className = '' }) {
    return (
        <h3 className={`text-lg font-bold text-surface-900 ${className}`}>
            {children}
        </h3>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`text-surface-600 text-sm md:text-base ${className}`}>
            {children}
        </div>
    );
}
