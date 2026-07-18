import os
import sys
import subprocess

# Ensure fpdf2 is installed
try:
    from fpdf import FPDF
except ImportError:
    print("Installing fpdf2 library...")
    subprocess.run([sys.executable, "-m", "pip", "install", "fpdf2"], check=True)
    from fpdf import FPDF

class SellifyPDF(FPDF):
    def header(self):
        # Header banner
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(100, 100, 100)
        self.cell(0, 10, "SELLIFY.ME  |  PLAN D'IMPLEMENTATION TECHNIQUE - MODULE VENDEURS", 0, 0, "L")
        self.cell(0, 10, "CONFIDENTIEL", 0, 1, "R")
        # Thin line under header
        self.set_draw_color(220, 220, 220)
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
    pdf.set_font("Helvetica", "B", 24)
    pdf.set_text_color(26, 36, 43) # Dark Navy
    pdf.cell(0, 20, "PLAN D'IMPLÉMENTATION", 0, 1, "C")
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(234, 179, 8) # Brand Yellow
    pdf.cell(0, 10, "MODULE VENDEUR (SaaS, Smart-Link & SellifyPay)", 0, 1, "C")
    
    pdf.ln(10)
    
    # Metadata Block
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(50, 50, 50)
    pdf.set_fill_color(250, 250, 250)
    pdf.cell(0, 8, "  Détails du Document", 0, 1, "L", fill=True)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(50, 8, "  Projet :", 0, 0, "L")
    pdf.cell(0, 8, "Sellify.me - Marketplace de Confiance", 0, 1, "L")
    pdf.cell(50, 8, "  Auteur :", 0, 0, "L")
    pdf.cell(0, 8, "Antigravity Architecte IA", 0, 1, "L")
    pdf.cell(50, 8, "  Cible :", 0, 0, "L")
    pdf.cell(0, 8, "Développeurs & Administrateurs", 0, 1, "L")
    pdf.cell(50, 8, "  Statut :", 0, 0, "L")
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(22, 163, 74) # Green
    pdf.cell(0, 8, "Prêt pour Développement", 0, 1, "L")
    
    pdf.set_text_color(50, 50, 50)
    pdf.ln(10)
    
    # Introduction
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "1. INTRODUCTION ET OBJECTIFS", 0, 1, "L")
    pdf.set_font("Helvetica", "", 10)
    intro_text = (
        "Le module Vendeur constitue le cœur SaaS de la proposition de valeur de Sellify.me. "
        "Il permet aux PME et micro-entrepreneurs africains d'établir une boutique en ligne "
        "professionnelle, de gérer leur inventaire, d'accéder au 'Smart-Link' pour vendre directement "
        "sur les réseaux sociaux, et d'obtenir des micro-prêts via SellifyPay en fonction de leurs performances. "
        "Ce plan d'implémentation détaille les étapes techniques de réalisation, les modèles de données, "
        "les logiques métiers et les contrôles de sécurité à mettre en place."
    )
    pdf.multi_cell(0, 6, intro_text)
    pdf.ln(8)
    
    # Data Modeling
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "2. MODELISATION DES DONNÉES (POSTGRESQL)", 0, 1, "L")
    pdf.set_font("Helvetica", "", 10)
    
    schema_intro = (
        "L'implémentation s'appuiera sur des migrations PostgreSQL pour structurer les tables transactionnelles "
        "et MongoDB pour les données analytiques (logs d'inventaire, prédictions et scoring IA)."
    )
    pdf.multi_cell(0, 6, schema_intro)
    pdf.ln(4)
    
    # Table details
    tables = [
        ("sellers", "id, user_id (FK), status (pending, approved, rejected), pack (starter, pro, business), is_verified, verified_at, wallet_balance, bank_details, phone_momo"),
        ("products", "id, seller_id (FK), category_id (FK), title, slug, description, price, compare_at_price, stock, alert_threshold, weight, status (active, inactive, archived)"),
        ("product_variants", "id, product_id (FK), sku, title, price, stock, options (JSONb: {color: 'red', size: 'XL'})"),
        ("seller_subscriptions", "id, seller_id (FK), pack_id, status (active, expired, cancelled), started_at, expires_at, next_billing_at"),
        ("smart_links", "id, seller_id (FK), product_id (FK), token (unique), price_at_time, status (active, paid, expired, cancelled), expires_at, order_id (FK nullable)"),
        ("seller_loans", "id, seller_id (FK), amount, interest_rate, duration_months, status (pending, active, completed, defaulted), disbursed_at, amount_repaid, contract_pdf_url")
    ]
    
    for title, fields in tables:
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(0, 6, f"Table: {title}", 0, 1, "L")
        pdf.set_font("Helvetica", "I", 9)
        pdf.multi_cell(0, 5, f"Champs : {fields}")
        pdf.ln(2)
        
    pdf.ln(4)
    
    # Phase-by-phase Plan
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, "3. PHASES D'IMPLÉMENTATION TECHNIQUE", 0, 1, "L")
    
    phases = [
        ("Phase 1 : Onboarding KYC Strict & Boutique", 
         "• Interface : Formulaire multi-étapes React/Inertia (Informations commerciales -> Documents).\n"
         "• KYC : Intégration de KycService pour l'envoi sécurisé des pièces (CNI/Registre de commerce).\n"
         "• Emails : Envoi de l'email d'inscription réussie et confirmation de réception KYC.\n"
         "• Middleware : Protection des routes critiques pour n'autoriser les actions de vente qu'aux profils kyc_status == 'verified'."),
        
        ("Phase 2 : SaaS Abonnements & Limitations de Catalogue",
         "• Packs d'abonnement : Starter (Gratuit, max 50 produits, commission 12-15%), Pro (15 000 FCFA/mois, commission 8-11%), Business (40 000 FCFA/mois, commission 5-7%).\n"
         "• Contrôle : Implémentation du middleware 'subscription:pro_business' pour bloquer les fonctionnalités avancées.\n"
         "• Logique catalogue : Blocage de la création de produit au-delà de 50 pour le pack Starter."),
        
        ("Phase 3 : Smart-Link (Social Commerce)",
         "• URL unique : Génération en un clic de liens de paiement https://sellify.me/pay/{token} via un token UUID court.\n"
         "• Fast Checkout : Page React ultra-légère (< 2s de chargement en 3G) sans obligation d'avoir un compte client.\n"
         "• Paiement : Intégration Escrow via Mobile Money (Orange Money, MTN MoMo) pour sécuriser la transaction."),
        
        ("Phase 4 : SellifyPay (Accès aux Micro-Prêts)",
         "• Scoring IA : Intégration de calculateSellerScore() évaluant le GMV moyen (3 mois), les avis et le taux de litiges (seuil éligibilité >= 60/100).\n"
         "• Contrat numérique : Génération de contrat PDF conforme à la loi OHADA et signature avec code OTP.\n"
         "• Prélèvement : Prélèvement automatique par EscrowService de maximum 30% sur chaque transaction Escrow débloquée jusqu'au remboursement complet."),
        
        ("Phase 5 : Gestion des Commandes & Litiges",
         "• Commandes : Dashboard de gestion des commandes reçues avec statuts en temps réel.\n"
         "• Litiges : Interface de défense pour téléverser les preuves de conformité (photos avant expédition) sous un délai maximum de 48 heures.")
    ]
    
    for p_title, p_desc in phases:
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(26, 36, 43)
        pdf.cell(0, 6, p_title, 0, 1, "L")
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(70, 70, 70)
        pdf.multi_cell(0, 5, p_desc)
        pdf.ln(3)

    # Security and Quality
    pdf.ln(5)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(26, 36, 43)
    pdf.cell(0, 8, "4. SECURITÉ ET CONTRAINTES TECHNIQUES", 0, 1, "L")
    pdf.set_font("Helvetica", "", 10)
    
    sec_text = (
        "• Chiffrement au repos : Tous les documents KYC sensibles téléversés doivent être chiffrés en AES-256-GCM.\n"
        "• Anti-fraude : Détection des doublons sur les numéros de CNI et RCCM pour éviter la création de faux comptes.\n"
        "• Performance : Optimisation des requêtes de catalogue et de recherche avec des index PostgreSQL. Cache Redis de 5 minutes sur les données non transactionnelles du dashboard."
    )
    pdf.multi_cell(0, 6, sec_text)
    
    # Save the PDF
    pdf.output("Plan_Implementation_Module_Vendeurs.pdf")
    print("PDF generated successfully.")

if __name__ == "__main__":
    create_implementation_plan()
