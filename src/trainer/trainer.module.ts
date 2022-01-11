import { Module } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { TrainerController } from './trainer.controller';
import { HeroModule } from 'src/hero/hero.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Trainer, TrainerSchema } from './schemas/trainer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Trainer.name,
      schema: TrainerSchema
    }]),
    HeroModule
  ],
  controllers: [TrainerController],
  providers: [TrainerService]
})
export class TrainerModule { }
