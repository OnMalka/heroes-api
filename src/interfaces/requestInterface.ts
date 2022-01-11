import { Request } from "@nestjs/common";
import { TrainerDocument } from "src/trainer/schemas/trainer.schema";

export interface RequestInterface extends Request {
    trainer: TrainerDocument,
    token: string
}