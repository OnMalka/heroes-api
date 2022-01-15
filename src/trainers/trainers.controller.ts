import { Controller, Get, Post, Body, UseGuards, Req, HttpCode } from '@nestjs/common';
import { TrainerService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { AuthGuard } from 'src/trainers/authGuard';
import { AuthRequestInterface } from 'src/interfaces/authRequest.interface';
import { AuthenticationResponseDto } from './dto/authentication-response.dto';
import { LoginTrainerDto } from './dto/login-trainer.dto';
import { RegainTokenDto } from './dto/regain-token.dto';

@Controller('trainer')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) { }

  @Post('signup')
  async create(@Body() createTrainerDto: CreateTrainerDto): Promise<AuthenticationResponseDto> {
    return await this.trainerService.create(createTrainerDto);
  }

  @Post('login')
  async login(@Body() loginTrainerDto: LoginTrainerDto): Promise<AuthenticationResponseDto> {
    return await this.trainerService.login(loginTrainerDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async logout(@Req() req: AuthRequestInterface): Promise<void> {
    return await this.trainerService.logout(req);
  }

  @Get('token')
  @UseGuards(AuthGuard)
  async regainToken(@Req() req: AuthRequestInterface): Promise<RegainTokenDto> {
    return await this.trainerService.regainToken(req);
  }
}
