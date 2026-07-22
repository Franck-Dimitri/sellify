<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Inertia Testing Page Extensions
    |--------------------------------------------------------------------------
    |
    | The page extensions that Inertia should look for when resolving page
    | components in tests.
    |
    */

    'testing' => [
        'ensure_pages_exist' => false,
        'page_paths' => [
            resource_path('js/Pages'),
        ],
        'page_extensions' => [
            'js',
            'jsx',
            'ts',
            'tsx',
        ],
    ],

];
