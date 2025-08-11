# Order Management System

A comprehensive order management system built with Node.js, TypeScript, and PostgreSQL. Features include user authentication, product catalog, shopping cart functionality, order processing, and automated invoice generation with queue-based processing.

## 🚀 Features

- **User Management**: Registration, authentication with JWT
- **Product Catalog**: Browse and filter products
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Processing**: Create orders with inventory management
- **Address Management**: Multiple shipping addresses per user
- **Automated Invoicing**: Queue-based PDF invoice generation
- **File Storage**: S3-compatible storage for invoices
- **Database**: PostgreSQL with TypeORM migrations

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM with migrations
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: class-validator, class-transformer

### Queue & Storage
- **Message Queue**: Redis (simple list-based implementation)
- **PDF Generation**: PDFKit
- **File Storage**: AWS S3 SDK with LocalStack (for local development)
- **Container Orchestration**: Docker Compose

### Development Tools
- **TypeScript**: Type safety and modern JavaScript features
- **Docker**: Containerized Redis and LocalStack services
- **Jest**: Testing framework
- **Migration System**: TypeORM migrations for database schema

## 📁 Project Structure

```
order-management-system/
├── controllers/          # API route handlers
├── services/            # Business logic layer
├── repositories/        # Data access layer
├── entities/           # TypeORM database entities
├── dto/               # Data transfer objects
├── middlewares/       # Express middlewares (auth, logging, error)
├── routes/            # API route definitions
├── db/               # Database configuration and migrations
├── validators/       # Input validation
├── utils/           # Utility functions and constants
├── docker-compose.yml   # Local development services
├── invoice-consumer.ts  # Standalone invoice processing service
└── app.ts              # Main application entry point
```

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Docker and Docker Compose (for Redis and LocalStack)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd order-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file with the following:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=order_management

# JWT Configuration
JWT_SECRET=your-secret-key

# Redis Configuration
REDIS_URL=redis://localhost:6379

# AWS/LocalStack Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_ENDPOINT=http://localhost:4566
S3_BUCKET_NAME=order-invoices
```

4. **Start infrastructure services**
```bash
# Start Redis and LocalStack
docker-compose up -d

# Verify services are running
docker-compose ps
```

5. **Run database migrations**
```bash
npm run migration:run
```

6. **Build the application**
```bash
npm run build
```

### Running the Application

1. **Start the main API server** (in one terminal):
```bash
npm run start-server
```
The API will be available at `http://localhost:3000`

2. **Start the invoice consumer** (in another terminal):
```bash
npm run start-consumer
```

## 📋 Available Scripts

- `npm run start-server` - Start the main API server
- `npm run start-consumer` - Start the invoice processing consumer
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev-consumer` - Start consumer with auto-rebuild
- `npm run migration:generate` - Generate new database migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration

## 🔄 Queue System & Invoice Generation

### Overview

The system implements a Redis-based queue that processes order events and generates PDF invoices, which are then stored in S3 (LocalStack for local development).

### Components

1. **QueueService**: Redis-based message queue implementation
2. **PDFInvoiceService**: Generates professional PDF invoices
3. **S3Service**: Handles uploading invoices to S3 (LocalStack)
4. **InvoiceProcessorService**: Consumes queue messages and orchestrates invoice generation
5. **OrderService**: Publishes order created events to the queue

### How it Works

1. When an order is created via the API, the `OrderService` publishes an `ORDER_CREATED` event to the `order-events` queue
2. The invoice consumer (`InvoiceProcessorService`) processes these events
3. For each order event, it generates a professional PDF invoice and uploads it to S3
4. The invoice URL is logged and can be accessed via the S3 endpoint

### Architecture Flow

```
Order Creation API
       ↓
   OrderService
       ↓ (publishes ORDER_CREATED event)
   Redis Queue (order-events)
       ↓ (consumer processes)
InvoiceProcessorService
       ↓
   PDFInvoiceService
       ↓ (generates PDF)
    S3Service
       ↓ (uploads to)
   LocalStack S3
```

## 🧪 Testing the System

### Create an Order

```bash
POST http://localhost:3000/api/orders
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

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

### Monitor Invoice Generation

1. **Check consumer logs** to see invoice processing
2. **Check S3 bucket** for uploaded invoices:
```bash
# List all invoices (requires AWS CLI)
aws --endpoint-url=http://localhost:4566 s3 ls s3://order-invoices/invoices/
```
3. **Access invoice URLs** directly:
```
http://localhost:4566/order-invoices/invoices/order-X-invoice-timestamp.pdf
```

## 📊 Monitoring

### Queue Status
Monitor queue length:
```bash
redis-cli LLEN order-events
```

### Service Health
Check Docker services:
```bash
docker-compose ps
docker-compose logs redis
docker-compose logs localstack
```

### Database
Connect to PostgreSQL:
```bash
psql -h localhost -U postgres -d order_management
```

## 🔧 Troubleshooting

### Redis Connection Issues
- Ensure Redis is running: `docker-compose ps`
- Check Redis logs: `docker-compose logs redis`
- Restart Redis: `docker-compose restart redis`

### LocalStack Issues
- Ensure LocalStack is running and healthy: `docker-compose ps`
- Check LocalStack logs: `docker-compose logs localstack`
- Restart LocalStack: `docker-compose restart localstack`

### Queue Processing Issues
- Check consumer logs for errors
- Verify queue has messages: `redis-cli LLEN order-events`
- Restart consumer: `npm run start-consumer`

### Database Issues
- Run migrations: `npm run migration:run`
- Check database connection in logs
- Verify PostgreSQL is running and accessible

## 🚀 Development

### Adding New Features

1. **New API Endpoints**: Add controllers, routes, and services
2. **Database Changes**: Generate and run migrations
3. **Queue Events**: Update `QueueMessage` interface and add handlers
4. **Tests**: Add unit and integration tests

### Development Mode

```bash
# Start consumer with auto-rebuild
npm run dev-consumer

# Generate new migration
npm run migration:generate -- -n NewFeatureName

# Run tests
npm test
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart contents
- `DELETE /api/cart/remove` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

### Addresses
- `POST /api/addresses` - Create address
- `GET /api/addresses` - Get user addresses

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**Built with ❤️ using TypeScript, Node.js, and modern development practices.**