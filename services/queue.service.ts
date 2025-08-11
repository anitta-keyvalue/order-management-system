import { createClient } from 'redis';

export interface QueueMessage {
  id: string;
  type: string;
  data: any;
  timestamp: number;
}

class QueueService {
  private client: any;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.client.on('error', (err: any) => {
      console.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
      this.isConnected = true;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  async publishMessage(queueName: string, message: QueueMessage): Promise<void> {
    try {
      await this.connect();
      await this.client.lPush(queueName, JSON.stringify(message));
      console.log(`Message published to queue ${queueName}:`, message);
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error;
    }
  }

  async consumeMessages(queueName: string, processor: (message: QueueMessage) => Promise<void>): Promise<void> {
    try {
      await this.connect();
      console.log(`Starting consumer for queue: ${queueName}`);
      
      // Poll for messages continuously
      while (true) {
        try {
          const result = await this.client.brPop(queueName, 1); // Block for 1 second
          
          if (result) {
            const messageData = JSON.parse(result.element);
            console.log(`Processing message from ${queueName}:`, messageData);
            await processor(messageData);
          }
        } catch (processingError) {
          console.error('Error processing message:', processingError);
          // Continue processing other messages even if one fails
        }
      }
    } catch (error) {
      console.error('Error in queue consumer:', error);
      throw error;
    }
  }

  async getQueueLength(queueName: string): Promise<number> {
    try {
      await this.connect();
      return await this.client.lLen(queueName);
    } catch (error) {
      console.error('Error getting queue length:', error);
      return 0;
    }
  }
}

export default QueueService;
