<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre compte livreur Sellify.me est activé !</title>
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
            color: #16A34A; /* Green success color */
        }
        p {
            font-size: 15px;
            line-height: 1.6;
            color: #525252;
            margin-top: 0;
            margin-bottom: 24px;
        }
        .success-box {
            background-color: #F0FDF4;
            border: 1px dashed #4ADE80;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin-bottom: 30px;
        }
        .success-title {
            font-size: 16px;
            font-weight: 700;
            color: #166534;
            margin-bottom: 8px;
            display: block;
        }
        .success-text {
            font-size: 14px;
            color: #15803d;
            margin: 0;
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
                <h1>Félicitations, vous pouvez commencer à livrer !</h1>
                <p>Bonjour {{ $user->first_name }},</p>
                <p>Nous avons le plaisir de vous annoncer que votre dossier d'identité et vos justificatifs de véhicule (KYC) ont été <strong>approuvés et validés avec succès</strong> par notre équipe.</p>
                
                <div class="success-box">
                    <span class="success-title">Votre compte de livreur est pleinement actif !</span>
                    <p class="success-text">Vous pouvez désormais vous connecter à l'application, configurer votre zone de couverture et commencer à accepter des missions de livraison.</p>
                </div>

                <div class="btn-container">
                    <a href="{{ route('driver.dashboard') }}" class="btn">Accéder à mon tableau de bord</a>
                </div>

                <p>Si vous avez des questions sur la prise en main des livraisons, le système de paiement ou les règles de sécurité, n'hésitez pas à consulter notre guide du livreur ou à contacter l'assistance.</p>
                
                <p>Bienvenue à bord et excellentes courses avec Sellify.me !</p>
            </div>
            <div class="footer">
                © {{ date('Y') }} Sellify.me. Tous droits réservés.<br>
                Propulsé par la logistique IA et la confiance Escrow.
            </div>
        </div>
    </div>
</body>
</html>
