<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Trace\StatusCode;
use Symfony\Component\HttpFoundation\Response;

class OpenTelemetryMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $tracer = Globals::tracerProvider()->getTracer('laravel-tracing');
        
        $startTime = microtime(true);
        $span = $tracer->spanBuilder($request->method() . ' ' . $request->path())
            ->startSpan();

        $span->setAttribute('http.method', $request->method());
        $span->setAttribute('http.url', $request->fullUrl());
        $span->setAttribute('http.target', $request->path());

        try {
            $response = $next($request);
            
            $statusCode = $response->getStatusCode();
            $span->setAttribute('http.status_code', $statusCode);
            
            if (!$response->isSuccessful()) {
                $span->setStatus(StatusCode::STATUS_ERROR, 'HTTP ' . $statusCode);
            }

            return $response;
        } catch (\Throwable $e) {
            $span->setStatus(StatusCode::STATUS_ERROR, $e->getMessage());
            $span->recordException($e);
            throw $e;
        } finally {
            $duration = microtime(true) - $startTime;
            $statusCode = isset($response) ? $response->getStatusCode() : 500;
            
            // Record Metrics
            $meter = Globals::meterProvider()->getMeter('laravel-metrics');
            
            $requestCounter = $meter->createCounter('http_requests_total', 'count', 'Total HTTP requests');
            $requestCounter->add(1, [
                'method' => $request->method(),
                'status' => $statusCode,
                'path' => $request->path(),
            ]);

            $durationHistogram = $meter->createHistogram('http_request_duration_seconds', 's', 'HTTP request duration');
            $durationHistogram->record($duration, [
                'method' => $request->method(),
                'path' => $request->path(),
            ]);

            $span->end();
        }
    }
}
