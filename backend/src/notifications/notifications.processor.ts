import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    super();
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const user = this.configService.get<string>('SMTP_USER');
    
    if (host && user) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT', 587),
            secure: this.configService.get<boolean>('SMTP_SECURE', false),
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
    } else {
        // Fallback to Ethereal for development
        this.logger.log('SMTP credentials not found, creating Ethereal test account...');
        try {
            const testAccount = await nodemailer.createTestAccount();
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            this.logger.log(`Ethereal Test Account Creds: ${testAccount.user} / ${testAccount.pass}`);
        } catch (err) {
            this.logger.error('Failed to create Ethereal account', err);
        }
    }
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'send-email':
        await this.handleSendEmail(job.data);
        break;
      case 'send-sms':
        await this.handleSendSms(job.data);
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleSendEmail(data: any) {
    this.logger.log(`Processing email for: ${data.to}`);
    if (!this.transporter) {
        this.logger.warn('Transporter not ready, skipping email.');
        return;
    }

    try {
        const info = await this.transporter.sendMail({
            from: '"BeautyBook" <no-reply@beautybook.com>',
            to: data.to,
            subject: data.subject,
            // Simple HTML template for now
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>${data.subject}</h2>
                    <p>Hello,</p>
                    <p>${this.getTemplateContent(data.template, data.context)}</p>
                    <br/>
                    <p>Regards,<br/>BeautyBook Team</p>
                </div>
            `,
        });
        
        this.logger.log(`Email sent: ${info.messageId}`);
        if (nodemailer.getTestMessageUrl(info)) {
            this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
    } catch (error) {
        this.logger.error('Error sending email', error);
        throw error; // Retry job
    }
  }

  private async handleSendSms(data: any) {
    // Integrate Twilio here in production
    // For now, simulate
    this.logger.log(`[SMS SIMULATION] To: ${data.to}, Message: ${data.message}`);
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  private getTemplateContent(template: string, context: any): string {
      switch(template) {
          case 'booking-confirmation':
              return `Your booking (Code: <b>${context.bookingCode}</b>) at ${context.shopName} is confirmed for ${context.date} at ${context.time}.`;
          case 'booking-cancellation':
              return `Your booking at ${context.shopName} for ${context.date} has been cancelled.`;
          case 'booking-reminder':
              return `Reminder: You have an appointment at ${context.shopName} tomorrow at ${context.time}.`;
          default:
              return 'Notification from BeautyBook';
      }
  }
}
