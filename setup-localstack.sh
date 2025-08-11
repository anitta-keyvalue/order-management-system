#!/bin/bash

# Setup script for LocalStack S3 bucket creation

echo "Creating S3 bucket in LocalStack..."

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to start..."
sleep 5

# Create the S3 bucket
aws --endpoint-url=http://localhost:4566 s3 mb s3://order-invoices --region us-east-1

echo "S3 bucket 'order-invoices' created successfully!"

# List buckets to verify
aws --endpoint-url=http://localhost:4566 s3 ls
