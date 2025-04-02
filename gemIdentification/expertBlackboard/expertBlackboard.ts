class ExpertBlackboard{
    private gemstone:Gemstone;
    private experts:Expert[];
    private resultsAggregator:ResultsAggregator;

    constructor(){
        this.resultsAggregator = new ForumAggregator;
        this.gemstone = new Gemstone();
    }

    setExperts(experts:Expert[]){
        this.experts = experts;
    }

    requestIdentification():Result{
        return new Result;
    };

    initiateExpert():void{

    };

    updateGemstone(gemstoneDescription:Gemstone):void{
        if(gemstoneDescription.getImage != undefined){
            this.gemstone.setImage(gemstoneDescription.getImage());
        }
        if(gemstoneDescription.getColor != undefined){
            this.gemstone.setColor(gemstoneDescription.getColor());
        }
        if(gemstoneDescription.getSize != undefined){
            this.gemstone.setSize(gemstoneDescription.getSize());
        }
        if(gemstoneDescription.getAttributes != undefined){
            this.gemstone.setAttributes(gemstoneDescription.getAttributes());
        }
    }
}