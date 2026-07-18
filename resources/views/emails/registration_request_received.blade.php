<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande d'inscription reçue - Sellify.me</title>
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
        .status-box {
            background-color: #F6F8FA;
            border-left: 4px solid #0366D6;
            border-radius: 4px;
            padding: 16px 20px;
            margin-bottom: 24px;
        }
        .status-title {
            margin-top: 0;
            color: #171717;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .status-text {
            margin: 0;
            font-size: 14px;
            color: #525252;
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
                <h1>Dossier d'inscription reçu !</h1>
                <p>Bonjour {{ $user->first_name }},</p>
                <p>Merci pour votre intérêt à rejoindre Sellify.me en tant que <strong>{{ $user->isSeller() ? 'vendeur professionnel' : 'livreur partenaire' }}</strong>.</p>
                <p>Nous vous confirmons que votre dossier d'inscription ainsi que vos pièces justificatives pour la validation d'identité (KYC) ont été correctement transmis à notre équipe administrative.</p>
                
                <div class="status-box">
                    <h3 class="status-title">Statut de votre demande :</h3>
                    <p class="status-text"><strong>En cours de révision</strong>. Nos administrateurs effectuent les vérifications d'usage sous un délai de 24 heures ouvrées.</p>
                </div>

                <p>Une fois votre dossier validé, vous recevrez un e-mail de confirmation vous informant de l'activation définitive de vos accès.</p>
                
                <p>Nous vous remercions pour votre patience et votre collaboration.</p>
            </div>
            <div class="footer">
                © {{ date('Y') }} Sellify.me. Tous droits réservés.<br>
                Propulsé par la logistique IA et la confiance Escrow.
            </div>
        </div>
    </div>
</body>
</html>
