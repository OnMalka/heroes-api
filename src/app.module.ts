import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrainerModule } from './trainers/trainers.module';
import configuration from '../config/configuration';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { HeroModule } from './heroes/heroes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      load: [configuration],
      isGlobal: true
    }),
    MongooseModule.forRoot(
      configuration().dbURI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoCreate: true
      }
    ),
    TrainerModule,
    HeroModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
