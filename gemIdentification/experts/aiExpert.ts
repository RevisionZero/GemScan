import Gemstone from "../types/gemstone";
import Result from "../types/result";
import Expert from "./expert";
import apiKey from '@/lib/openrouterAPIKey.json'

export default class AIExpert implements Expert{
    async identify(gemstoneDescription:Gemstone):Promise<Result>{
        console.log(JSON.stringify(apiKey.key))

        // let a = await fetch('https://openrouter.ai/api/v1/completions', {
        //     method: 'POST',
        //     headers: {
        //       Authorization: `Bearer ${apiKey.key}`,
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       model: 'deepseek/deepseek-v3-base:free',
        //       messages: [
        //         {
        //           "role": 'user',
        //           "content": 'What is the meaning of life?',
        //         },
        //       ],
        //     }),
        //   });

        const url = 'https://openrouter.ai/api/v1/chat/completions';
        const options = {
            method: 'POST',
            headers: {Authorization: `Bearer ${apiKey.key}`, 'Content-Type': 'application/json'},
            body: `{"model":"deepseek/deepseek-r1","messages":[{"role":"user","content":"Reply with one word: what is a gemstone with the following attributes: color:${gemstoneDescription.getColorString()}, luster:${gemstoneDescription.getShininess()}, transparency:${gemstoneDescription.getTransparency()}, size:${gemstoneDescription.getSize()} cm^3"}]}`
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            const answer = data["choices"][0]["message"]["content"]
            console.log('\n\n\n',response);
            console.log('AI RESPONSE:\n',answer)
            let result = new Result();
            if(answer){
                result.name = answer;
                result.confidence = 0.5;
                result.result = true;
                result.gemstone = new Gemstone("",[0,0,0],0,"","","");
                // resultGem.setColor([0,0,0]);
                // resultGem.setShininess("");
                // resultGem.setColorString("");
                // resultGem.setSize(0);
                // resultGem.setImage("");
                // resultGem.setTransparency(gemstoneDescription.getTransparency());
                return result;
            }
            else{
                let emptyResult = new Result();
                emptyResult.confidence = 0;
                emptyResult.gemstone = new Gemstone();
                emptyResult.result = false;
                console.log('NO RESP')
                return emptyResult;
            }
        } catch (error) {
            console.error(error);
            let emptyResult = new Result();
            emptyResult.confidence = 0;
            emptyResult.gemstone = new Gemstone();
            emptyResult.result = false;
            console.log('NO RESP')
            return emptyResult;
        }
          
    };
}