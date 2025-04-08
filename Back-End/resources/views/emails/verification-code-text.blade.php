<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email de Vérification</title>
    <style>
        :root {
            --primary-color: rgba(112, 244, 109, 1);
            --primary-dark: rgba(92, 204, 89, 1);
            --text-color: #333333;
            --light-bg: #f8f9fa;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--light-bg);
            margin: 0;
            padding: 20px;
            color: var(--text-color);
            line-height: 1.6;
        }

        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .email-header {
            background-color: green;
            padding: 30px;
            text-align: center;
            color: white;
        }

        .email-header h2 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }

        .email-body {
            padding: 40px 30px;
            text-align: center;
        }

        .email-body p {
            font-size: 18px;
            margin-bottom: 20px;
        }

        .verification-code-container {
            margin: 30px 0;
            padding: 20px;
            background-color: var(--light-bg);
            border-radius: 8px;
            border-left: 4px solid var(--primary-color);
        }

        .verification-code {
            font-size: 32px;
            font-weight: 700;
            color: var(--text-color);
            letter-spacing: 4px;
        }

        .message {
            font-size: 16px;
            margin-top: 30px;
            color: #666;
        }

        .footer {
            padding: 20px 30px;
            text-align: center;
            font-size: 14px;
            color: #777;
            border-top: 1px solid #eee;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px auto;
                border-radius: 8px;
            }

            .email-header {
                padding: 20px;
            }

            .email-header h2 {
                font-size: 24px;
            }

            .email-body {
                padding: 25px 20px;
            }

            .verification-code {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
<div class="email-container">
    <div class="email-header">
        <h2>Vérification de votre adresse email</h2>
    </div>
    <div class="email-body">
        <p>Bonjour,</p>
        <p>Merci de votre inscription. Pour continuer, veuillez utiliser le code de vérification ci-dessous :</p>

        <div class="verification-code-container">
            <div class="verification-code">
                {{ $code }}
            </div>
        </div>

    </div>
    <div class="footer">
        <p>© 2025 SwiftCar . Tous droits réservés.</p>
    </div>
</div>
</body>
</html>
