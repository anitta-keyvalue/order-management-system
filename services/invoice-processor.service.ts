import QueueService, { QueueMessage } from './queue.service';
import PDFInvoiceService, { InvoiceData } from './pdf-invoice.service';
import OrderRepository from '../repositories/order.repository';
import { dataSource } from '../db/data-source';
import Order from '../entities/order.entity';

class InvoiceProcessorService {
  private queueService: QueueService;
  private pdfInvoiceService: PDFInvoiceService;
  private orderRepository: OrderRepository;

  constructor() {
    this.queueService = new QueueService();
    this.orderRepository = new OrderRepository(dataSource.getRepository(Order));
    this.pdfInvoiceService = new PDFInvoiceService(this.orderRepository);
  }

  async startProcessing(): Promise<void> {
    console.log('Starting invoice processor service...');
    
    await this.queueService.consumeMessages('order-events', async (message: QueueMessage) => {
      await this.processMessage(message);
    });
  }

  private async processMessage(message: QueueMessage): Promise<void> {
    try {
      console.log(`Processing message: ${message.type} with ID: ${message.id}`);

      switch (message.type) {
        case 'ORDER_CREATED':
          await this.handleOrderCreated(message.data);
          break;
        default:
          console.log(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error(`Error processing message ${message.id}:`, error);
      throw error;
    }
  }

  private async handleOrderCreated(data: any): Promise<void> {
    try {
      const invoiceData: InvoiceData = {
        orderId: data.orderId,
        userId: data.userId,
        orderDetails: data.orderDetails
      };

      console.log(`Generating PDF invoice for order ${invoiceData.orderId}`);
      
      const pdfInvoiceUrl = await this.pdfInvoiceService.generateInvoice(invoiceData);
      console.log(`PDF invoice generated successfully: ${pdfInvoiceUrl}`);
    } catch (error) {
      console.error(`Failed to generate PDF invoice for order ${data.orderId}:`, error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    console.log('Stopping invoice processor service...');
    await this.queueService.disconnect();
  }
}

export default InvoiceProcessorService;
