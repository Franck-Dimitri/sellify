<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue sur Sellify.me</title>
    <style>
        body {
            background-color: #F5F5F5;
            font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            color: #171717;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #F5F5F5;
            padding-top: 40px;
            padding-bottom: 40px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 16px;
            border: 1px solid #E5E5E5;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        .header {
            background-color: #FAFAFA;
            border-bottom: 1px solid #F5F5F5;
            padding: 30px 40px;
            text-align: center;
        }
        .logo-box {
            display: inline-block;
            width: 44px;
            height: 44px;
            line-height: 44px;
            background-color: #EAB308;
            border-radius: 10px;
            font-weight: 800;
            font-size: 24px;
            color: #0A0A0A;
            text-align: center;
        }
        .logo-text {
            font-weight: 800;
            font-size: 20px;
            color: #171717;
            margin-left: 10px;
            vertical-align: middle;
            display: inline-block;
        }
        .content {
            padding: 40px;
        }
        h1 {
            font-size: 22px;
            font-weight: 800;
            margin-top: 0;
            margin-bottom: 16px;
            color: #171717;
        }
        p {
            font-size: 15px;
            line-height: 1.6;
            color: #525252;
            margin-top: 0;
            margin-bottom: 24px;
        }
        .btn-container {
            text-align: center;
            margin: 32px 0;
        }
        .btn {
            display: inline-block;
            background-color: #EAB308;
            color: #0A0A0A;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15px;
            box-shadow: 0 4px 6px -1px rgba(234, 179, 8, 0.2);
            transition: all 0.2s ease-in-out;
        }
        .features-box {
            background-color: #FAFAFA;
            border: 1px solid #E5E5E5;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .features-title {
            margin-top: 0;
            color: #171717;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 12px;
        }
        .features-list {
            margin: 0;
            padding-left: 20px;
            color: #525252;
            font-size: 14px;
            line-height: 1.8;
        }
        .footer {
            background-color: #FAFAFA;
            border-top: 1px solid #F5F5F5;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #A3A3A3;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <span class="logo-box">S</span>
                <span class="logo-text">Sellify.me</span>
            </div>
            <div class="content">
                <h1>Bienvenue sur Sellify.me !</h1>
                <p>Bonjour {{ $user->first_name }},</p>
                <p>Nous sommes ravis de vous accueillir dans la communauté Sellify.me ! Votre compte client a été créé et activé avec succès.</p>
                <p>Vous disposez désormais d'un accès complet à notre plateforme pour effectuer vos achats en toute sérénité.</p>
                
                <div class="btn-container">
                    <a href="{{ config('app.url') }}" class="btn">Commencer vos achats</a>
                </div>

                <div class="features-box">
                    <h3 class="features-title">Ce que vous pouvez faire avec Sellify.me :</h3>
                    <ul class="features-list">
                        <li><strong>Acheter en toute confiance :</strong> Les fonds ne sont versés au vendeur qu'après confirmation de votre livraison grâce à notre système d'Escrow.</li>
                        <li><strong>Suivi en temps réel :</strong> Suivez l'acheminement de vos colis par nos livreurs partenaires étape par étape.</li>
                        <li><strong>Qualité garantie :</strong> Tous nos vendeurs sont rigoureusement vérifiés (KYC) pour vous assurer un service irréprochable.</li>
                    </ul>
                </div>

                <p>Si vous avez des questions ou besoin d'assistance, notre support client est à votre entière disposition.</p>
            </div>
            <div class="footer">
                © {{ date('Y') }} Sellify.me. Tous droits réservés.<br>
                Propulsé par la logistique IA et la confiance Escrow.
            </div>
        </div>
    </div>
</body>
</html>
