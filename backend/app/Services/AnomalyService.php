<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use OpenTelemetry\API\Globals;

class AnomalyService
{
    /**
     * Simulate a slow database query or heavy processing.
     */
    public static function simulateSlowRequest(int $seconds = 5)
    {
        $tracer = Globals::tracerProvider()->getTracer('anomaly-injector');
        $span = $tracer->spanBuilder('simulated-bottleneck')->startSpan();
        
        Log::warning("ANOMALY: Starting simulated slow request for {$seconds}s");
        
        sleep($seconds);
        
        Log::info("ANOMALY: Slow request completed");
        $span->end();
    }

    /**
     * Simulate high CPU usage.
     */
    public static function simulateHighCPU(int $iterations = 10000000)
    {
        $tracer = Globals::tracerProvider()->getTracer('anomaly-injector');
        $span = $tracer->spanBuilder('cpu-burn')->startSpan();
        
        Log::warning("ANOMALY: Starting CPU intensive operation");
        
        $result = 0;
        for ($i = 0; $i < $iterations; $i++) {
            $result += sqrt($i) * sin($i);
        }
        
        Log::info("ANOMALY: CPU operation completed", ['result' => $result]);
        $span->end();
    }
}
