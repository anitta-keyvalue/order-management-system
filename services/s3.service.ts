import { S3Client, PutObjectCommand, PutObjectCommandInput, CreateBucketCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

class S3Service {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME || 'order-invoices';
    
    // Configure for LocalStack
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:4566', // LocalStack default endpoint
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
      },
      forcePathStyle: true // Required for LocalStack
    });
  }

  async uploadFile(key: string, content: string | Buffer, contentType: string = 'application/pdf'): Promise<string> {
    try {
      // Ensure bucket exists
      await this.ensureBucketExists();

      const params: PutObjectCommandInput = {
        Bucket: this.bucketName,
        Key: key,
        Body: content,
        ContentType: contentType
      };

      const command = new PutObjectCommand(params);
      await this.client.send(command);

      const fileUrl = `${process.env.S3_ENDPOINT || 'http://localhost:4566'}/${this.bucketName}/${key}`;
      console.log(`File uploaded successfully to S3: ${fileUrl}`);
      
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      // Check if bucket exists
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        // Bucket doesn't exist, create it
        try {
          await this.client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
          console.log(`Created S3 bucket: ${this.bucketName}`);
        } catch (createError) {
          console.error(`Error creating bucket ${this.bucketName}:`, createError);
          throw createError;
        }
      } else {
        throw error;
      }
    }
  }

  async uploadPDFInvoice(orderId: number, pdfBuffer: Buffer): Promise<string> {
    const key = `invoices/order-${orderId}-invoice-${Date.now()}.pdf`;
    return this.uploadFile(key, pdfBuffer, 'application/pdf');
  }
}

export default S3Service;
