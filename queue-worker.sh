#!/bin/bash

# Festival Tahuri Queue Worker
# Script untuk menjalankan background email processing

echo "🚀 Starting Festival Tahuri Queue Worker..."
echo "📧 Processing email notifications in background..."
echo ""

# Run queue worker dengan auto-restart jika ada failure
php artisan queue:work database --tries=3 --delay=3 --timeout=60 --verbose

echo ""
echo "⚠️  Queue worker stopped. Restart manually if needed:"
echo "   ./queue-worker.sh"