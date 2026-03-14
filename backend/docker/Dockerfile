# --- Stage 1: Build ---
FROM composer:latest as build
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-scripts

# --- Stage 2: Dev/Production ---
FROM php:8.4-fpm-alpine as dev
WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    oniguruma-dev

# Install PHP extensions
RUN apk add --no-cache $PHPIZE_DEPS \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_pgsql zip bcmath opcache \
    && pecl install opentelemetry protobuf redis \
    && docker-php-ext-enable opentelemetry protobuf redis

# Copy application
COPY --from=build /app /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

USER www-data

# Expose port (PHP-FPM)
EXPOSE 9000

CMD ["php-fpm"]
