import { Controller, Post, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { HeroService } from './hero.service';
import { HeroResponseDto } from './dto/hero-response.dto';
import { Schema } from 'mongoose';
import { RequestInterface } from 'src/interfaces/requestInterface';
import { AuthGuard } from 'src/auth/authGuard';

@Controller('hero')
@UseGuards(AuthGuard)
export class HeroController {
  constructor(private readonly heroService: HeroService) { }

  @Post()
  create(@Req() request: RequestInterface): Promise<HeroResponseDto> {
    console.log('request.trainer: ', request.trainer);

    return this.heroService.create(request.trainer._id);
  }

  @Patch(':id')
  train(@Param('id') id: Schema.Types.ObjectId, @Req() req: RequestInterface): Promise<number> {
    return this.heroService.train(id, req.trainer._id);
  }

  // router.patch('/:id/trainings', trainHero);



  // @Get()
  // findOne() {
  //   return this.heroService.findOne();
  // }

  // @Get(':trainedBy')
  // findOne(@Param('trainedBy') trainedBy: string) {
  //   return this.heroService.findHeroes(trainedBy);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
  //   return this.heroService.update(+id, updateHeroDto);
  // }
}
