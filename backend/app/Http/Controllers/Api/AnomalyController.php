<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AnomalyController extends Controller
{
    public function getStatus()
    {
        return response()->json([
            'anomaly_active' => Cache::get('otel_anomaly_active', false)
        ]);
    }

    public function toggle(Request $request)
    {
        $active = $request->input('active', false);
        Cache::put('otel_anomaly_active', $active);
        
        return response()->json([
            'message' => $active ? 'Anomaly INJECTED' : 'Anomaly CLEARED',
            'anomaly_active' => $active
        ]);
    }
}
