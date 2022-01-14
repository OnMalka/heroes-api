import { Schema } from "mongoose";

export class TrainHeroDto {
    readonly _id: Schema.Types.ObjectId;
    readonly trainer: Schema.Types.ObjectId;
}
