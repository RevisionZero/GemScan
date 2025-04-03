import Gemstone from "../types/gemstone";
import Result from "../types/result";

export default interface Expert{
    identify(gemstoneDescription:Gemstone):Promise<Result>;
}