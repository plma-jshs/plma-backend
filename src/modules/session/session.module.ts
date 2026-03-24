import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { CheckSessionMiddleware } from './middleware/check-session.middleware';

@Module({
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckSessionMiddleware).forRoutes({ path: 'api/check-session', method: RequestMethod.GET });
  }
}