import os
import sys
import subprocess

# Ensure fpdf2 is installed
try:
    from fpdf import FPDF
except ImportError:
    print("Installing fpdf2 library for PDF generation...")
    subprocess.run([sys.executable, "-m", "pip", "install", "fpdf2"], check=True)
    from fpdf import FPDF

class SellifyPDF(FPDF):
    def header(self):
        # Header banner
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, "SELLIFY.ME  |  PLAN D'IMPLEMENTATION TECHNIQUE (V3) - BOUTIQUES", 0, 0, "L")
        self.cell(0, 10, "CONFIDENTIEL", 0, 1, "R")
        # Thin line under header
        self.set_draw_color(234, 179, 8) # Brand Yellow
        self.line(10, 18, 200, 18)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", 0, 0, "C")
        self.cell(0, 10, "Sellify.me © 2026", 0, 0, "R")

def create_implementation_plan():
    pdf = SellifyPDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    
    # Title Page style / Header
    pdf.set_font("Helvetica", "B", 22)
    pdf.set_text_color(26, 36, 43) # Dark Navy
    pdf.cell(0, 15, "PLAN D'IMPLÉMENTATION TECHNIQUE (V3)", 0, 1, "C")
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(234, 179, 8) # Brand Yellow
    pdf.cell(0, 10, "MODULE DE CREATION DE BOUTIQUE PROFESSIONNELLE", 0, 1, "C")
    
    pdf.ln(10)
    
    # Metadata Block
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(50, 50, 50)
    pdf.set_fill_color(245, 245, 245)
    pdf.cell(0, 8, "  Détails du Document", 0, 1, "L", fill=True)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(50, 8, "  Projet :", 0, 0, "L")
    pdf.cell(0, 8, "Sellify.me - Marketplace de Confiance pour le Commerce Africain", 0, 1, "L")
    pdf.cell(50, 8, "  Contexte :", 0, 0, "L")
    pdf.cell(0, 8, "Boutiques Professionnelles (Style Alibaba)", 0, 1, "L")
    pdf.cell(50, 8, "  Abonnement par défaut :", 0, 0, "L")
    pdf.cell(0, 8, "Pack Starter (1 Boutique, Max 30 Produits)", 0, 1, "L")
    pdf.cell(50, 8, "  Cible :", 0, 0, "L")
    pdf.cell(0, 8, "Equipe Backend & Intégration Architecture", 0, 1, "L")
    pdf.cell(50, 8, "  Statut :", 0, 0, "L")
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(22, 163, 74) # Green
    pdf.cell(0, 8, "Validé pour Code (Post-KYC)", 0, 1, "L")
    
    pdf.set_text_color(50, 50, 50)
    pdf.ln(10)
    
    # Introduction
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "1. CONTEXTE ET RÈGLES COMMERCIALES", 0, 1, "L")
    pdf.set_font("Helvetica", "", 10)
    intro_text = (
        "Le module Boutique est au centre de l'activité commerciale des vendeurs de Sellify.me. "
        "Les vendeurs ne peuvent pas vendre sans avoir créé leur boutique. Par défaut, tous les vendeurs "
        "commencent avec le pack Starter. Ce pack requiert la validation KYC préalable et l'activation du "
        "profil vendeur. Sous le pack Starter, le vendeur est limité à la création d'une seule boutique "
        "contenant au maximum 30 produits. Pour cette phase de développement, nous concevons une boutique "
        "professionnelle moderne, structurée à l'image des vitrines d'Alibaba (Branding, informations de "
        "certification de l'entreprise, coordonnées de contact, horaires et réseaux sociaux)."
    )
    pdf.multi_cell(0, 6, intro_text)
    pdf.ln(8)
    
    # Structure de données
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "2. STRUCTURE DE LA BASE DE DONNÉES (Table: 'shops')", 0, 1, "L")
    pdf.set_font("Helvetica", "", 10)
    
    table_text = (
        "La boutique professionnelle sera représentée par la table 'shops' reliée en relation 1:1 "
        "avec la table 'sellers' afin de garantir la limite d'une seule boutique par vendeur sous le pack Starter."
    )
    pdf.multi_cell(0, 6, table_text)
    pdf.ln(4)
    
    fields = [
        ("id", "BIGINT, Clé primaire auto-incrémentée"),
        ("seller_id", "BIGINT, Clé étrangère unique vers 'sellers' (Limite 1-to-1)"),
        ("name", "VARCHAR(255), Nom commercial de la boutique"),
        ("slug", "VARCHAR(255), Slug unique pour l'URL publique (sellify.me/boutique/{slug})"),
        ("slogan", "VARCHAR(255), Slogan ou phrase d'accroche commercial"),
        ("description", "TEXT, Description détaillée de l'activité"),
        ("logo_path / banner_path", "VARCHAR(255), Chemins vers les images de marque"),
        ("company_name", "VARCHAR(255), Raison sociale ou nom officiel d'établissement"),
        ("registration_number", "VARCHAR(100), Numéro RCCM / Patente commerciale"),
        ("address", "VARCHAR(255), Adresse physique de la boutique ou de l'entrepôt"),
        ("phone_contact", "VARCHAR(50), Téléphone principal pour le service client"),
        ("email_contact", "VARCHAR(255), E-mail de contact direct"),
        ("opening_hours", "JSONB, Jours et horaires d'ouverture de la boutique"),
        ("social_links", "JSONB, Liens vers les comptes sociaux (WhatsApp, Facebook, Instagram)"),
        ("theme_color", "VARCHAR(10), Couleur primaire pour personnaliser la vitrine (défaut: #EAB308)"),
        ("is_active", "BOOLEAN, Indique si la boutique est ouverte (ou mode vacances)")
    ]
    
    for f_name, f_desc in fields:
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(50, 5, f"  {f_name} :", 0, 0, "L")
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 5, f_desc, 0, 1, "L")
        
    pdf.ln(10)
    
    # Logic of execution
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "3. LOGIQUE D'ACCÈS ET MIDDLEWARES", 0, 1, "L")
    pdf.set_font("Helvetica", "", 10)
    
    logique_text = (
        "• Middleware EnsureKycVerified : Ce filtre obligatoire s'applique sur les routes d'édition "
        "et de création de boutique. Si kyc_status != 'verified', la requête est rejetée avec une redirection "
        "vers le tableau de bord d'attente KYC.\n"
        "• Middleware EnsureSingleShopLimit : Lors de la soumission de la création, le backend vérifie "
        "si le vendeur possède déjà un enregistrement dans 'shops'. Si oui, l'accès est bloqué.\n"
        "• Limitation de Catalogue (Starter) : Lors de l'ajout d'un produit, le controlleur vérifie "
        "si la somme des produits de cette boutique est < 30. Au-delà, un message d'erreur invite à passer "
        "au forfait supérieur."
    )
    pdf.multi_cell(0, 6, logique_text)
    pdf.ln(8)

    # Process of implementation
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "4. MÉTHODOLOGIE ET ÉTAPES D'IMPLÉMENTATION", 0, 1, "L")
    
    steps = [
        ("Étape 1 : Base de données & Migrations", 
         "Création de la migration pour la table 'shops' et du modèle Eloquent Shop.php. "
         "Mise en place de la relation hasOne() dans Seller.php et belongsTo() dans Shop.php."),
        
        ("Étape 2 : Middleware de protection",
         "Ajuster ou créer le middleware pour valider que le vendeur possède un dossier KYC validé "
         "avant d'autoriser l'accès aux formulaires de configuration de boutique."),
        
        ("Étape 3 : Contrôleur et Routes",
         "Créer le contrôleur Seller/ShopController.php gérant l'enregistrement (validation des données, "
         "gestion des uploads du logo/bannière via Storage, formatage des heures en JSON, et slugification)."),
        
        ("Étape 4 : Interface React/Inertia.js (Alibaba-Style)",
         "Créer un formulaire de configuration moderne, structuré par onglets ou étapes : "
         "1. Identité visuelle (logo, bannière, slogan, thème) "
         "2. Certification & Confiance (raison sociale, RCCM, adresse physique, contact direct) "
         "3. Opérations (horaires d'ouverture, liens sociaux)."),
        
        ("Étape 5 : Limitation des 30 produits",
         "Ajouter un contrôle dans la création de produit pour vérifier le compteur et bloquer l'action "
         "si la boutique a déjà 30 produits sous le pack Starter.")
    ]
    
    for title, desc in steps:
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(26, 36, 43)
        pdf.cell(0, 6, title, 0, 1, "L")
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(70, 70, 70)
        pdf.multi_cell(0, 5, desc)
        pdf.ln(3)
        
    # Save the PDF
    pdf.output("Plan_Implementation_Boutique_V3.pdf")
    print("PDF Plan_Implementation_Boutique_V3.pdf generated successfully.")

if __name__ == "__main__":
    create_implementation_plan()
