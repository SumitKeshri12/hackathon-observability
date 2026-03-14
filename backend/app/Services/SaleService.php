<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Exception;

class SaleService
{
    /**
     * Get all sales with products.
     */
    public function getAllSales(): Collection
    {
        return Sale::with('product')->get();
    }

    /**
     * Record a new sale and update product stock.
     */
    public function recordSale(array $data): Sale
    {
        $tracer = \OpenTelemetry\API\Globals::tracerProvider()->getTracer('sale-service');
        $parentSpan = $tracer->spanBuilder('record-sale')->startSpan();
        $parentScope = $parentSpan->activate();

        try {
            return DB::transaction(function () use ($data, $tracer) {
                // Stock Check Span
                $checkSpan = $tracer->spanBuilder('stock-check')->startSpan();
                $product = Product::findOrFail($data['product_id']);

                if ($product->stock < $data['quantity']) {
                    $checkSpan->recordException(new Exception('Insufficient stock'));
                    $checkSpan->end();
                    throw new Exception('Insufficient stock', 422);
                }
                
                // Business Metric: Increment successful sale counter
                $meterProvider = \OpenTelemetry\API\Globals::meterProvider();
                $meter = $meterProvider->getMeter('sale-service');
                $saleCounter = $meter->createCounter('total_sales', 'count', 'Total number of sales recorded');
                $saleCounter->add(1, ['product.id' => $product->id]);

                $checkSpan->setAttribute('product.id', $product->id);
                $checkSpan->setAttribute('stock.available', $product->stock);
                $checkSpan->end();

                // DB Operation Span
                $dbSpan = $tracer->spanBuilder('persist-sale')->startSpan();
                
                // Calculate total price if not provided
                $totalPrice = $data['total_price'] ?? ($product->price * $data['quantity']);

                $sale = Sale::create([
                    'product_id' => $data['product_id'],
                    'quantity' => $data['quantity'],
                    'total_price' => $totalPrice,
                ]);

                // Deduct stock
                $product->decrement('stock', $data['quantity']);
                
                $dbSpan->setAttribute('sale.id', $sale->id);
                $dbSpan->end();

                return $sale;
            });
        } catch (Exception $e) {
            $parentSpan->recordException($e);
            throw $e;
        } finally {
            $parentSpan->end();
            $parentScope->detach();
        }
    }

    /**
     * Get sale by ID.
     */
    public function getSaleById(int $id): Sale
    {
        return Sale::with('product')->findOrFail($id);
    }
}
