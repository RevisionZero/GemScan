import { collection, getDocs, or, query, where } from "firebase/firestore";
import Gemstone from "../types/gemstone";
import Result from "../types/result";
import Expert from "./expert";
import {db} from '@/lib/firebase'

export default class DataExpert implements Expert{
    private gemDataRef = collection(db,"gemdata")
    async identify(gemstoneDescription:Gemstone):Promise<Result>{
        console.log('Color:\n',gemstoneDescription.getColorString().length,'\n\n')
        console.log('Shininess:\n',gemstoneDescription.getShininess().length)
        if(gemstoneDescription.getColorString().length && gemstoneDescription.getShininess().length){
            console.log('Condition okay')
            const q1 = query(this.gemDataRef, where("color", "array-contains", gemstoneDescription.getColorString()),
                where('luster', 'array-contains', gemstoneDescription.getShininess()),
                where('lustertype', 'array-contains', gemstoneDescription.getShininess())
            );

            const q2 = query(this.gemDataRef, or(
                    where("color", "array-contains", gemstoneDescription.getColorString()),
                    where('luster', 'array-contains', gemstoneDescription.getShininess()),
                    where('lustertype', 'array-contains', gemstoneDescription.getShininess())
                )
            );

            let gem;
            const query1 = await getDocs(q1);
            if(!query1.empty){
                gem = query1.docs[0].data();
            }
            else{
                const query2 = await getDocs(q2);
                if(!query2.empty){
                    gem = query2.docs[0].data();
                }
            }

            
            if(gem){
                let result = new Result();
                result.confidence = 0.9;
                result.result = true;
                result.name = gem["name"];
                result.gemstone = new Gemstone('',[],0,'',gem["luster"][0],gem["color"][0]);
                return result;
            }

        }
        let emptyResult = new Result();
        emptyResult.confidence = 0;
        emptyResult.gemstone = new Gemstone();
        emptyResult.result = false;
        return emptyResult;
    };
}