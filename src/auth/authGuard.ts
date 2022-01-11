import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import configuration from 'config/configuration';
import { InjectModel } from '@nestjs/mongoose';
import { Trainer, TrainerDocument } from 'src/trainer/schemas/trainer.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(@InjectModel(Trainer.name) private TrainerModel: Model<TrainerDocument>) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const next = context.switchToHttp().getNext();

        try {
            const token = request.header('Authorization').replace('Bearer ', '');
            const data: any = jwt.verify(token, configuration().tokenSecret);

            return this.TrainerModel.findOne({
                _id: data._id,
                'tokens.token': token
            }).then((trainer) => {
                if (!trainer) {
                    throw new UnauthorizedException;
                }

                request.trainer = trainer;
                request.token = token;

                return true;
            })
        } catch (err) {
            if (['invalid token', 'jwt expired'].includes(err.message))//checking for jwt thrown exception
                throw new UnauthorizedException;
            else
                throw err;
        }
    }
}