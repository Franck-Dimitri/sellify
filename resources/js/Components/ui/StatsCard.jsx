import React from 'react';
import { Card } from './Card';

export default function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className = ''
}) {
    return (
        <Card className={`bento-card ${className}`}>
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <p className="text-xs font-bold text-surface-400 uppercase tracking-wider">{title}</p>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-surface-900 tracking-tight">{value}</h3>
                </div>
                {Icon && (
                    <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>
            {(description || trend) && (
                <div className="mt-4 flex items-center space-x-2 text-xs">
                    {trend && (
                        <span className={`font-semibold ${trend.startsWith('+') ? 'text-secondary-600' : 'text-accent-600'}`}>
                            {trend}
                        </span>
                    )}
                    {description && (
                        <span className="text-surface-400">{description}</span>
                    )}
                </div>
            )}
        </Card>
    );
}
