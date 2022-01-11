import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HeroService } from 'src/hero/hero.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { Trainer, TrainerDocument } from './schemas/trainer.schema';
import configuration from 'config/configuration';
import { AuthenticationResponseDto } from 'src/hero/dto/authentication-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TrainerService {
  constructor(@InjectModel(Trainer.name) private TrainerModel: Model<TrainerDocument>, private heroService: HeroService) { }

  async create(createTrainerDto: CreateTrainerDto): Promise<AuthenticationResponseDto> {
    const { email } = createTrainerDto;
    const trainer = await this.TrainerModel.findOne({ email });
    if (trainer) {
      throw new HttpException('Trainer already exists', HttpStatus.BAD_REQUEST);
    }
    const createdTrainer = new this.TrainerModel(createTrainerDto);
    const token = createdTrainer.generateAuthToken();
    const createdHeroes = [];
    for (let i = 0; i < configuration().heroesPerTrainer; i++) {
      createdHeroes.push(await this.heroService.create(createdTrainer._id))
    }
    createdTrainer.heroes.push(...createdHeroes);
    await createdTrainer.save();
    return { trainer, token };
  }

  async login(email: string, password: string) {//: Promise<AuthenticationResponseDto> {
    const trainer = await this.TrainerModel.findOne({ email });

    if (!trainer)
      throw new BadRequestException('Unable to log in');

    const isPassMatch = await bcrypt.compare(password, trainer.password);

    if (!isPassMatch)
      throw new BadRequestException('Unable to log in');

    const token = trainer.generateAuthToken();

    return ({ trainer, token })
  }

  findOne(id: number) {
    return `This action returns a #${id} trainer`;
  }

  update(id: number, updateTrainerDto: UpdateTrainerDto) {
    return `This action updates a #${id} trainer`;
  }

  remove(id: number) {
    return `This action removes a #${id} trainer`;
  }
}
