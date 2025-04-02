import Gemstone from "../types/gemstone";
import Result from "../types/result";

export default class AIExpert implements Expert{
    identify(gemstoneDescription:Gemstone):Result{
        return new Result();
    };
}