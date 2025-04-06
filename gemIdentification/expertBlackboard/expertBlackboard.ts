import Expert from "../experts/expert";
import Gemstone from "../types/gemstone";
import Result from "../types/result";
import ForumAggregator from "./forumAggregator";
import ResultsAggregator from "./resultsAggregator";

export default class ExpertBlackboard{
    private gemstone:Gemstone;
    private experts:Expert[];
    private resultsAggregator:ResultsAggregator;

    constructor(){
        this.resultsAggregator = new ForumAggregator();
        this.gemstone = new Gemstone();
    }

    setExperts(experts:Expert[]){
        this.experts = experts;
    }

    async requestIdentification():Promise<Result>{
        console.log('Gemstone inside blackboard:\n',this.gemstone)
        const promises = this.experts.map(expert => expert.identify(this.gemstone));
        let results = await Promise.all(promises);
        let finalResult = this.resultsAggregator.aggregateResults(results);
        return finalResult;
    };

    initiateExpert():void{

    };

    updateGemstone(gemstoneDescription:Gemstone):void{
        console.log('\n\n\nUPDATING GEMSTONE')
        console.log('RECIEVED GEMSTONE:\n',gemstoneDescription,'\n')
        if(!this.gemstone.getImage()){
            console.log('UPDATING IMAGE')
            this.gemstone.setImage(gemstoneDescription.getImage());
        }
        if(!this.gemstone.getColor()){
            console.log('UPDATING COLOR')
            this.gemstone.setColor(gemstoneDescription.getColor());
        }
        if(!this.gemstone.getSize()){
            console.log('UPDATING SIZE')
            this.gemstone.setSize(gemstoneDescription.getSize());
        }
        if(!this.gemstone.getTransparency()){
            console.log('UPDATING TRANSPARENCY')
            this.gemstone.setTransparency(gemstoneDescription.getTransparency());
        }
        if(!this.gemstone.getShininess()){
            console.log('UPDATING SHININESS')
            this.gemstone.setShininess(gemstoneDescription.getShininess());
        }
        if(!this.gemstone.getColorString()){
            console.log('UPDATING COLOR STRING')
            this.gemstone.setColorString(gemstoneDescription.getColorString());
            console.log('PROVIDED COLOR STRING:\n',gemstoneDescription.getColorString())
            console.log('SAVED COLOR STRING:\n',this.gemstone.getColorString())
        }
    }
}