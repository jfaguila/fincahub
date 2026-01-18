import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): any {
    return {
      message: 'Fincahub API v1.0',
      status: 'running',
      endpoints: [
        '/auth/*',
        '/accounting/*',
        '/community/*',
        '/incidents/*',
        '/documents/*',
        '/bookings/*',
        '/voting/*',
      ],
    };
  }

  @Get('health')
  healthCheck(): any {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
