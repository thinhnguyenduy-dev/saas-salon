import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'send-email':
        await this.handleSendEmail(job.data);
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleSendEmail(data: any) {
    // In a real app, integrate SendGrid/Nodemailer here.
    // For now, we simulate sending by logging.
    this.logger.log(`[SIMULATION] Sending Email to: ${data.to}`);
    this.logger.log(`[SIMULATION] Subject: ${data.subject}`);
    this.logger.log(`[SIMULATION] Body Context: ${JSON.stringify(data.context)}`);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.logger.log(`[SIMULATION] Email sent successfully.`);
  }
}
