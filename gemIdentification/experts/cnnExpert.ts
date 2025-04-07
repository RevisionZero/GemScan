import Gemstone from "../types/gemstone";
import Result from "../types/result";
import Expert from "./expert";
import * as FileSystem from 'expo-file-system';

export default class CNNExpert implements Expert{
    async identify(gemstoneDescription:Gemstone):Promise<Result>{
        
        console.log('IMAGE:\n',gemstoneDescription.getImage())

        const fileInfo = await FileSystem.getInfoAsync(gemstoneDescription.getImage());
        if (!fileInfo.exists) {
            console.error('File does not exist at URI:', gemstoneDescription.getImage());
            return new Result();
        }
        

        // const fileName = gemstoneDescription.getImage().split('/').pop() || 'upload.jpg';
        const fileName = gemstoneDescription.getImage().split('/').pop();
        console.log('filename:\n',fileName)
        const formData = new FormData();
        
        formData.append('image', {
            uri: gemstoneDescription.getImage(),
            name: fileName,
            type: 'image/jpg', // or 'image/png' based on your image
        } as any); // `as any` helps with TS complaints
        
        const response = await fetch('http://10.0.0.11:4000/predict', {
            method: 'POST',
            body: formData,
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        
        const respJSON = await response.json();
        const name = respJSON["predicted_class"];
        if(name){
            let result = new Result();
            result.confidence = 0.99;
            result.result = true;
            result.name = name;
            result.gemstone = new Gemstone("",[0,0,0],0,"","","");
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
    };
}