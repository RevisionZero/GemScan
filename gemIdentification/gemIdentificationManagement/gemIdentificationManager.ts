import ExpertBlackboard from '@/gemIdentification/expertBlackboard/expertBlackboard'
import ForumExpertsFactory from '../expertsFactory/forumExpertsFactory';
import ExpertsFactory from '../expertsFactory/expertsFactory';
import Gemstone from '../types/gemstone';
import Result from '../types/result';
import Expert from '../experts/expert';

export default class GemIdentificationManager{

    private static instance:GemIdentificationManager = new GemIdentificationManager("");
    private premium:string = "";
    private expertBlackboard:ExpertBlackboard;
    private expertsFactory:ExpertsFactory;
    private identificationInProgress = false;

    static getInstance(): GemIdentificationManager{
        console.log('Getting instance')
        console.log(GemIdentificationManager.instance)
        // if(!GemIdentificationManager.instance){
        //     console.log('Creating new manager')
        //     GemIdentificationManager.instance = new GemIdentificationManager("");
        //     console.log(GemIdentificationManager.instance)
        // }
        console.log("Returning manager")
        return GemIdentificationManager.instance;
    }

    constructor(premium:string){
        console.log('Constructing gem manager')
        this.premium = premium;
        this.expertBlackboard = new ExpertBlackboard;
        this.expertsFactory = new ForumExpertsFactory
        this.createExperts();
    }

    scanGemstone(img?:string): boolean{
        try{
            if(img != null){
                const gemstone = new Gemstone(img);
                this.expertBlackboard.updateGemstone(gemstone);
                return true;
            }
            return false;
        }catch(err){
            console.log('ERROR: ',err)
            return false;
        }
    };

    describeGemstone(color:string,size:number,transparency:string, shininess:string){
        let rgbColor:number[] = [];
        switch(color) { 
            case "red": { 
               rgbColor = [255,0,0]; 
               break; 
            } 
            case "blue": { 
               rgbColor = [0,0,255]; 
               break; 
            } 
            case "green": { 
                rgbColor = [0,255,0]; 
                break; 
            }
            case "yellow": { 
                rgbColor = [255,255,0]; 
                break; 
            }
            case "white": { 
                rgbColor = [256,255,255]; 
                break; 
            }   
            default: { 
               break; 
            } 
         } 
        const gemstone = new Gemstone("",rgbColor,size,transparency,shininess);
        this.expertBlackboard.updateGemstone(gemstone);
    };

    createExperts():Expert[]{
        const experts:Expert[] = this.expertsFactory.createExperts();
        this.expertBlackboard.setExperts(experts);
        return experts;
    }

    async identifyGemstone(){
        this.identificationInProgress = true;
        await this.expertBlackboard.requestIdentification();
        
    }

    private startIdentification():void{
        this.identificationInProgress = true;
    }
    private endIdentification():Result{
        this.identificationInProgress = false;
        return new Result;
    }

}