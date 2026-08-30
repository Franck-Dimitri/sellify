<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Promotion;
use App\Models\Seller;
use App\Models\Shop;
use App\Models\SmartLink;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MarketplaceSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Available product image pool from storage
        $imagePool = [
            'products/0viAmiMuZasjWBCl82dVguYWq4EJHLXWErP8ed3Z.jpg',
            'products/1NlF7CKvHivSq6LjyDUmD7GOEWg2yejO90Mj2o2j.jpg',
            'products/6jKBDT0qOlpIJBaPg1f3APxwCWsBghfvSacsTNtF.jpg',
            'products/85qh5G7N4wjBSvPbefFufXUKqV1xQFl0DVm9LG7a.jpg',
            'products/8C7sOBnpM9QhNH4KGJfyYqer3xrCc9bFHHmQ95E1.jpg',
            'products/9b9zRAuGtHUNTdQmC5gVXtpz5En2HaRmLM0NWpAU.jpg',
            'products/9EodqbEZn1yUnsEup3q28oYGeG2JdCU75pREI3sq.jpg',
            'products/CtkqCmPin5NXKr28Hht9Q2uW4loROLdZsZ4jKXqG.jpg',
            'products/cw8RP1pgqKb2OVU4Lm9qoy47F2SE756chZFaW70i.jpg',
            'products/dxVcSrz1kPVjKzY3g7LjcOTOekNyXcfgHxss2zjI.jpg',
            'products/DZxNl7hVAIoK8WXQH1kvD0auIx9Bdff3BhiIPbpH.jpg',
            'products/HoxNBel7mT1K68F6yi1OzYJGa0kXqj7xtahjT1Yz.jpg',
            'products/iCHHEcfn5qnVx24sbohyjwJiKZysBcL44ZtvRiAF.jpg',
            'products/kolN9BRFXV7w7sdD9VYk9anfDGfJ6CR4o0dCmuOE.jpg',
            'products/KWD00a4UAXY94dy7fgaxDhFwiAhnlCRMdhroIsw9.jpg',
            'products/lc4Ysu6oU7jiVrYhHGrodyBOtfLisFiJuNM9KiTa.png',
            'products/m5fwR3zpxYFuGpPs1bMjPToV6UMyvQB496vDUYPR.jpg',
            'products/McHv7khOeMoBgfgbu8qGVjiu2S75MNqIHuYQmWA6.png',
            'products/NYKnREKX3vi85IMmAKrHPrn3M4WRUhSUjH3FHLgH.png',
            'products/Orgs4LemrHJswRmWZRpV0lwA1XM6thRGXvFVMalq.jpg',
            'products/PCcdZZKrqYPL2xRzl8n9j4BZQPJXE1nSKmCi2uyU.jpg',
            'products/RtMiK0bu6xoNLtNFwM4Hugs8MsY2ywWXAO45xn67.jpg',
            'products/t8elU1LNE2ZsjBe8ZpcZt5V6Hv2ITBJ98SJAhykJ.jpg',
            'products/us1LEdzATt424Prw2kzguBhjPTtW61souj6Sady3.jpg',
            'products/wPCXSyWO5cXqZxkCThYE65TnesENLhSAqzokmY7Y.jpg',
            'products/xrvS55jplb61IqrFHYvGwCKs77Z0StD94bIpYInJ.jpg',
            'products/Z5fJeyEPQOplZMOSpjKRa20ymNsXYUtElDq2aUEI.jpg',
        ];

        // 2. Verified sellers & shops across key Cameroonian hubs
        $shopsData = [
            [
                'seller_name' => 'Paul Eto’o',
                'email' => 'paul.etoo@sellify.me',
                'business_name' => 'Tech & Gadgets Express SARL',
                'shop_name' => 'Tech & Gadgets Express',
                'slug' => 'tech-gadgets-express',
                'slogan' => 'Leader du High-Tech et de l\'électronique garantie à Douala',
                'description' => 'Importateur officiel de smartphones, ordinateurs portables, accessoires gaming et domotique. Garantie constructeur 12 mois et service après-vente sur place.',
                'city' => 'Douala',
                'address' => 'Boulevard de la Liberté, Akwa, Douala, Cameroun',
                'company_name' => 'Tech & Gadgets Express SARL',
                'rccm' => 'RC/DLA/2023/B/1458',
                'phone' => '+237 699 10 20 30',
            ],
            [
                'seller_name' => 'Aïcha Diallo',
                'email' => 'aicha.diallo@sellify.me',
                'business_name' => 'Mode & Élégance Panafricaine',
                'shop_name' => 'Mode & Élégance Panafricaine',
                'slug' => 'mode-elegance-panafricaine',
                'slogan' => 'Haute couture africaine, Bazin riche et prêt-à-porter',
                'description' => 'Atelier de création artisanale de bazin getzner, robes de cérémonie, costumes sur mesure et accessoires en cuir véritable.',
                'city' => 'Douala',
                'address' => 'Rue Joss, Bonanjo, Douala, Cameroun',
                'company_name' => 'Maison Diallo Créations',
                'rccm' => 'RC/DLA/2022/A/8941',
                'phone' => '+237 677 45 88 12',
            ],
            [
                'seller_name' => 'Marc Manga',
                'email' => 'marc.manga@sellify.me',
                'business_name' => 'Yaoundé High-Tech & Smart Store',
                'shop_name' => 'Yaoundé High-Tech & Smart Store',
                'slug' => 'yaounde-high-tech-smart-store',
                'slogan' => 'Smartphones, TV 4K et équipements bureautiques au cœur de la capitale',
                'description' => 'Fournisseur agréé de matériel informatique, consoles de jeux et appareils connectés à Yaoundé. Livraison express en 1h dans toute la ville.',
                'city' => 'Yaoundé',
                'address' => 'Avenue Kennedy, Centre-Ville, Yaoundé, Cameroun',
                'company_name' => 'Manga Technologies SAS',
                'rccm' => 'RC/YAO/2023/B/5521',
                'phone' => '+237 690 33 44 55',
            ],
            [
                'seller_name' => 'Franck Tchinda',
                'email' => 'franck.tchinda@sellify.me',
                'business_name' => 'Maison & Confort de l\'Ouest',
                'shop_name' => 'Maison & Confort Bafoussam',
                'slug' => 'maison-confort-bafoussam',
                'slogan' => 'Électroménager, literie et meubles de qualité à prix d\'usine',
                'description' => 'Spécialiste de l\'équipement pour la maison : réfrigérateurs basse consommation, climatiseurs, téléviseurs et meubles haut de gamme.',
                'city' => 'Bafoussam',
                'address' => 'Carrefour Total, Bafoussam, Cameroun',
                'company_name' => 'Tchinda Confort SARL',
                'rccm' => 'RC/BFM/2021/B/3012',
                'phone' => '+237 675 22 99 88',
            ],
            [
                'seller_name' => 'Fadimatou Oumarou',
                'email' => 'fadimatou.oumarou@sellify.me',
                'business_name' => 'Beauté & Terroir Sahélien',
                'shop_name' => 'Nature & Beauté Bio Garoua',
                'slug' => 'nature-beaute-bio-garoua',
                'slogan' => 'Cosmétiques 100% naturels, karité pur et huiles précieuses',
                'description' => 'Produits cosmétiques biologiques certifiés issus de nos coopératives du Grand Nord : beurre de karité, huile de baobab, neem et savons traditionnels.',
                'city' => 'Garoua',
                'address' => 'Avenue des Banques, Garoua, Cameroun',
                'company_name' => 'Sahel Bio Naturals',
                'rccm' => 'RC/GRA/2022/A/1045',
                'phone' => '+237 698 77 66 55',
            ],
            [
                'seller_name' => 'Henri Njoya',
                'email' => 'henri.njoya@sellify.me',
                'business_name' => 'Auto-Moto Pièces & Accessoires',
                'shop_name' => 'Auto-Moto Pièces Kribi Express',
                'slug' => 'auto-moto-pieces-kribi',
                'slogan' => 'Pneumatiques, lubrifiants et pièces détachées toutes marques',
                'description' => 'Vente de pièces d\'origine pour automobiles, motos et utilitaires. Pneus certifiés, batteries haute performance et huiles de synthèse.',
                'city' => 'Kribi',
                'address' => 'Boulevard du Port Autonome, Kribi, Cameroun',
                'company_name' => 'Njoya Auto Parts SARL',
                'rccm' => 'RC/KRB/2023/B/0412',
                'phone' => '+237 694 12 34 56',
            ],
            [
                'seller_name' => 'David Fongang',
                'email' => 'david.fongang@sellify.me',
                'business_name' => 'Saveurs & Épicerie Fine du Cameroun',
                'shop_name' => 'Saveurs & Épicerie Fine Bamenda',
                'slug' => 'saveurs-epicerie-fine-bamenda',
                'slogan' => 'Le meilleur des terroirs camerounais : Café, Miel d\'Oku et Poivre de Penja',
                'description' => 'Exportateur et distributeur des produits du terroir camerounais : café arabica des hauts plateaux, miel blanc d\'Oku certifié IGP, et épices d\'exception.',
                'city' => 'Bamenda',
                'address' => 'Commercial Avenue, Bamenda, Cameroun',
                'company_name' => 'Fongang Agro Trading',
                'rccm' => 'RC/BDA/2022/B/7788',
                'phone' => '+237 671 99 88 77',
            ],
        ];

        $createdShops = [];

        foreach ($shopsData as $sData) {
            $nameParts = explode(' ', $sData['seller_name'], 2);
            $firstName = $nameParts[0];
            $lastName = $nameParts[1] ?? '';

            $user = User::firstOrCreate(
                ['email' => $sData['email']],
                [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'password' => Hash::make('password123'),
                    'role' => 'seller',
                    'kyc_status' => 'verified',
                    'is_active' => true,
                    'status' => 'active',
                    'phone' => $sData['phone'],
                ]
            );
            $user->update(['kyc_status' => 'verified', 'role' => 'seller', 'status' => 'active', 'is_active' => true]);

            $seller = Seller::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'status' => 'approved',
                    'is_verified' => true,
                    'activity_status' => 'available',
                    'pack' => 'pro',
                    'verified_at' => now(),
                ]
            );
            $seller->update(['status' => 'approved', 'is_verified' => true, 'activity_status' => 'available']);

            $shop = Shop::updateOrCreate(
                ['slug' => $sData['slug']],
                [
                    'seller_id' => $seller->id,
                    'name' => $sData['shop_name'],
                    'slogan' => $sData['slogan'],
                    'description' => $sData['description'],
                    'company_name' => $sData['company_name'],
                    'registration_number' => $sData['rccm'],
                    'city' => $sData['city'],
                    'address' => $sData['address'],
                    'phone_contact' => $sData['phone'],
                    'email_contact' => $sData['email'],
                    'is_active' => true,
                    'is_holiday_mode' => false,
                    'theme_color' => '#F59E0B',
                    'opening_hours' => [
                        'monday' => ['active' => true, 'open' => '08:00', 'close' => '19:00'],
                        'tuesday' => ['active' => true, 'open' => '08:00', 'close' => '19:00'],
                        'wednesday' => ['active' => true, 'open' => '08:00', 'close' => '19:00'],
                        'thursday' => ['active' => true, 'open' => '08:00', 'close' => '19:00'],
                        'friday' => ['active' => true, 'open' => '08:00', 'close' => '19:00'],
                        'saturday' => ['active' => true, 'open' => '09:00', 'close' => '18:00'],
                        'sunday' => ['active' => false, 'open' => '09:00', 'close' => '14:00'],
                    ],
                ]
            );

            $createdShops[$sData['slug']] = $shop;
        }

        // 3. Define the 50 comprehensive products
        $catalog = [
            // HIGH-TECH & SMARTPHONES (10 items)
            [
                'name' => 'iPhone 15 Pro Max 256Go Titane Naturel',
                'slug' => 'iphone-15-pro-max-256go-titane',
                'category' => 'tech',
                'shop' => 'tech-gadgets-express',
                'price' => 890000,
                'stock' => 15,
                'weight' => 0.22,
                'description' => 'Smartphone Apple iPhone 15 Pro Max avec puce A17 Pro ultra-puissante, boîtier en titane qualité aérospatiale, écran Super Retina XDR 6.7 pouces et appareil photo professionnel 48 Mpx avec téléobjectif x5. Garantie constructeur 1 an avec facture officielle.',
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra 512Go Titanium Gray',
                'slug' => 'samsung-galaxy-s24-ultra-512go',
                'category' => 'tech',
                'shop' => 'yaounde-high-tech-smart-store',
                'price' => 840000,
                'stock' => 12,
                'weight' => 0.23,
                'description' => 'Smartphone haut de gamme Samsung Galaxy S24 Ultra intégrant l\'intelligence artificielle Galaxy AI, stylet S-Pen inclus, écran Dynamic AMOLED 2X 120Hz et zoom optique 100x. Appareil scellé dans son emballage d\'origine.',
            ],
            [
                'name' => 'MacBook Air 15 pouces M3 512Go SSD Minuit',
                'slug' => 'macbook-air-15-pouces-m3-512go',
                'category' => 'tech',
                'shop' => 'tech-gadgets-express',
                'price' => 1150000,
                'stock' => 8,
                'weight' => 1.51,
                'description' => 'Ordinateur portable Apple MacBook Air 15 pouces avec puce Apple M3, 16Go de mémoire unifiée, 512Go SSD ultra-rapide et jusqu\'à 18h d\'autonomie batterie. Idéal pour les professionnels, créateurs de contenu et étudiants.',
            ],
            [
                'name' => 'Xiaomi Redmi Note 13 Pro+ 5G 256Go Noir',
                'slug' => 'xiaomi-redmi-note-13-pro-plus-5g',
                'category' => 'tech',
                'shop' => 'yaounde-high-tech-smart-store',
                'price' => 245000,
                'stock' => 25,
                'weight' => 0.20,
                'description' => 'Smartphone Xiaomi avec appareil photo révolutionnaire de 200 Mpx OIS, chargeur ultra-rapide HyperCharge 120W inclus et écran incurvé AMOLED 1.5K 120Hz. Le meilleur rapport qualité-prix du marché.',
            ],
            [
                'name' => 'Écouteurs Apple AirPods Pro 2ème Génération USB-C',
                'slug' => 'apple-airpods-pro-2-usb-c',
                'category' => 'tech',
                'shop' => 'tech-gadgets-express',
                'price' => 185000,
                'stock' => 30,
                'weight' => 0.06,
                'description' => 'Écouteurs sans fil haut de gamme avec réduction active du bruit de niveau pro, audio spatial personnalisé et boîtier de charge MagSafe USB-C avec haut-parleur et dragonne intégrés.',
            ],
            [
                'name' => 'Smart TV Samsung QLED 4K 65 pouces Crystal UHD',
                'slug' => 'smart-tv-samsung-qled-4k-65-pouces',
                'category' => 'tech',
                'shop' => 'yaounde-high-tech-smart-store',
                'price' => 590000,
                'stock' => 6,
                'weight' => 21.5,
                'description' => 'Téléviseur connecté Smart TV Samsung 65 pouces 4K UHD avec HDR10+, processeur Crystal 4K, applications intégrées Netflix, YouTube, Prime Video et son immersif Object Tracking Sound Lite.',
            ],
            [
                'name' => 'Console Sony PlayStation 5 Slim Edition Standard 1To',
                'slug' => 'sony-playstation-5-slim-1to',
                'category' => 'tech',
                'shop' => 'tech-gadgets-express',
                'price' => 450000,
                'stock' => 10,
                'weight' => 3.2,
                'description' => 'Console de jeu Sony PS5 Slim avec lecteur Blu-ray Ultra HD, SSD 1To haute vitesse, manette DualSense sans fil à retour haptique et gâchettes adaptatives. Livrée avec 1 manette et câbles.',
            ],
            [
                'name' => 'Montre Connectée Apple Watch Series 9 GPS 45mm',
                'slug' => 'apple-watch-series-9-gps-45mm',
                'category' => 'tech',
                'shop' => 'tech-gadgets-express',
                'price' => 320000,
                'stock' => 14,
                'weight' => 0.04,
                'description' => 'Montre intelligente avec puce S9 SiP, geste Toucher deux fois, suivi avancé de la santé (ECG, taux d\'oxygène dans le sang, suivi du sommeil) et écran Retina toujours activé ultra-lumineux.',
            ],
            [
                'name' => 'Tablette iPad Air 11 pouces M2 Wi-Fi 128Go Bleu',
                'slug' => 'ipad-air-11-pouces-m2-128go',
                'category' => 'tech',
                'shop' => 'yaounde-high-tech-smart-store',
                'price' => 495000,
                'stock' => 11,
                'weight' => 0.46,
                'description' => 'Tablette tactile Apple iPad Air redessinée avec puce Apple M2, écran Liquid Retina immersif, caméra avant paysage 12 Mpx et compatibilité complète avec l\'Apple Pencil Pro.',
            ],
            [
                'name' => 'Casque Audio Sans Fil Sony WH-1000XM5 Noir',
                'slug' => 'casque-sony-wh-1000xm5-noir',
                'category' => 'tech',
                'shop' => 'tech-gadgets-express',
                'price' => 260000,
                'stock' => 16,
                'weight' => 0.25,
                'description' => 'Casque circum-aural Bluetooth haut de gamme avec la meilleure réduction active de bruit du marché, qualité d\'appel cristalline grâce à 4 microphones à formation de faisceaux et 30h d\'autonomie.',
            ],

            // MODE & VÊTEMENTS AFRICAINS (10 items)
            [
                'name' => 'Bazin Riche Getzner Authentique 5 Mètres Bleu Nuit Brodé',
                'slug' => 'bazin-riche-getzner-5m-bleu-nuit',
                'category' => 'fashion',
                'shop' => 'mode-elegance-panafricaine',
                'price' => 65000,
                'stock' => 20,
                'weight' => 1.2,
                'description' => 'Tissu Bazin riche Getzner qualité supérieure 100% coton teinté à la main avec broderies traditionnelles fil d\'or. Idéal pour boubous de mariage, cérémonies religieuses et grandes réceptions.',
            ],
            [
                'name' => 'Ensemble Boubou Africain Homme Brodé 3 Pièces',
                'slug' => 'ensemble-boubou-africain-homme-3-pieces',
                'category' => 'fashion',
                'shop' => 'mode-elegance-panafricaine',
                'price' => 85000,
                'stock' => 15,
                'weight' => 1.5,
                'description' => 'Magnifique tenue traditionnelle africaine 3 pièces pour homme comprenant le grand boubou brodé au col, la chemise intérieure et le pantalon assorti. Finitions soignées réalisées par des maîtres tailleurs.',
            ],
            [
                'name' => 'Robe Cérémonie Wax Hollandais Véritable Motif Floral',
                'slug' => 'robe-ceremonie-wax-hollandais-floral',
                'category' => 'fashion',
                'shop' => 'mode-elegance-panafricaine',
                'price' => 48000,
                'stock' => 18,
                'weight' => 0.8,
                'description' => 'Robe longue évasée taillée dans du véritable Wax Vlisco Hollandais aux couleurs éclatantes et durables. Coupe moderne et cintrée convenant aux événements formels comme décontractés.',
            ],
            [
                'name' => 'Costume Homme 2 Pièces Slim Fit Lin & Coton Beige',
                'slug' => 'costume-homme-slim-fit-lin-beige',
                'category' => 'fashion',
                'shop' => 'mode-elegance-panafricaine',
                'price' => 95000,
                'stock' => 12,
                'weight' => 1.8,
                'description' => 'Costume élégant 2 pièces veste et pantalon en tissu léger et respirant lin-coton, parfait pour le climat tropical africain. Veste à deux boutons et doublure satinée raffinée.',
            ],
            [
                'name' => 'Chaussures Richelieu en Cuir Véritable Fait Main',
                'slug' => 'chaussures-richelieu-cuir-fait-main',
                'category' => 'fashion',
                'shop' => 'mode-elegance-panafricaine',
                'price' => 55000,
                'stock' => 14,
                'weight' => 1.1,
                'description' => 'Chaussures de ville haut de gamme pour homme en cuir de veau pleine fleur patiné à la main avec semelle cousue Goodyear. Confort d\'assise et durabilité exceptionnels pour les professionnels.',
            ],
            [
                'name' => 'Sac à Main Femme Cuir & Finition Wax Africain',
                'slug' => 'sac-a-main-cuir-et-wax-africain',
                'category' => 'fashion',
                'shop' => 'mode-elegance-panafricaine',
                'price' => 38000,
                'stock' => 22,
                'weight' => 0.7,
                'description' => 'Sac à main artisanal de luxe mariant le cuir tanné local et des empiècements de pagne wax traditionnel. Doté de plusieurs compartiments sécurisés avec fermeture éclair robuste.',
            ],
            [
                'name' => 'Sandales Royales en Cuir Tressé du Nord Cameroun',
                'slug' => 'sandales-royales-cuir-tresse-nord',
                'category' => 'fashion',
                'shop' => 'nature-beaute-bio-garoua',
                'price' => 22000,
                'stock' => 30,
                'weight' => 0.5,
                'description' => 'Sandales d\'apparat traditionnelles unisexes en cuir naturel tressé à la main à Garoua. Semelle antidérapante souple offrant une élégance décontractée et un confort quotidien.',
            ],
            [
                'name' => 'Chemise Chemisette Homme Tissu Ndop Traditionnel',
                'slug' => 'chemise-homme-tissu-ndop-bamilike',
                'category' => 'fashion',
                'shop' => 'maison-confort-bafoussam',
                'price' => 32000,
                'stock' => 25,
                'weight' => 0.4,
                'description' => 'Chemise moderne pour homme rehaussée des motifs géométriques sacrés du tissu Ndop Bamiléké. Tissu doux 100% coton, coupe cintrée et boutons en nacre naturelle.',
            ],
            [
                'name' => 'Sneakers Urbaines Streetwear Cuir Blanc & Tissu Kente',
                'slug' => 'sneakers-urbaines-cuir-kente',
                'category' => 'fashion',
                'shop' => 'mode-elegance-panafricaine',
                'price' => 42000,
                'stock' => 19,
                'weight' => 0.9,
                'description' => 'Baskets urbaines streetwear associant cuir souple blanc et touches de tissu Kente ghanéen. Semelle amortissante en mousse mémoire de forme pour un style afro-futuriste affirmé.',
            ],
            [
                'name' => 'Foulard & Écharpe en Soie Sauvage Teinture Végétale',
                'slug' => 'foulard-soie-sauvage-teinture-vegetale',
                'category' => 'fashion',
                'shop' => 'mode-elegance-panafricaine',
                'price' => 18000,
                'stock' => 35,
                'weight' => 0.15,
                'description' => 'Étole soyeuse et légère aux motifs ethniques créée à partir de teintures naturelles végétales. Accessoire idéal pour habiller une tenue de soirée ou se protéger de la fraîcheur.',
            ],

            // MAISON & ÉLECTROMÉNAGER (8 items)
            [
                'name' => 'Réfrigérateur Combiné No Frost Samsung 340L Inverter',
                'slug' => 'refrigerateur-combine-samsung-340l-inverter',
                'category' => 'home',
                'shop' => 'maison-confort-bafoussam',
                'price' => 385000,
                'stock' => 7,
                'weight' => 68.0,
                'description' => 'Réfrigérateur avec technologie Digital Inverter assurant 50% d\'économie d\'énergie et une excellente tolérance aux variations de tension électrique. Froid ventilé No Frost empêchant la formation de givre.',
            ],
            [
                'name' => 'Machine à Laver Automatique LG Smart Inverter 9kg',
                'slug' => 'machine-a-laver-lg-smart-inverter-9kg',
                'category' => 'home',
                'shop' => 'maison-confort-bafoussam',
                'price' => 320000,
                'stock' => 9,
                'weight' => 60.0,
                'description' => 'Lave-linge frontal haute capacité 9kg avec moteur Smart Inverter silencieux garanti 10 ans, technologie TurboWash pour un cycle rapide en 59 minutes et diagnostic intelligent par smartphone.',
            ],
            [
                'name' => 'Climatiseur Split Midea Inverter 1.5 CV Silencieux R32',
                'slug' => 'climatiseur-split-midea-inverter-1-5cv',
                'category' => 'home',
                'shop' => 'maison-confort-bafoussam',
                'price' => 245000,
                'stock' => 12,
                'weight' => 35.0,
                'description' => 'Climatiseur split mural ultra-économique 12000 BTU avec gaz écologique R32, filtre anti-poussière haute densité et mode Turbo refroidissement instantané en moins de 3 minutes.',
            ],
            [
                'name' => 'Robot Mixeur Multifonction Professionnel Philips 1000W',
                'slug' => 'robot-mixeur-multifonction-philips-1000w',
                'category' => 'home',
                'shop' => 'maison-confort-bafoussam',
                'price' => 68000,
                'stock' => 20,
                'weight' => 4.2,
                'description' => 'Robot culinaire complet équipé d\'un bol mélangeur 2.1L, d\'un blender incassable 1.5L et d\'un moulin à épices puissant capable de moudre le poivre, le manioc ou les arachides sans effort.',
            ],
            [
                'name' => 'Cuisinière à Gaz 4 Foyers avec Four Grill Inox Oscar',
                'slug' => 'cuisiniere-gaz-4-foyers-four-grill-oscar',
                'category' => 'home',
                'shop' => 'maison-confort-bafoussam',
                'price' => 145000,
                'stock' => 10,
                'weight' => 38.0,
                'description' => 'Cuisinière à gaz robuste tout inox 60x60cm dotée de 4 brûleurs performants, d\'un allumage automatique par bouton poussoir, d\'un tournebroche pour poulet rôti et d\'une minuterie sonore.',
            ],
            [
                'name' => 'Ventilateur Rechargeable Solaire 16 Pouces avec Batterie & Télécommande',
                'slug' => 'ventilateur-rechargeable-solaire-16-pouces',
                'category' => 'home',
                'shop' => 'yaounde-high-tech-smart-store',
                'price' => 45000,
                'stock' => 35,
                'weight' => 5.5,
                'description' => 'Ventilateur sur pied rechargeable ultra-pratique en cas de coupure de courant. Offre 10 heures d\'autonomie continue, port USB de charge pour smartphones et panneau solaire portable fourni.',
            ],
            [
                'name' => 'Matelas Orthopédique Haute Densité 2 Places 160x190cm',
                'slug' => 'matelas-orthopedique-haute-densite-160x190',
                'category' => 'home',
                'shop' => 'maison-confort-bafoussam',
                'price' => 175000,
                'stock' => 8,
                'weight' => 28.0,
                'description' => 'Matelas médical orthopédique conçu pour soulager les douleurs dorsales et lombaires. Mousse haute résilience densité 30, tissu jacquard hypoallergénique et garantie 5 ans affaissement.',
            ],
            [
                'name' => 'Fer à Repasser à Vapeur Professionnel Tefal 2800W',
                'slug' => 'fer-a-repasser-vapeur-tefal-2800w',
                'category' => 'home',
                'shop' => 'maison-confort-bafoussam',
                'price' => 38000,
                'stock' => 25,
                'weight' => 1.6,
                'description' => 'Fer à vapeur ultra-glissant avec semelle Durilium Airglide, débit de vapeur continu de 50g/min et fonction pressing 260g/min pour venir à bout des faux plis sur le bazin et les tissus épais.',
            ],

            // BEAUTÉ & SOINS NATURELS (8 items)
            [
                'name' => 'Beurre de Karité Pur Bio Non Raffiné du Grand Nord 1kg',
                'slug' => 'beurre-de-karite-pur-bio-1kg',
                'category' => 'beauty',
                'shop' => 'nature-beaute-bio-garoua',
                'price' => 8500,
                'stock' => 50,
                'weight' => 1.0,
                'description' => 'Beurre de karité 100% pur, artisanal et non désodorisé extrait par pression à froid à Garoua. Nourrit intensément les cheveux secs, hydrate la peau en profondeur et apaise les irritations.',
            ],
            [
                'name' => 'Huile de Baobab & Ricin Pure Fortifiante Repousse Cheveux 250ml',
                'slug' => 'huile-baobab-ricin-pure-fortifiante-250ml',
                'category' => 'beauty',
                'shop' => 'nature-beaute-bio-garoua',
                'price' => 12000,
                'stock' => 40,
                'weight' => 0.3,
                'description' => 'Sérum d\'huiles végétales précieuses certifiées biologiques pour stimuler la pousse des cheveux afro et crépus, fortifier les pointes cassantes et soigner la barbe des hommes.',
            ],
            [
                'name' => 'Savon Noir Artisanal Éclaircissant Naturel au Miel & Curcuma',
                'slug' => 'savon-noir-artisanal-miel-curcuma',
                'category' => 'beauty',
                'shop' => 'nature-beaute-bio-garoua',
                'price' => 4500,
                'stock' => 60,
                'weight' => 0.25,
                'description' => 'Savon noir gommant naturel formulé avec de la potasse de cacao, du miel sauvage et du curcuma. Élimine les taches sombres, combat l\'acné et unifie le teint en douceur sans agents chimiques.',
            ],
            [
                'name' => 'Parfum Oriental Oud Royal Boisé & Ambré 100ml',
                'slug' => 'parfum-oriental-oud-royal-100ml',
                'category' => 'beauty',
                'shop' => 'nature-beaute-bio-garoua',
                'price' => 35000,
                'stock' => 20,
                'weight' => 0.4,
                'description' => 'Eau de parfum de luxe aux notes captivantes de bois d\'oud, d\'ambre précieux, de rose de Damas et de vanille de Madagascar. Tenue longue durée garantie 24h sur la peau et les vêtements.',
            ],
            [
                'name' => 'Crème Hydratante Corps & Visage à l\'Aloe Vera & Huile de Coco',
                'slug' => 'creme-hydratante-aloe-vera-coco',
                'category' => 'beauty',
                'shop' => 'nature-beaute-bio-garoua',
                'price' => 9500,
                'stock' => 35,
                'weight' => 0.35,
                'description' => 'Crème onctueuse naturelle adaptée aux peaux sensibles et déshydratées. Pénètre rapidement sans film gras et protège la barrière cutanée contre la pollution et les agressions extérieures.',
            ],
            [
                'name' => 'Kit Soin Barbe & Moustache pour Homme Huile + Baume + Brosse en Bois',
                'slug' => 'kit-soin-barbe-homme-complet',
                'category' => 'beauty',
                'shop' => 'nature-beaute-bio-garoua',
                'price' => 19500,
                'stock' => 25,
                'weight' => 0.5,
                'description' => 'Coffret cadeau complet pour l\'entretien de la barbe masculine comprenant une huile hydratante parfum bois de cèdre, un baume coiffant structurant et une brosse en poils naturels de sanglier.',
            ],
            [
                'name' => 'Sérum Visage Anti-Taches à la Vitamine C Pure 20% & Acide Hyaluronique',
                'slug' => 'serum-visage-anti-taches-vitamine-c',
                'category' => 'beauty',
                'shop' => 'nature-beaute-bio-garoua',
                'price' => 16000,
                'stock' => 28,
                'weight' => 0.1,
                'description' => 'Sérum illuminateur concentré en vitamine C stabilisée pour estomper les taches d\'hyperpigmentation, booster la production de collagène et redonner un éclat éclatant au teint.',
            ],
            [
                'name' => 'Gommage Corps Sucre Roux & Café Exfoliant Drainant 400g',
                'slug' => 'gommage-corps-sucre-cafe-400g',
                'category' => 'beauty',
                'shop' => 'nature-beaute-bio-garoua',
                'price' => 7500,
                'stock' => 45,
                'weight' => 0.45,
                'description' => 'Exfoliant naturel gourmand combinant grains de café arabica moulu, sucre de canne brut et huile d\'amande douce. Élimine les cellules mortes et raffermit visiblement la peau.',
            ],

            // AUTO, MOTO & PIÈCES (7 items)
            [
                'name' => 'Pneu Michelin Primacy 4 205/55 R16 91V Tout Temps',
                'slug' => 'pneu-michelin-primacy-4-205-55-r16',
                'category' => 'auto',
                'shop' => 'auto-moto-pieces-kribi',
                'price' => 58000,
                'stock' => 20,
                'weight' => 9.5,
                'description' => 'Pneumatique automobile premium de marque Michelin réputé pour sa longévité exceptionnelle et son adhérence supérieure sur sol mouillé et sec. Idéal pour berlines et SUV compacts.',
            ],
            [
                'name' => 'Batterie Voiture Varta Blue Dynamic 12V 70Ah 640A',
                'slug' => 'batterie-voiture-varta-12v-70ah',
                'category' => 'auto',
                'shop' => 'auto-moto-pieces-kribi',
                'price' => 72000,
                'stock' => 15,
                'weight' => 17.0,
                'description' => 'Batterie de démarrage sans entretien pour automobiles essence et diesel. Puissance de démarrage à froid accrue et durée de vie prolongée même en conditions climatiques tropicales sévères.',
            ],
            [
                'name' => 'Huile Moteur Synthétique Total Quartz 9000 5W-40 Bidon 5L',
                'slug' => 'huile-moteur-total-quartz-9000-5w40-5l',
                'category' => 'auto',
                'shop' => 'auto-moto-pieces-kribi',
                'price' => 28000,
                'stock' => 30,
                'weight' => 4.8,
                'description' => 'Lubrifiant 100% synthétique multigrade haute performance pour moteurs essence et diesel récents. Assure une protection maximale contre l\'usure et garde le moteur dans un état de propreté optimal.',
            ],
            [
                'name' => 'Casque Moto Intégral Homologué DOT avec Visière Anti-Rayures',
                'slug' => 'casque-moto-integral-homologue-dot',
                'category' => 'auto',
                'shop' => 'auto-moto-pieces-kribi',
                'price' => 35000,
                'stock' => 25,
                'weight' => 1.4,
                'description' => 'Casque moto de sécurité avec coque aérodynamique en polycarbonate résistant aux chocs, aérations réglables, intérieur lavable et visière double protection soleil et pluie.',
            ],
            [
                'name' => 'Kit Plaquettes de Frein Avant Céramique pour Toyota RAV4 / Corolla',
                'slug' => 'plaquettes-frein-ceramique-toyota',
                'category' => 'auto',
                'shop' => 'auto-moto-pieces-kribi',
                'price' => 24000,
                'stock' => 22,
                'weight' => 1.8,
                'description' => 'Jeu de 4 plaquettes de frein avant haute performance en céramique. Freinage puissant et silencieux sans génération de poussière noire sur les jantes, compatible modèles Toyota récents.',
            ],
            [
                'name' => 'Compresseur d\'Air Portable Digital 12V 150 PSI pour Pneus de Voiture',
                'slug' => 'compresseur-air-portable-digital-12v',
                'category' => 'auto',
                'shop' => 'auto-moto-pieces-kribi',
                'price' => 18500,
                'stock' => 28,
                'weight' => 1.2,
                'description' => 'Gonfleur électrique portable compact avec écran LCD digital, arrêt automatique à la pression désirée et lampe torche LED intégrée pour les urgences nocturnes sur la route.',
            ],
            [
                'name' => 'Caméra de Recul Sans Fil & Rétroviseur Écran Tactile Full HD',
                'slug' => 'camera-de-recul-retroviseur-full-hd',
                'category' => 'auto',
                'shop' => 'tech-gadgets-express',
                'price' => 45000,
                'stock' => 18,
                'weight' => 0.8,
                'description' => 'Kit de sécurité automobile avec rétroviseur tactile connecté, enregistrement vidéo en continu (Dashcam avant et arrière) et vision nocturne infrarouge pour des manœuvres en toute sécurité.',
            ],

            // ALIMENTATION & ÉPICERIE DU TERROIR (7 items)
            [
                'name' => 'Poivre Blanc de Penja IGP Grand Cru Sachet 500g',
                'slug' => 'poivre-blanc-de-penja-igp-500g',
                'category' => 'food',
                'shop' => 'saveurs-epicerie-fine-bamenda',
                'price' => 14500,
                'stock' => 40,
                'weight' => 0.5,
                'description' => 'Le célèbre poivre volcanique de Penja certifié Indication Géographique Protégée (IGP). Arômes boisés et saveurs animales exceptionnelles sublimant les viandes, poissons et sauces raffinées.',
            ],
            [
                'name' => 'Miel Blanc d\'Oku 100% Pur Naturel Pot 1kg Certifié IGP',
                'slug' => 'miel-blanc-oku-pur-naturel-1kg',
                'category' => 'food',
                'shop' => 'saveurs-epicerie-fine-bamenda',
                'price' => 11000,
                'stock' => 35,
                'weight' => 1.0,
                'description' => 'Miel d\'exception récolté dans les forêts d\'altitude du Mont Oku à plus de 2000m. Sa texture crémeuse unique et sa couleur blanche sont dues aux fleurs de Schefflera abyssinica. Riche en antioxydants.',
            ],
            [
                'name' => 'Café Arabica Pur des Hauts Plateaux de Bamenda Torréfié en Grains 1kg',
                'slug' => 'cafe-arabica-bamenda-grains-1kg',
                'category' => 'food',
                'shop' => 'saveurs-epicerie-fine-bamenda',
                'price' => 9500,
                'stock' => 45,
                'weight' => 1.0,
                'description' => 'Café de spécialité cultivé sur sol volcanique d\'altitude à Bamenda. Torréfaction artisanale moyenne révélant des notes chocolatées, de noisette et une acidité douce en bouche.',
            ],
            [
                'name' => 'Chocolat Noir Artisanal 70% Pur Cacao du Cameroun Tablette 100g',
                'slug' => 'chocolat-noir-artisanal-70-cacao-100g',
                'category' => 'food',
                'shop' => 'saveurs-epicerie-fine-bamenda',
                'price' => 2500,
                'stock' => 80,
                'weight' => 0.1,
                'description' => 'Chocolat Bean-to-bar pur beurre de cacao fabriqué localement à partir de fèves sélectionnées de la région du Centre. Sans lécithine ni conservateurs, goût corsé et fruité.',
            ],
            [
                'name' => 'Huile Rouge de Palme Pure Traditionnelle Première Pression 5 Litres',
                'slug' => 'huile-rouge-de-palme-pure-5l',
                'category' => 'food',
                'shop' => 'saveurs-epicerie-fine-bamenda',
                'price' => 12500,
                'stock' => 30,
                'weight' => 5.0,
                'description' => 'Véritable huile de palme rouge non raffinée artisanale, idéale pour la préparation des plats traditionnels (Koki, Eru, Ndolé, Sauce jaune). Riche en carotène et vitamines A et E.',
            ],
            [
                'name' => 'Riz Local Parfumé de Ndop Qualité Supérieure Sac 25kg',
                'slug' => 'riz-local-parfume-ndop-25kg',
                'category' => 'food',
                'shop' => 'saveurs-epicerie-fine-bamenda',
                'price' => 22000,
                'stock' => 25,
                'weight' => 25.0,
                'description' => 'Riz long grain naturellement parfumé cultivé dans les plaines fertiles de Ndop. Grains propres, sans brisures, cuisant à la perfection sans coller. Soutenez l\'agriculture locale !',
            ],
            [
                'name' => 'Chips de Plantain Bio Croustillantes Salées Carton de 24 Sachets',
                'slug' => 'chips-plantain-bio-carton-24-sachets',
                'category' => 'food',
                'shop' => 'saveurs-epicerie-fine-bamenda',
                'price' => 7200,
                'stock' => 50,
                'weight' => 1.2,
                'description' => 'En-cas croustillant traditionnel préparé avec des bananes plantains fraîches du Cameroun et cuit à l\'huile de tournesol pure avec une pointe de sel marin. Sans gluten.',
            ],
        ];

        // 4. Insert / Update products with image assignments
        $createdProducts = [];
        $imgIndex = 0;

        foreach ($catalog as $idx => $item) {
            $shop = $createdShops[$item['shop']];
            $assignedImage = $imagePool[$imgIndex % count($imagePool)];
            $imgIndex++;

            $product = Product::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'shop_id' => $shop->id,
                    'name' => $item['name'],
                    'sku' => 'SEL-' . strtoupper(Str::slug($item['category'])) . '-' . str_pad($idx + 1, 4, '0', STR_PAD_LEFT),
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'stock' => $item['stock'],
                    'weight' => $item['weight'],
                    'dimensions' => ['length' => 15, 'width' => 10, 'height' => 5],
                    'alert_threshold' => 3,
                    'stock_status' => 'in_stock',
                    'image_paths' => [$assignedImage],
                    'is_active' => true,
                    'is_archived' => false,
                ]
            );

            $createdProducts[] = $product;
        }

        // 5. Clean previous promotions and assign:
        // 20 Ventes Flash (25% to 50% discount)
        // 10 Promotions Classiques (10% to 20% discount)
        Promotion::query()->delete();

        $today = now()->toDateString();
        $flashEndDate = now()->addDays(5)->toDateString();
        $promoEndDate = now()->addDays(15)->toDateString();
        $startDate = now()->subDay()->toDateString();

        // 20 VENTES FLASH
        $flashProducts = array_slice($createdProducts, 0, 20);
        $flashDiscounts = [30, 40, 25, 35, 50, 30, 45, 25, 40, 35, 50, 30, 25, 40, 35, 45, 30, 50, 25, 35];

        foreach ($flashProducts as $i => $prod) {
            $discountPct = $flashDiscounts[$i % count($flashDiscounts)];
            $promoPrice = round($prod->price * (1 - ($discountPct / 100)));

            Promotion::create([
                'shop_id' => $prod->shop_id,
                'product_id' => $prod->id,
                'promo_price' => $promoPrice,
                'discount_percentage' => $discountPct,
                'start_date' => $startDate,
                'end_date' => $flashEndDate,
                'is_active' => true,
            ]);
        }

        // 10 PROMOTIONS CLASSIQUES
        $promoProducts = array_slice($createdProducts, 20, 10);
        $promoDiscounts = [15, 20, 10, 15, 20, 12, 18, 15, 10, 20];

        foreach ($promoProducts as $i => $prod) {
            $discountPct = $promoDiscounts[$i % count($promoDiscounts)];
            $promoPrice = round($prod->price * (1 - ($discountPct / 100)));

            Promotion::create([
                'shop_id' => $prod->shop_id,
                'product_id' => $prod->id,
                'promo_price' => $promoPrice,
                'discount_percentage' => $discountPct,
                'start_date' => $startDate,
                'end_date' => $promoEndDate,
                'is_active' => true,
            ]);
        }

        // 6. CREATE 5 ACTIVE SMART-LINKS
        SmartLink::query()->delete();

        $smartLinkProducts = [
            $createdProducts[0],  // iPhone 15 Pro Max
            $createdProducts[10], // Bazin Riche Getzner
            $createdProducts[20], // Réfrigérateur Samsung
            $createdProducts[28], // Beurre de Karité Pur Bio
            $createdProducts[43], // Poivre Blanc de Penja IGP
        ];

        foreach ($smartLinkProducts as $idx => $prod) {
            $token = 'sl_' . Str::random(16);
            $trackingCode = 'SL-' . strtoupper(Str::random(8));

            SmartLink::create([
                'seller_id' => $prod->shop->seller_id,
                'product_id' => $prod->id,
                'title' => 'Offre Spéciale WhatsApp : ' . $prod->name,
                'token' => $token,
                'items' => [
                    [
                        'product_id' => $prod->id,
                        'name' => $prod->name,
                        'price' => (float) $prod->price,
                        'quantity' => 1,
                    ]
                ],
                'price_at_time' => $prod->price,
                'subtotal' => $prod->price,
                'discount_amount' => 0.00,
                'shipping_fee' => 2000.00,
                'total_price' => $prod->price + 2000.00,
                'notes' => 'Lien de commande express avec garantie séquestre Escrow.',
                'tracking_code' => $trackingCode,
                'status' => 'active',
                'clicks_count' => rand(15, 120),
                'conversions_count' => rand(2, 18),
                'expires_at' => now()->addDays(30),
            ]);
        }
    }
}
