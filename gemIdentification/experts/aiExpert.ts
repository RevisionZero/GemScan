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
            body: '{"model":"deepseek/deepseek-r1:free","messages":[{"role":"user","content":"What is the meaning of life?"}]}'
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
            console.log('AI RESPONSE:\n',response)
        } catch (error) {
            console.error(error);
        }
          
        return new Result();
    };
}