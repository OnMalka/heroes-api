import { Schema } from "mongoose";

export class CreateHeroDto {
    readonly trainerId: Schema.Types.ObjectId;
}
