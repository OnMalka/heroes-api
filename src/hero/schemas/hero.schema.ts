import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
// import { Trainer } from '../../trainer/schemas/trainer.schema';
import validator from 'validator';

export type HeroDocument = Hero & Document;

export class SuitColors {
    @Prop({
        required: true,
        trim: true,
        enum: ['shoes', 'pants', 'shirt', 'hat', 'cape', 'underwear']
    })
    item: string;

    @Prop({
        required: true,
        trim: true,
        validate: (inputValue) => {
            if (!validator.isHexColor(inputValue))
                throw new Error(`Invalid color: ${inputValue}`);
        }
        // if (!(/^#(?:[0-9a-fA-F]{3}){1,2}$/).test(inputValue.trim()))
        // did isHexColor with regex and did not want to delete it
    })
    color: number;
}

export class TrainingSession {
    @Prop({
        required: true
    })
    date: Date;

    @Prop({
        required: true,
        min: 0,
        max: 10
    })
    powerGained: number;
}

@Schema({
    timestamps: true
})
export class Hero {
    @Prop({
        required: true,
        unique: true,
        trim: true
    })
    name: string;

    @Prop({
        required: true,
        trim: true,
        enum: ['attacker', 'defender']
    })
    ability: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    })
    trainer: string;

    @Prop()
    firstTrained: Date;

    @Prop()
    suitColors: SuitColors[];

    @Prop({
        required: true,
        min: 1,
        default: 10
    })
    startingPower: number;

    @Prop({
        required: true,
        min: 1,
        default: 10
    })
    currentPower: number;

    @Prop()
    lastTrainings: TrainingSession[];

    @Prop({
        required: true,
        validate: (inputValue: string) => {
            if (!validator.isURL(inputValue))
                throw new Error(`Invalid image URL: ${inputValue}`);
        }
    })
    imageURL: string;

    clearPrivateProps: () => void;

    resetLastTrainings: () => void;

    train: () => number;
}

export const HeroSchema = SchemaFactory.createForClass(Hero);

HeroSchema.methods.clearPrivateProps = function () {
    const hero = this._doc;

    hero.trainer = 'Private';
    hero.startingPower = 'Private';
    hero.currentPower = 'Private';
    hero.lastTrainings = 'Private';

    return;
};

HeroSchema.methods.resetLastTrainings = function () {
    const hero = this._doc;

    if (
        hero.lastTrainings.length > 0 &&
        hero.lastTrainings[0].date.getDate() < new Date(Date.now()).getDate()
    ) {
        hero.lastTrainings = [];
    };

    return;
};

HeroSchema.methods.train = function () {
    const hero = this._doc;
    const currentDate = Date.now();

    if (hero.firstTrained === undefined)
        hero.firstTrained = currentDate;

    const PowerGained = hero.currentPower * (Math.random() * 10) / 100;

    hero.startingPower = hero.currentPower;
    hero.currentPower = (hero.currentPower + PowerGained);
    hero.lastTrainings.push({
        date: currentDate,
        PowerGained
    });
    return PowerGained;
};