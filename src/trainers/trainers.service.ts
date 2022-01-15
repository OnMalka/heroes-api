import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HeroService } from '../heroes/heroes.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { Trainer, TrainerDocument } from './schemas/trainer.schema';
import configuration from 'config/configuration';
import { AuthenticationResponseDto } from './dto/authentication-response.dto';
import * as bcrypt from 'bcrypt';
import { LoginTrainerDto } from './dto/login-trainer.dto';
import { RegainTokenDto } from './dto/regain-token.dto';
import { AuthRequestInterface } from 'src/interfaces/authRequest.interface';

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
    const token = await createdTrainer.generateAuthToken();

    const createdHeroes = [];
    for (let i = 0; i < configuration().heroesPerTrainer; i++) {
      createdHeroes.push(await this.heroService.create(createdTrainer._id))
    }
    createdTrainer.heroes.push(...createdHeroes);
    await createdTrainer.save();
    return { trainer: createdTrainer, token };
  }

  async login(loginTrainerDto: LoginTrainerDto): Promise<AuthenticationResponseDto> {
    const { email, password } = loginTrainerDto;
    const trainer = await this.TrainerModel.findOne({ email });

    if (!trainer)
      throw new BadRequestException('Unable to log in');

    const isPassMatch = await bcrypt.compare(password, trainer.password);

    if (!isPassMatch)
      throw new BadRequestException('Unable to log in');

    const token = await trainer.generateAuthToken();

    return ({ trainer, token })
  }

  async logout(authRequestInterface: AuthRequestInterface): Promise<void> {
    const { trainer, token } = authRequestInterface;

    trainer.removeToken(token);
    await trainer.save();
    return;
  }

  async regainToken(authRequestInterface: AuthRequestInterface): Promise<RegainTokenDto> {
    const { trainer, token } = authRequestInterface;

    trainer.removeToken(token);
    const newToken = await trainer.generateAuthToken();
    return { token: newToken };
  }
}
