import PDFDocument from 'pdfkit';
import { v4 as uuidv4 } from 'uuid';
import Order from '../entities/order.entity';
import OrderRepository from '../repositories/order.repository';
import S3Service from './s3.service';

export interface InvoiceData {
  orderId: number;
  userId: number;
  orderDetails: Order;
}

class PDFInvoiceService {
  private s3Service: S3Service;
  private orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepository) {
    this.s3Service = new S3Service();
    this.orderRepository = orderRepository;
  }

  async generateInvoice(invoiceData: InvoiceData): Promise<string> {
    try {
      console.log(`Generating PDF invoice for order ${invoiceData.orderId}`);
      
      // Get full order details with relations
      const order = await this.orderRepository.findByOrderId(invoiceData.orderId);
      if (!order) {
        throw new Error(`Order ${invoiceData.orderId} not found`);
      }

      // Generate PDF content
      const pdfBuffer = await this.createPDFInvoice(order);
      
      // Upload to S3
      const s3Url = await this.s3Service.uploadPDFInvoice(order.id, pdfBuffer);
      
      console.log(`PDF Invoice generated and uploaded for order ${order.id}: ${s3Url}`);
      
      return s3Url;
    } catch (error) {
      console.error(`Error generating PDF invoice for order ${invoiceData.orderId}:`, error);
      throw error;
    }
  }

  private async createPDFInvoice(order: Order): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        const invoiceId = uuidv4();
        const currentDate = new Date().toLocaleDateString();

        // Header
        doc.fontSize(20).text('INVOICE', { align: 'center' });
        doc.moveDown();

        // Invoice details
        doc.fontSize(12);
        doc.text(`Invoice ID: ${invoiceId}`, { align: 'left' });
        doc.text(`Date: ${currentDate}`);
        doc.text(`Order ID: ${order.id}`);
        doc.text(`Customer ID: ${order.userId}`);
        doc.text(`Status: ${order.status}`);
        doc.moveDown();

        // Order items table header
        doc.fontSize(14).text('Order Details', { underline: true });
        doc.moveDown();
        
        const startX = 50;
        let currentY = doc.y;
        
        // Table headers
        doc.fontSize(10);
        doc.text('Item', startX, currentY);
        doc.text('Product ID', startX + 50, currentY);
        doc.text('Quantity', startX + 150, currentY);
        doc.text('Unit Price', startX + 220, currentY);
        doc.text('Subtotal', startX + 300, currentY);
        
        // Draw header line
        currentY += 20;
        doc.moveTo(startX, currentY).lineTo(startX + 350, currentY).stroke();
        currentY += 10;

        // Order items
        if (order.items && order.items.length > 0) {
          order.items.forEach((item, index) => {
            doc.text(`${index + 1}`, startX, currentY);
            doc.text(`${item.productId}`, startX + 50, currentY);
            doc.text(`${item.quantity}`, startX + 150, currentY);
            doc.text(`$${item.price.toFixed(2)}`, startX + 220, currentY);
            doc.text(`$${(item.quantity * item.price).toFixed(2)}`, startX + 300, currentY);
            currentY += 20;
          });
        }

        // Total line
        currentY += 10;
        doc.moveTo(startX, currentY).lineTo(startX + 350, currentY).stroke();
        currentY += 20;

        // Total
        doc.fontSize(12);
        doc.text(`Total Amount: $${order.totalPrice.toFixed(2)}`, startX + 200, currentY, {
          align: 'right'
        });

        currentY += 40;

        // Shipping address
        doc.fontSize(12);
        doc.text('Shipping Address:', startX, currentY);
        doc.text(`Address ID: ${order.orderAddressId}`, startX, currentY + 20);

        currentY += 60;

        // Footer
        doc.fontSize(10);
        doc.text('Thank you for your business!', startX, currentY, { align: 'center' });
        doc.text(`Generated on: ${new Date().toISOString()}`, startX, currentY + 20, { align: 'center' });

        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }
}

export default PDFInvoiceService;
