<?php

return [
    /*
    |--------------------------------------------------------------------------
    | HR-Skills Pay Mode (live or sandbox)
    |--------------------------------------------------------------------------
    |
    | Define whether the payment gateway operates in 'live' or 'sandbox' mode.
    |
    */
    'mode' => env('HRPAY_MODE', 'live'),

    /*
    |--------------------------------------------------------------------------
    | Base API URL
    |--------------------------------------------------------------------------
    |
    | HR-Skills Pay uses the same base URL for both sandbox and production.
    |
    */
    'base_url' => env('HRPAY_BASE_URL', 'https://api.hrskills-pay.com'),

    /*
    |--------------------------------------------------------------------------
    | Live Credentials
    |--------------------------------------------------------------------------
    |
    | Clé A (Public Key, format: hrsk_pk_live_...)
    | Clé B (Secret Key, format: hrsk_sk_live_...)
    |
    */
    'live' => [
        'public_key' => env('HRPAY_LIVE_PUBLIC_KEY', env('HRPAY_PUBLIC_KEY', '')),
        'secret_key' => env('HRPAY_LIVE_SECRET_KEY', env('HRPAY_SECRET_KEY', '')),
    ],

    /*
    |--------------------------------------------------------------------------
    | Sandbox Credentials
    |--------------------------------------------------------------------------
    |
    | Clé A (Public Key, format: hrsk_pk_test_...)
    | Clé B (Secret Key, format: hrsk_sk_test_...)
    |
    */
    'sandbox' => [
        'public_key' => env('HRPAY_SANDBOX_PUBLIC_KEY', ''),
        'secret_key' => env('HRPAY_SANDBOX_SECRET_KEY', ''),
    ],

    /*
    |--------------------------------------------------------------------------
    | Webhook Secret
    |--------------------------------------------------------------------------
    |
    | Used to verify incoming webhook signatures via HMAC-SHA256.
    |
    */
    'webhook_secret' => env('HRPAY_WEBHOOK_SECRET', ''),

    /*
    |--------------------------------------------------------------------------
    | Defaults
    |--------------------------------------------------------------------------
    */
    'default_country' => env('HRPAY_DEFAULT_COUNTRY', 'CM'),
    'default_currency' => env('HRPAY_DEFAULT_CURRENCY', 'XAF'),
    'token_ttl' => 2400, // 40 minutes (JWT expires in 2700s / 45 min)
    'timeout' => 30,     // HTTP request timeout in seconds
];
