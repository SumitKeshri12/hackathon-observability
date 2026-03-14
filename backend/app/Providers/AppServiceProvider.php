<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Laravel\Passport\Passport::$validateKeyPermissions = false;
        \App\Services\OpenTelemetryService::init();

        // Record DB Metrics
        \Illuminate\Support\Facades\DB::listen(function ($query) {
            try {
                $meter = \OpenTelemetry\API\Globals::meterProvider()->getMeter('laravel-db');
                
                // Query Duration
                $durationHistogram = $meter->createHistogram('db_query_duration', '', 'Database query duration');
                $durationHistogram->record($query->time); // ms

                // Query Count
                $queryCounter = $meter->createCounter('db_queries', 'count', 'Total database queries');
                $queryCounter->add(1, [
                    'connection' => $query->connectionName,
                ]);
            } catch (\Throwable $e) {
                // Ignore metrics errors to prevent app crash
            }
        });

        $this->app->terminating(function () {
            // Flush metrics and traces before the process ends (forceFlush is often safer than shutdown in FPM)
            \OpenTelemetry\API\Globals::meterProvider()->forceFlush();
            \OpenTelemetry\API\Globals::tracerProvider()->forceFlush();
        });
    }
}
