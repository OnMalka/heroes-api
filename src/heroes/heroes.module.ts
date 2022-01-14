import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroService } from './heroes.service';
import { HeroController } from './heroes.controller';
import { Hero, HeroSchema } from './schemas/hero.schema';
import { Trainer, TrainerSchema } from 'src/trainers/schemas/trainer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hero.name, schema: HeroSchema }, { name: Trainer.name, schema: TrainerSchema }])
  ],
  controllers: [HeroController],
  providers: [HeroService],
  exports: [HeroService]
})
export class HeroModule { }
