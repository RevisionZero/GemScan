import ExpertBlackboard from '@/gemIdentification/expertBlackboard/expertBlackboard'
import ForumExpertsFactory from '../expertsFactory/forumExpertsFactory';
import ExpertsFactory from '../expertsFactory/expertsFactory';
import Gemstone from '../types/gemstone';
import Result from '../types/result';

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

    describeGemstone(description:Map<string,string>){
        const gemstone = new Gemstone("",[0,0,0],0,description);
        this.expertBlackboard.updateGemstone(gemstone);
    };

    createExperts():Expert[]{
        const experts:Expert[] = this.expertsFactory.createExperts();
        this.expertBlackboard.setExperts(experts);
        return experts;
    }

    startIdentification():void{
        this.identificationInProgress = true;
    }
    endIdentification():Result{
        this.identificationInProgress = false;
        return new Result;
    }

}