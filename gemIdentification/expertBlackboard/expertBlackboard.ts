class ExpertBlackboard{
    private gemstone:Gemstone;
    private experts:Expert[];
    private resultsAggregator:ResultsAggregator;

    constructor(){
        this.resultsAggregator = new ForumAggregator;
    }

    requestIdentification():Result{
        return new Result;
    };

    initiateExpert():void{

    };

    updateGemstone(gemstoneDescription:Gemstone):void{

    }
}