<?php

return [
    'paths'                => ['api/*'],
    'allowed_methods'      => ['*'],
    'allowed_origins' => [
    'http://localhost:5173',  // frontend siswa
    'http://localhost:5174',  // frontend guru ← tambahkan ini
],
    'allowed_headers'      => ['*'],
    'exposed_headers'      => [],
    'max_age'              => 0,
    'supports_credentials' => false,
];
