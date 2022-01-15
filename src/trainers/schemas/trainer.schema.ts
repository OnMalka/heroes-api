import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Hero } from '../../heroes/schemas/hero.schema';
import configurations from '../../../config/configuration';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import validator from 'validator';

export type TrainerDocument = Trainer & Document;

@Schema({
  timestamps: true
})
export class Trainer {
  @Prop({
    type: String,
    required: true,
    trim: true
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value))
        throw {
          status: 400,
          message: 'invalid email'
        };
    }
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      const options = {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      };

      if (!validator.isStrongPassword(value, options))
        throw {
          status: 400,
          message: 'invalid password'
        };
    }
  })
  password: string;

  @Prop({
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hero'
    }]
  })
  heroes: Hero[]

  @Prop({
    type: [{
      token: {
        type: String,
        required: true
      }
    }]
  })
  tokens: { token: string }[]

  generateAuthToken: () => Promise<string>;

  removeToken: (token: string) => void;
}

export const TrainerSchema = SchemaFactory.createForClass(Trainer);

TrainerSchema.pre('save', async function (this: TrainerDocument) {
  const trainer = this;

  if (trainer.isModified('password'))
    trainer.password = await bcrypt.hash(trainer.password, 8);
});

TrainerSchema.methods.generateAuthToken = async function () {
  const trainer = this;
  const token = jwt.sign(
    {
      _id: trainer._id
    },
    configurations().tokenSecret,
    {
      expiresIn: "6h"
    }
  );

  trainer.tokens = trainer.tokens.concat({ token });
  await trainer.save();

  return token;
};

TrainerSchema.methods.toJSON = function () {
  const trainer = this._doc;

  delete trainer.password;
  delete trainer.tokens;

  return trainer;
};

TrainerSchema.methods.removeToken = function (token: string) {
  const trainer = this._doc;
  trainer.tokens = trainer.tokens.filter((tokenDoc: { token: string }) => tokenDoc.token !== token);
  return;
};