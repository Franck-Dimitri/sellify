<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification de votre compte Sellify.me</title>
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
        .code-container {
            background-color: #FEFCE8;
            border: 2px dashed #FACC15;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin-bottom: 30px;
        }
        .code-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #854D0E;
            margin-bottom: 8px;
            display: block;
        }
        .code-value {
            font-size: 36px;
            font-weight: 900;
            letter-spacing: 0.25em;
            color: #A16207;
            font-family: monospace;
            margin: 0;
        }
        .warning-text {
            font-size: 12px;
            color: #A3A3A3;
            text-align: center;
            margin-bottom: 0;
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
                <h1>Vérification de votre compte</h1>
                <p>Bonjour {{ $user->first_name }},</p>
                <p>Merci de vous être inscrit sur Sellify.me. Pour finaliser la création de votre compte et accéder à votre tableau de bord, veuillez saisir le code de vérification ci-dessous :</p>
                
                <div class="code-container">
                    <span class="code-label">Votre code à 6 chiffres</span>
                    <h2 class="code-value">{{ $otpCode }}</h2>
                </div>

                <p>Ce code est valable pendant <strong>15 minutes</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>
                
                <p class="warning-text">Veuillez ne jamais partager ce code avec qui que ce soit, y compris les membres de notre équipe.</p>
            </div>
            <div class="footer">
                © {{ date('Y') }} Sellify.me. Tous droits réservés.<br>
                Propulsé par la logistique IA et la confiance Escrow.
            </div>
        </div>
    </div>
</body>
</html>
