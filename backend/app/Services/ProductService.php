<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    /**
     * Get all products.
     */
    public function getAllProducts(): Collection
    {
        $tracer = \OpenTelemetry\API\Globals::tracerProvider()->getTracer('product-service');
        $span = $tracer->spanBuilder('get-all-products')->startSpan();
        
        if (\Illuminate\Support\Facades\Cache::get('otel_anomaly_active', false)) {
            // Intentionally slow down the service for the showcase
            usleep(2500000); // 2.5 seconds
            $span->setAttribute('anomaly.injected', true);
        }

        try {
            return Product::all();
        } finally {
            $span->end();
        }
    }

    /**
     * Create a new product.
     */
    public function createProduct(array $data): Product
    {
        $tracer = \OpenTelemetry\API\Globals::tracerProvider()->getTracer('product-service');
        $span = $tracer->spanBuilder('create-product')->startSpan();
        try {
            $product = Product::create($data);
            $span->setAttribute('product.id', $product->id);
            return $product;
        } finally {
            $span->end();
        }
    }

    /**
     * Get product by ID.
     */
    public function getProductById(int $id): Product
    {
        $tracer = \OpenTelemetry\API\Globals::tracerProvider()->getTracer('product-service');
        $span = $tracer->spanBuilder('get-product-by-id')->startSpan();
        try {
            $span->setAttribute('product.id', $id);
            return Product::findOrFail($id);
        } finally {
            $span->end();
        }
    }

    /**
     * Update product.
     */
    public function updateProduct(int $id, array $data): Product
    {
        $tracer = \OpenTelemetry\API\Globals::tracerProvider()->getTracer('product-service');
        $span = $tracer->spanBuilder('update-product')->startSpan();
        try {
            $product = $this->getProductById($id);
            $product->update($data);
            $span->setAttribute('product.id', $id);
            return $product;
        } finally {
            $span->end();
        }
    }

    /**
     * Delete product.
     */
    public function deleteProduct(int $id): bool
    {
        $tracer = \OpenTelemetry\API\Globals::tracerProvider()->getTracer('product-service');
        $span = $tracer->spanBuilder('delete-product')->startSpan();
        try {
            $product = $this->getProductById($id);
            $span->setAttribute('product.id', $id);
            return $product->delete();
        } finally {
            $span->end();
        }
    }
}
