import { and, collection, getDocs, or, query, where } from "firebase/firestore";
import Gemstone from "../types/gemstone";
import Result from "../types/result";
import Expert from "./expert";
import { db } from '@/lib/firebase'

export default class DataExpert implements Expert{
    private gemDataRef = collection(db,"gemdata")
    async identify(gemstoneDescription:Gemstone):Promise<Result>{
        console.log('Provided gemstone to expert:')
        console.log(gemstoneDescription)
        console.log('Color:\n',gemstoneDescription.getColorString(),'\n\n')
        console.log('Shininess:\n',gemstoneDescription.getShininess().length)
        if(gemstoneDescription.getColorString().length && gemstoneDescription.getShininess().length){
            console.log('Condition okay')
            // const q1 = query(this.gemDataRef, and(
            //         where("color", "array-contains", gemstoneDescription.getColorString()),
            //         where('luster', 'array-contains', gemstoneDescription.getShininess()),
            //         where('lustertype', 'array-contains', gemstoneDescription.getShininess())
            //     )
            // );

            const q2 = query(this.gemDataRef, or(
                    where("color", "array-contains", gemstoneDescription.getColorString()),
                    where('luster', 'array-contains', gemstoneDescription.getShininess()),
                    where('lustertype', 'array-contains', gemstoneDescription.getShininess())
                )
            );
            console.log('after defining queries')

            let gem;
            // console.log('after let gem')
            // const query1 = await getDocs(q1);
            // console.log('after q1')
            // if(!query1.empty){
            //     gem = query1.docs[0].data();
            //     console.log('RESPONSE 1')
            //     console.log(gem)
            // }
            // else{
                const query2 = await getDocs(q2);
                if(!query2.empty){
                    gem = query2.docs[0].data();
                }
            // }

            
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
        console.log('NO RESP')
        return emptyResult;
    };
}