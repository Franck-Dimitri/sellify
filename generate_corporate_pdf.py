import os
import sys
from fpdf import FPDF
from fpdf.enums import XPos, YPos

class CorporateSellifyPDF(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_auto_page_break(auto=True, margin=20)
        
        # Load Full Unicode Fonts
        font_dir = "/usr/share/fonts/truetype/dejavu"
        self.add_font("DejaVu", "", os.path.join(font_dir, "DejaVuSans.ttf"))
        self.add_font("DejaVu", "B", os.path.join(font_dir, "DejaVuSans-Bold.ttf"))
        self.add_font("DejaVu", "I", os.path.join(font_dir, "DejaVuSans-Oblique.ttf"))

    def header(self):
        if self.page_no() == 1:
            return
        
        self.set_font("DejaVu", "B", 8)
        self.set_text_color(100, 116, 139) # Slate 500
        self.cell(100, 8, "SELLIFY.ME  |  DOSSIER DE PRÉSENTATION OFFICIEL DU PROJET", new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.cell(90, 8, "CONFIDENTIEL", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        
        # Golden line under header
        self.set_draw_color(234, 179, 8) # Brand Yellow
        self.set_line_width(0.5)
        self.line(10, 15, 200, 15)
        self.ln(6)

    def footer(self):
        if self.page_no() == 1:
            return
        
        self.set_y(-14)
        self.set_font("DejaVu", "I", 8)
        self.set_text_color(148, 163, 184) # Slate 400
        self.cell(100, 8, f"Page {self.page_no()}/{{nb}}", align="L", new_x=XPos.RIGHT, new_y=YPos.TOP)
        self.cell(90, 8, "Sellify.me © 2026 — Tous droits réservés", align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def section_title(self, num, title):
        self.ln(4)
        self.set_fill_color(248, 250, 252) # Light Slate
        self.set_draw_color(234, 179, 8)   # Gold Yellow
        self.set_line_width(0.8)
        
        self.set_font("DejaVu", "B", 12)
        self.set_text_color(15, 23, 42) # Slate 900
        self.cell(190, 9, f"  {num}. {title.upper()}", border=1, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(3)

    def subsection_title(self, title):
        self.set_font("DejaVu", "B", 10.5)
        self.set_text_color(202, 138, 4) # Gold 600
        self.cell(190, 6, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def body_paragraph(self, text):
        self.set_font("DejaVu", "", 9)
        self.set_text_color(51, 65, 85) # Slate 700
        self.multi_cell(190, 4.8, text)
        self.ln(2)

    def info_callout(self, text, title="POINT CLÉ STRATÉGIQUE"):
        self.set_fill_color(254, 252, 232) # Light Yellow 50
        self.set_draw_color(250, 204, 21)  # Yellow 400
        self.set_line_width(0.4)
        self.set_font("DejaVu", "B", 8.5)
        self.set_text_color(161, 98, 7)     # Yellow 700
        self.cell(190, 6, f"  {title}", border="LTR", fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_font("DejaVu", "", 8.5)
        self.set_text_color(66, 32, 6)      # Yellow 950
        self.multi_cell(190, 4.5, f"  {text}", border="LBR", fill=True)
        self.ln(3)

def generate_pdf():
    pdf = CorporateSellifyPDF()
    pdf.alias_nb_pages()

    # =========================================================================
    # PAGE 1 : PREMIÈRE DE COUVERTURE CORPORATE
    # =========================================================================
    pdf.add_page()
    
    # Background Dark Slate
    pdf.set_fill_color(15, 23, 42) # #0F172A
    pdf.rect(0, 0, 210, 297, "F")

    # Golden accent top bar
    pdf.set_fill_color(234, 179, 8) # #EAB308
    pdf.rect(0, 0, 210, 8, "F")

    pdf.set_y(35)
    
    # Tag Badge
    pdf.set_fill_color(30, 41, 59)
    pdf.set_draw_color(234, 179, 8)
    pdf.set_line_width(0.4)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(250, 204, 21)
    pdf.cell(190, 8, "DOCUMENT DE RÉFÉRENCE STRATÉGIQUE & TECHNIQUE", border=1, align="C", fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.ln(12)

    # Logo / Project Name
    pdf.set_font("DejaVu", "B", 32)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(190, 14, "SELLIFY.ME", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Subtitle
    pdf.set_font("DejaVu", "B", 14)
    pdf.set_text_color(234, 179, 8)
    pdf.cell(190, 10, "La Plateforme E-Commerce de Confiance pour l'Afrique", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.ln(4)

    # Slogan / Pillars
    pdf.set_font("DejaVu", "", 9.5)
    pdf.set_text_color(148, 163, 184)
    pdf.cell(190, 6, "Marketplace Multi-Acteurs · Séquestre Escrow Mobile Money · Logistique IA · Smart-Links", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.ln(30)

    # Center Metadata Box
    pdf.set_fill_color(30, 41, 59)
    pdf.set_draw_color(51, 65, 85)
    pdf.set_line_width(0.5)
    
    box_x = 20
    box_y = pdf.get_y()
    pdf.rect(box_x, box_y, 170, 78, "FD")
    
    pdf.set_xy(box_x + 6, box_y + 6)
    pdf.set_font("DejaVu", "B", 10.5)
    pdf.set_text_color(234, 179, 8)
    pdf.cell(158, 6, "FICHE D'IDENTITÉ DU PROJET", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(2)

    fields = [
        ("Version du Document :", "v1.2 (Conforme au Cahier des Charges & Code Source)"),
        ("Nature du Projet :", "Plateforme E-Commerce & SaaS Marchand de Confiance"),
        ("Zone de Déploiement :", "Phase 1 : Cameroun (Douala & Yaoundé) | Phase 2 : Panafrique"),
        ("Stack Principale :", "Laravel 11, React 19, Inertia.js, PostgreSQL, OSRM, IA 1.2 Flash"),
        ("Statut de Production :", "MVP & V1 Validés — 100% Tests Passés (47/47)"),
        ("Date d'Édition :", "Août 2026 — Confidentiel & Propriétaire"),
    ]

    for label, val in fields:
        pdf.set_x(box_x + 6)
        pdf.set_font("DejaVu", "B", 8)
        pdf.set_text_color(226, 232, 240)
        pdf.cell(48, 6.5, label, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_font("DejaVu", "", 8)
        pdf.set_text_color(203, 213, 225)
        pdf.cell(110, 6.5, val, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Bottom Footer on Cover
    pdf.set_y(260)
    pdf.set_font("DejaVu", "I", 8)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(190, 5, "Propriété exclusive de Sellify.me — Toute reproduction ou diffusion sans accord préalable est interdite.", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.cell(190, 5, "Douala · Yaoundé · Afrique Centrale", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # =========================================================================
    # PAGE 2 : SOMMAIRE & EXECUTIVE SUMMARY
    # =========================================================================
    pdf.add_page()
    pdf.set_text_color(15, 23, 42)

    pdf.section_title("1", "Executive Summary & Vision Stratégique")
    pdf.body_paragraph(
        "Sellify.me est une infrastructure technologique de confiance conçue pour débloquer le potentiel "
        "du commerce en ligne en Afrique subsaharienne. En s'appuyant sur l'omniprésence du Mobile Money (Orange Money, "
        "MTN MoMo), Sellify.me introduit un compte séquestre numérique (Escrow) inviolable qui éradique la méfiance "
        "entre acheteurs et vendeurs."
    )
    pdf.body_paragraph(
        "La plateforme intègre une suite SaaS permettant aux commerçants informels (WhatsApp, Facebook, TikTok) de "
        "professionnaliser leur activité grâce aux Smart-Links 1-clic, un réseau de chauffeurs-livreurs autonomes avec "
        "navigation GPS OSRM embarquée et un copilote IA universel (Sellify AI 1.2 Flash) supervisant l'ensemble des flux opérationnels."
    )

    pdf.info_callout(
        "Le marché cible immédiat (Cameroun) totalise plus de 80% de transactions dématérialisées via Mobile Money. "
        "Sellify élimine le modèle archaïque du Cash on Delivery (COD) et garantit 100% des règlements.",
        "OPPORTUNITÉ DE MARCHÉ"
    )

    pdf.section_title("2", "Problématiques Adressées & Solution Sellify")
    
    # Table Comparison
    pdf.set_font("DejaVu", "B", 8)
    pdf.set_fill_color(241, 245, 249)
    pdf.cell(38, 7, " Dimension", border=1, fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(76, 7, " Commerce Informel (Avant)", border=1, fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(76, 7, " Solution Sellify.me", border=1, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    rows = [
        ("Confiance Acheteur", "Peur des arnaques, pas de recours", "Paiement bloqué en séquestre Escrow"),
        ("Sécurité Marchand", "Refus à la livraison (>35% de pertes)", "Fonds garantis avant expédition du colis"),
        ("Logistique & Routage", "Appels incessants, pas d'adresses", "Guidage GPS OSRM & Télémétrie en direct"),
        ("Clôture Livraison", "Disputes orales / Litiges fréquents", "Double validation : Code OTP Secret + Signature"),
        ("Outils de Vente", "Catalogues photos désorganisés", "Smart-Links 1-clic & Boutiques SaaS dédiées"),
    ]

    pdf.set_font("DejaVu", "", 8)
    for dim, before, after in rows:
        pdf.set_text_color(51, 65, 85)
        pdf.cell(38, 6.5, f" {dim}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_text_color(225, 29, 72) # Red
        pdf.cell(76, 6.5, f" {before}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_text_color(5, 150, 105) # Emerald Green
        pdf.cell(76, 6.5, f" {after}", border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.ln(4)

    # =========================================================================
    # PAGE 3 : ARCHITECTURE DES MODULES
    # =========================================================================
    pdf.add_page()
    pdf.section_title("3", "Architecture Fonctionnelle des Modules")

    pdf.subsection_title("3.1 Module Client (Acheteur)")
    pdf.body_paragraph(
        "• Parcours d'achat fluide : Recherche temps réel, filtres facettés et panier multi-boutiques.\n"
        "• Fast Checkout & Smart-Link : Paiement en 1 clic via Mobile Money (Orange Money / MTN MoMo).\n"
        "• Suivi Géolocalisé Interactif : Visualisation sur carte Leaflet avec tracé routier réel OSRM.\n"
        "• Code OTP Secret & Confirmation : Clôture de la transaction en toute souveraineté.\n"
        "• Fidélité Gamifiée : Cumul de points échangeables contre des remises (1 pt / 100 FCFA)."
    )

    pdf.subsection_title("3.2 Module Vendeur (Suite SaaS & Smart-Links)")
    pdf.body_paragraph(
        "• Espace Centralisé Multi-Boutiques : Supervision unifiée du catalogue, des stocks et variantes.\n"
        "• Smart-Links de Vente Sociale : Génération instantanée de liens de commande pour WhatsApp et TikTok.\n"
        "• Portefeuille Financier & Grand Livre : Séparation Solde Disponible / Solde Séquestre, graphiques d'évolution des flux, exports de transactions en CSV et Relevés de Compte Officiels (PDF).\n"
        "• Moteur Promotionnel : Création de codes promo, remises temporaires et paliers quantitatifs."
    )

    pdf.subsection_title("3.3 Module Livreur (Chauffeur & Télémétrie)")
    pdf.body_paragraph(
        "• Console Chauffeur & KYC : Agrément après vérification des pièces d'identité et du véhicule.\n"
        "• Dispatch Intelligent par IA : Attribution des courses optimisée selon la proximité et la charge.\n"
        "• Guidage GPS Turn-by-Turn Embarqué : Navigation routière autonome sans quitter l'application.\n"
        "• Double Sécurité de Clôture : Saisie obligatoire de l'OTP client + signature tactile sur écran."
    )

    pdf.subsection_title("3.4 Module SuperAdmin & Arbitrage")
    pdf.body_paragraph(
        "• Supervision KPI Globale : Suivi des volumes sous séquestre, commissions plateforme (3%) et flux.\n"
        "• Centre d'Arbitrage des Litiges : Décision de déblocage vendeur ou de remboursement acheteur.\n"
        "• Audit Trail Immuable : Traçabilité détaillée de chaque événement dans les journaux d'activité."
    )

    # =========================================================================
    # PAGE 4 : SÉQUESTRE ESCROW & MOTEUR IA
    # =========================================================================
    pdf.add_page()
    pdf.section_title("4", "Mécanique du Séquestre Escrow & Moteur IA")

    pdf.subsection_title("4.1 Le Cycle de Vie Transactionnel Escrow")
    pdf.body_paragraph(
        "Le séquestre Sellify.me garantit une atomicité parfaite des transactions :"
    )

    steps = [
        ("Étape 1 : Encaissement & Consignation", "Dès validation du paiement Mobile Money par le client, les fonds sont crédités sur le pending_balance (solde bloqué) du vendeur. La commande passe au statut escrow_held et un code OTP secret à 6 chiffres est généré."),
        ("Étape 2 : Préparation & Acheminement", "Le marchand prépare le colis et le remet au chauffeur livreur qui se déplace avec le guidage GPS temps réel."),
        ("Étape 3 : Déblocage Automatique", "Lors de la remise, la saisie du code OTP secret par le livreur ou le clic de confirmation de l'acheteur bascule instantanément les fonds de pending_balance vers balance (solde disponible retirable). Le livreur perçoit ses frais et l'acheteur ses points."),
        ("Étape 4 : Gestion des Litiges & Annulations", "En cas de non-conformité avérée ou d'annulation avant expédition, EscrowService restitue les fonds à l'acheteur et remet les articles en stock."),
    ]

    for title, desc in steps:
        pdf.set_font("DejaVu", "B", 8)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(190, 5, f"• {title}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font("DejaVu", "", 8)
        pdf.set_text_color(71, 85, 105)
        pdf.multi_cell(190, 4.5, f"  {desc}")
        pdf.ln(1.5)

    pdf.ln(2)
    pdf.subsection_title("4.2 Moteur Sellify AI 1.2 Flash")
    pdf.body_paragraph(
        "Intégré à travers tous les dashboards (Acheteur, Vendeur, Livreur, Admin), l'assistant conversationnel "
        "universel propose la reconnaissance et synthèse vocale (STT/TTS), la génération de fiches produits optimisées, "
        "l'aide au routage et la détection d'anomalies financières."
    )

    # =========================================================================
    # PAGE 5 : STACK TECHNIQUE, BUSINESS MODEL & ROADMAP
    # =========================================================================
    pdf.add_page()
    pdf.section_title("5", "Architecture Technique & Modèle Économique")

    pdf.subsection_title("5.1 Stack Technologique & Performances")
    pdf.body_paragraph(
        "• Backend : Laravel 11.x (Architecture Service Layer, EscrowService, Transactions DB atomiques).\n"
        "• Frontend : React 19 + Inertia.js (Single Page Application réactive sans latence REST).\n"
        "• Base de Données : PostgreSQL 16 (Modélisation relationnelle stricte + coordonnées géodésiques).\n"
        "• Cartographie & Logistique : Leaflet.js, OpenStreetMap, Serveur OSRM Road Routing.\n"
        "• Assurance Qualité : 100% de réussite aux tests automatisés PHPUnit (47 tests, 255 assertions)."
    )

    pdf.subsection_title("5.2 Modèle de Revenus (Business Model)")
    
    # Revenue streams table
    pdf.set_font("DejaVu", "B", 7.5)
    pdf.set_fill_color(241, 245, 249)
    pdf.cell(48, 6.5, " Source de Revenu", border=1, fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(48, 6.5, " Tarification", border=1, fill=True, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(94, 6.5, " Description & Valeur Ajoutée", border=1, fill=True, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    bmodels = [
        ("Commission Escrow", "3 % par vente", "Sécurisation intégrale de la transaction marchande"),
        ("Abonnements SaaS Pro", "15 000 FCFA / mois", "Boutiques illimitées, Smart-Links avancés, IA Copilote"),
        ("Abonnements Enterprise", "45 000 FCFA / mois", "Comptabilité multi-sites, API et support dédié"),
        ("Marge Logistique", "10 % à 15 % / course", "Mise en relation et optimisation de tournée chauffeur"),
    ]

    pdf.set_font("DejaVu", "", 7.5)
    for stream, price, desc in bmodels:
        pdf.set_text_color(15, 23, 42)
        pdf.cell(48, 6, f" {stream}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_text_color(202, 138, 4)
        pdf.cell(48, 6, f" {price}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_text_color(71, 85, 105)
        pdf.cell(94, 6, f" {desc}", border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.ln(4)

    pdf.section_title("6", "Feuille de Route Stratégique (Roadmap)")
    pdf.body_paragraph(
        "• 2026 Q3 (Actuel) : Lancement officiel Douala & Yaoundé, validation de l'Escrow OM/MoMo et de l'IA.\n"
        "• 2026 Q4 : Déploiement des applications mobiles natives Android/iOS et expansion dans les villes secondaires.\n"
        "• 2027 Q1-Q2 : Déploiement dans la zone CEMAC (Gabon, Congo, Tchad) et interconnexion bancaire régionale."
    )

    pdf.ln(6)
    # Final Sign-off Box
    pdf.set_fill_color(15, 23, 42)
    pdf.rect(10, pdf.get_y(), 190, 24, "F")
    pdf.set_y(pdf.get_y() + 3)
    pdf.set_font("DejaVu", "B", 9.5)
    pdf.set_text_color(234, 179, 8)
    pdf.cell(190, 5, "SELLIFY.ME — BÂTIR L'AVENIR DU COMMERCE DE CONFIANCE EN AFRIQUE", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("DejaVu", "", 8)
    pdf.set_text_color(203, 213, 225)
    pdf.cell(190, 5, "Contact officiel Direction : direction@sellify.me | Site : https://sellify.me", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.cell(190, 5, "Document d'Ingénierie & Synthèse de Projet — Certifié Conforme", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    # Output file
    output_path = "/home/mr-dims-tech/developpement/developpement_laravel/mr_dims/sellify/Dossier_Presentation_Projet_Sellify.pdf"
    pdf.output(output_path)
    print(f"PDF Successfully updated at: {output_path}")

if __name__ == "__main__":
    generate_pdf()
