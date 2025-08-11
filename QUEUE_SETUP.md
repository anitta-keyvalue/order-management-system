# Queue System Setup and Usage

This document explains how to set up and use the queue system for order processing and invoice generation.

## Overview

The system implements a Redis-based queue that processes order events and generates invoices, which are then stored in S3 (LocalStack).

### Components

1. **QueueService**: Redis-based message queue implementation
2. **InvoiceService**: Generates invoice content for orders
3. **S3Service**: Handles uploading invoices to S3 (LocalStack)
4. **InvoiceProcessorService**: Consumes queue messages and orchestrates invoice generation
5. **OrderService**: Publishes order created events to the queue

## Prerequisites

- Redis server
- LocalStack (for S3 simulation)
- AWS CLI (for LocalStack setup)

## Setup Instructions

### 1. Start Redis and LocalStack

```bash
# Start Redis and LocalStack using Docker Compose
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 2. Setup S3 Bucket in LocalStack

```bash
# Run the setup script to create the S3 bucket
./setup-localstack.sh
```

### 3. Environment Variables

Create a `.env` file with the following variables (use `.env.example` as reference):

```bash
# Redis Configuration
REDIS_URL=redis://localhost:6379

# AWS/LocalStack Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_ENDPOINT=http://localhost:4566
S3_BUCKET_NAME=order-invoices
```

### 4. Build the Application

```bash
npm run build
```

## Usage

### Starting the Services

1. **Start the main application** (in one terminal):
```bash
npm run start-server
```

2. **Start the invoice consumer** (in another terminal):
```bash
npm run start-consumer
```

### How it Works

1. When an order is created via the API, the `OrderService` publishes an `ORDER_CREATED` event to the `order-events` queue
2. The invoice consumer (`InvoiceProcessorService`) processes these events
3. For each order event, it generates an invoice and uploads it to S3
4. The invoice URL is logged for reference

### Testing the Queue

1. Create an order via the API:
```bash
POST /api/orders
{
  "addressId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

2. Check the consumer logs to see invoice processing
3. Check LocalStack S3 bucket for uploaded invoices:
```bash
aws --endpoint-url=http://localhost:4566 s3 ls s3://order-invoices/invoices/
```

## Monitoring

### Queue Status
You can monitor the queue length by checking Redis:
```bash
redis-cli LLEN order-events
```

### S3 Contents
List all uploaded invoices:
```bash
aws --endpoint-url=http://localhost:4566 s3 ls s3://order-invoices/invoices/ --recursive
```

### Logs
- Main application logs: Order creation and event publishing
- Consumer logs: Message processing and invoice generation

## Troubleshooting

### Redis Connection Issues
- Ensure Redis is running: `docker-compose ps`
- Check Redis logs: `docker-compose logs redis`

### LocalStack Issues
- Ensure LocalStack is running: `docker-compose ps`
- Check LocalStack logs: `docker-compose logs localstack`
- Recreate S3 bucket: `./setup-localstack.sh`

### Queue Processing Issues
- Check consumer logs for errors
- Verify queue has messages: `redis-cli LLEN order-events`
- Restart consumer: `npm run start-consumer`

## Architecture

```
Order Creation API
       ↓
   OrderService
       ↓ (publishes ORDER_CREATED event)
   Redis Queue (order-events)
       ↓ (consumer processes)
InvoiceProcessorService
       ↓
   InvoiceService
       ↓ (generates invoice)
    S3Service
       ↓ (uploads to)
   LocalStack S3
```

## Development

### Running in Development Mode
```bash
# Start consumer with auto-rebuild
npm run dev-consumer
```

### Adding New Event Types
1. Update the `QueueMessage` interface in `queue.service.ts`
2. Add new message type handling in `InvoiceProcessorService`
3. Publish new events from relevant services
