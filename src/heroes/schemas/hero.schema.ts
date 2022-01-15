import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import validator from 'validator';

export type HeroDocument = Hero & Document;

@Schema({
    timestamps: true
})
export class Hero {
    @Prop({
        type: String,
        required: true,
        unique: true,
        trim: true
    })
    name: string;

    @Prop({
        type: String,
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
    trainer: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: Date
    })
    firstTrained: Date;

    @Prop({
        type: [{
            item: {
                type: String,
                required: true,
                trim: true,
                enum: ['shoes', 'pants', 'shirt', 'hat', 'cape', 'underwear']
            },
            color: {
                type: String,
                required: true,
                trim: true,
                validate: (inputValue: string) => {
                    if (!validator.isHexColor(inputValue))
                        throw new Error(`Invalid color: ${inputValue}`);
                }
            }
        }]
    })
    suitColors: { item: string, color: string }[];

    @Prop({
        type: Number,
        required: true,
        min: 1,
        default: 10
    })
    startingPower: number;

    @Prop({
        type: Number,
        required: true,
        min: 1,
        default: 10
    })
    currentPower: number;

    @Prop({
        type: [{
            date: {
                type: Date,
                required: true
            },
            powerGained: {
                type: Number,
                required: true,
                min: 0,
                max: 10
            }
        }]
    })
    lastTrainings: { date: Date, percentsGained: number }[];

    @Prop({
        type: String,
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
    const hero = this;

    if (
        hero.lastTrainings.length > 0 &&
        hero.lastTrainings[0].date.getDate() < new Date(Date.now()).getDate()
    ) {
        hero.lastTrainings = [];
    };

    return;
};

HeroSchema.methods.train = function () {
    const hero = this;
    const currentDate = Date.now();

    if (hero.firstTrained === undefined)
        hero.firstTrained = currentDate;

    const randomPercentGain = (Math.random() * 10) / 100;

    const powerGained = hero.currentPower * randomPercentGain;

    hero.startingPower = hero.currentPower;
    hero.currentPower = (hero.currentPower + powerGained);
    hero.lastTrainings.push({
        date: currentDate,
        powerGained: powerGained
    });
    return powerGained;
};