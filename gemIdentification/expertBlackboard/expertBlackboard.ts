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
        this.experts.forEach(expert => {
            expert.identify(this.gemstone);
        });
        let results = await Promise.all(this.experts);
        this.resultsAggregator.aggregateResults();
        return new Result();
    };

    initiateExpert():void{

    };

    updateGemstone(gemstoneDescription:Gemstone):void{
        if(!gemstoneDescription.getImage){
            this.gemstone.setImage(gemstoneDescription.getImage());
        }
        if(!gemstoneDescription.getColor){
            this.gemstone.setColor(gemstoneDescription.getColor());
        }
        if(!gemstoneDescription.getSize){
            this.gemstone.setSize(gemstoneDescription.getSize());
        }
        if(!gemstoneDescription.getTransparency){
            this.gemstone.setTransparency(gemstoneDescription.getTransparency());
        }
        if(!gemstoneDescription.getShininess){
            this.gemstone.setShininess(gemstoneDescription.getShininess());
        }
    }
}