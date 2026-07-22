<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPack;

class SubscriptionPackSeeder extends Seeder
{
    public function run(): void
    {
        SubscriptionPack::updateOrCreate(
            ['name' => 'starter'],
            [
                'display_name' => 'Pack Starter',
                'monthly_price' => 0,
                'commission_rate_min' => 12.00,
                'commission_rate_max' => 15.00,
                'max_products' => 50,
                'features' => [
                    'Boutique Marketplace standard',
                    'Compte Séquestre (Escrow)',
                    '50 produits maximum',
                    'Dashboard standard',
                ]
            ]
        );

        SubscriptionPack::updateOrCreate(
            ['name' => 'pro'],
            [
                'display_name' => 'Pack Pro',
                'monthly_price' => 15000,
                'commission_rate_min' => 8.00,
                'commission_rate_max' => 11.00,
                'max_products' => null, // Illimité
                'features' => [
                    'Produits illimités',
                    'Stock avancé & Alerte de rupture',
                    'Smart-Link Social Commerce',
                    'Accès micro-prêts SellifyPay',
                    'Analytics & Support Prioritaire',
                ]
            ]
        );

        SubscriptionPack::updateOrCreate(
            ['name' => 'business'],
            [
                'display_name' => 'Pack Business',
                'monthly_price' => 40000,
                'commission_rate_min' => 5.00,
                'commission_rate_max' => 7.00,
                'max_products' => null, // Illimité
                'features' => [
                    'Tout du Pack Pro inclus',
                    'Boost Produit illimité dans le catalogue',
                    'Taux préférentiel SellifyPay (5%)',
                    'Account Manager Dédié & B2B',
                ]
            ]
        );
    }
}
