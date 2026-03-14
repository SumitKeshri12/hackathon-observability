<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Trace\Propagation\TraceContextPropagator;
use OpenTelemetry\SDK\Common\Attribute\Attributes;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\Contrib\Otlp\SpanExporter;
use OpenTelemetry\SDK\Resource\ResourceInfo;
use OpenTelemetry\SDK\Resource\ResourceInfoFactory;
use OpenTelemetry\SDK\Trace\Sampler\AlwaysOnSampler;
use OpenTelemetry\SDK\Trace\SpanProcessor\SimpleSpanProcessor;
use OpenTelemetry\SDK\Trace\TracerProvider;
use OpenTelemetry\SDK\Sdk;

class OpenTelemetryService
{
    private static bool $initialized = false;

    public static function init(): void
    {
        if (self::$initialized) return;
        self::$initialized = true;

        $endpoint = env('OTEL_EXPORTER_OTLP_ENDPOINT', 'http://otel-collector:4318');
        
        $resource = ResourceInfoFactory::emptyResource()->merge(
            ResourceInfo::create(Attributes::create([
                'service.name' => env('OTEL_SERVICE_NAME', 'backend-api'),
                'deployment.environment' => env('APP_ENV', 'local'),
            ]))
        );

        // Tracer
        $transport = (new OtlpHttpTransportFactory())->create($endpoint . '/v1/traces', 'application/json');
        $exporter = new SpanExporter($transport);
        $tracerProvider = new TracerProvider(new SimpleSpanProcessor($exporter), new AlwaysOnSampler(), $resource);

        // Meter (explicit transport)
        $metricTransport = (new OtlpHttpTransportFactory())->create($endpoint . '/v1/metrics', 'application/json');
        $metricExporter = new \OpenTelemetry\Contrib\Otlp\MetricExporter($metricTransport);
        $reader = new \OpenTelemetry\SDK\Metrics\MetricReader\ExportingReader($metricExporter);
        $meterProvider = \OpenTelemetry\SDK\Metrics\MeterProvider::builder()
            ->setResource($resource)
            ->addReader($reader)
            ->build();

        Sdk::builder()
            ->setTracerProvider($tracerProvider)
            ->setMeterProvider($meterProvider)
            ->setPropagator(TraceContextPropagator::getInstance())
            ->buildAndRegisterGlobal();

        // Register global log context for Trace Correlation
        Log::shareContext([
            'trace_id' => \OpenTelemetry\API\Trace\Span::getCurrent()->getContext()->getTraceId(),
        ]);
    }
}
