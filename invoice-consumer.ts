import 'reflect-metadata';
import { dataSource } from './db/data-source';
import InvoiceProcessorService from './services/invoice-processor.service';

class InvoiceConsumer {
  private processorService: InvoiceProcessorService;

  constructor() {
    this.processorService = new InvoiceProcessorService();
  }

  async start(): Promise<void> {
    try {
      console.log('Initializing invoice consumer...');
      
      // Initialize database connection
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
        console.log('Database connection established');
      }

      // Start processing messages
      console.log('Starting invoice processing...');
      await this.processorService.startProcessing();
      
    } catch (error) {
      console.error('Failed to start invoice consumer:', error);
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    try {
      console.log('Shutting down invoice consumer...');
      await this.processorService.stop();
      
      if (dataSource.isInitialized) {
        await dataSource.destroy();
        console.log('Database connection closed');
      }
      
      console.log('Invoice consumer shut down successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Handle graceful shutdown
const consumer = new InvoiceConsumer();

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await consumer.stop();
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await consumer.stop();
});

// Start the consumer
consumer.start().catch((error) => {
  console.error('Unhandled error in invoice consumer:', error);
  process.exit(1);
});
