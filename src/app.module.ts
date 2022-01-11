import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrainerModule } from './trainer/trainer.module';
import { HeroModule } from './hero/hero.module';
import configuration from '../config/configuration';

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
export class AppModule { }
