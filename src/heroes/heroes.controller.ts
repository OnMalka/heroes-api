import { Controller, Patch, Param, Req, UseGuards, Get, Query, BadRequestException } from '@nestjs/common';
import { HeroService } from './heroes.service';
import { HeroResponseDto } from './dto/hero-response.dto';
import { Schema } from 'mongoose';
import { AuthGuard } from 'src/trainers/authGuard';
import { AuthRequestInterface } from '../interfaces/authRequest.interface'
import { PublicHeroResponseDto } from './dto/public-hero-response.dto';
import { TrainingResponseDto } from './dto/training-response.dto';

@Controller('heroes')
@UseGuards(AuthGuard)
export class HeroController {
  constructor(private readonly heroService: HeroService) { }

  @Patch(':id')
  async train(@Param('id') id: Schema.Types.ObjectId, @Req() req: AuthRequestInterface): Promise<TrainingResponseDto> {
    return await this.heroService.train({ _id: id, trainer: req.trainer._id });
  }

  @Get()
  async find(@Query('trained-by') trainedBy: string, @Req() req: AuthRequestInterface): Promise<(HeroResponseDto | PublicHeroResponseDto)[]> {
    if (trainedBy === 'me') {
      return await this.heroService.findMy({ trainer: req.trainer });
    } else if (trainedBy === 'all') {
      return await this.heroService.findAll({ trainer: req.trainer });
    } else {
      throw new BadRequestException;
    }
  }
}
