// import { SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import validator from 'validator';

// export type TrainerDocument = Trainer & Document;

// import * as mongoose from 'mongoose';

export const TrainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
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
  },
  password: {
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
  },
  heroes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Hero'
    }
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
}, {
  timestamps: true
})

// TrainerSchema.pre('save', async function (next) {
//   try {
//     if (!this.isModified('password')) {
//       return next();
//     }
//     const hashed = await bcrypt.hash(this['password'], 10);
//     this['password'] = hashed;
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// });

// TrainerSchema.pre('save', async function (next) {
//   const trainer = this;

//   if (trainer.isModified('password'))
//     trainer.password = await bcrypt.hash(trainer.password, 8);

//   next();
// });

// TrainerSchema.statics.findTrainerByEmailAndPassword = async (email, password) => {
//   const trainer = await Trainer.findOne({ email });

//   if (!trainer)
//     throw {
//       status: 400,
//       message: 'Unable to log in'
//     };

//   const isPassMatch = await bcrypt.compare(password, trainer.password);

//   if (!isPassMatch)
//     throw {
//       status: 400,
//       message: 'Unable to log in'
//     };

//   return trainer;
// };

// TrainerSchema.methods.generateAuthToken = async function () {
//   const trainer = this;
//   const token = jwt.sign(
//     {
//       _id: trainer._id
//     },
//     environments.tokenSecret,
//     {
//       expiresIn: "6h"
//     }
//   );

//   trainer.tokens = trainer.tokens.concat({ token });
//   await trainer.save();

//   return token;
// };

// TrainerSchema.methods.toJSON = function () {
//   const trainer = this;
//   const trainerObj = trainer.toObject();

//   delete trainerObj.password;
//   delete trainerObj.tokens;

//   return trainerObj;
// };

// TrainerSchema.methods.removeToken = function (token) {
//   const trainer = this;
//   trainer.tokens = trainer.tokens.filter((tokenDoc) => tokenDoc.token !== token);
//   return;
// };

// TrainerSchema.methods.addHeroes = async function (amountOfHeroesToAdd) {
//   const getRandomSuitItems = (amountOfItemsToAdd) => {
//     const allowedItems = ['shoes', 'pants', 'shirt', 'hat', 'cape', 'underwear'];
//     const suiteItems = [];
//     for (let i = 0; i < amountOfItemsToAdd; i++) {
//       const index = Math.round(Math.random() * allowedItems.length - 1);
//       const item = allowedItems.splice(index, 1)[0];
//       const color = '#' + (Math.round(Math.random() * 4095)).toString(16);
//       suiteItems.push({ item, color });
//     };
//     return suiteItems;
//   };

//   for (let i = 0; i < amountOfHeroesToAdd; i++) {
//     const heroId = await Hero.countDocuments({}) + 1;
//     const heroData = await axios.get(`https://www.superheroapi.com/api.php/${environments.heroApiToken}/${heroId}`);
//     const heroObject = heroData.data;
//     const heroesPower = heroObject.powerstats.power === 'null' ? 10 : heroObject.powerstats.power;

//     const hero = new Hero({
//       name: heroObject.name,
//       imageURL: heroObject.image.url,
//       ability: Math.random() > 0.5 ? 'attacker' : 'defender',
//       suitColors: getRandomSuitItems(2),
//       startingPower: heroesPower,
//       currentPower: heroesPower,
//       trainer: this._id,
//       trainings: []
//     });

//     this.heroes.push(hero._id);

//     await hero.save();
//   };

//   return;
// };

// @Schema()
// export class Trainer {
//   @Prop({
//     required: true,
//     trim: true
//   })
//   name: string;

//   @Prop({
//     required: true,
//     trim: true,
//     uppercase: true,
//     unique: true,
//     validate(inputValue: string) {
//       if (!validator.isEmail(inputValue))
//         throw {
//           status: 400,
//           message: 'invalid email'
//         };
//     }
//   })
//   email: string;

//   @Prop({
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Trainer'
//   })
//   trainer: string;

//   // @Prop({
//   //   required: true,
//   //   trim: true
//   // })
//   // name: string;

//   @Prop()
//   age: number;

//   @Prop()
//   breed: string;
// }

// export const CatSchema = SchemaFactory.createForClass(Trainer);