<?php

namespace App\Providers;

use Filament\Support\Facades\FilamentView;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Config;

class FilamentServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Force disable intl usage in Filament
        Config::set('filament-support.formatting.use_intl', false);
    }

    public function boot()
    {
        // Use simpler formatting that doesn't require the intl extension
        FilamentView::registerRenderHook(
            'panels::head.end',
            fn (): string => '
                <script>
                    window.filamentUseSimpleFormatting = true;
                </script>
                <script src="/js/filament/format-override.js"></script>
            '
        );

        // Override any methods that might use intl
        Config::set('filament-support.date_time_formats.date', 'Y-m-d');
        Config::set('filament-support.date_time_formats.date_time', 'Y-m-d H:i:s');
        Config::set('filament-support.date_time_formats.time', 'H:i');
    }
}
