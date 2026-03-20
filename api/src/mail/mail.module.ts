import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.MAIL_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.MAIL_PORT || '587'),
                    secure: process.env.MAIL_SECURE === 'true',
                    ignoreTLS: !process.env.MAIL_USER, // skip TLS if not configured
                    auth: process.env.MAIL_USER
                        ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS || '' }
                        : undefined,
                    connectionTimeout: 10000,  // 10s
                    greetingTimeout: 10000,    // 10s
                    socketTimeout: 15000,      // 15s
                },
                defaults: {
                    from: process.env.MAIL_FROM || '"FincaHub" <info@fincahub.com>',
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
