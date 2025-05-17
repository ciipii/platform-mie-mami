<?php

return [
    'date_time_formats' => [
        'date' => 'Y-m-d',
        'date_time' => 'Y-m-d H:i:s',
        'date_time_with_seconds' => 'Y-m-d H:i:s',
        'time' => 'H:i',
        'time_with_seconds' => 'H:i:s',
    ],
    
    'default_filesystem_disk' => env('FILAMENT_FILESYSTEM_DISK', 'public'),
    
    'formatting' => [
        'use_intl' => false,
    ],
];
