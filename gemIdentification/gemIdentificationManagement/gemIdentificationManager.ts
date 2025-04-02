class GemIdentificationManager{

    static instance:GemIdentificationManager;
    private premium:string = "";
    private expertBlackboard:ExpertBlackboard;
    private expertsFactory:ExpertsFactory;
    private identificationInProgress = false;

    static getInstance(){
        if(GemIdentificationManager.instance == null){
            GemIdentificationManager.instance = new GemIdentificationManager("");
        }
        return this.instance;
    }

    constructor(premium:string){
        this.premium = premium;
        this.createExperts();
    }

    scanGemstone(img:string){
        const gemstone = new Gemstone(img);
        this.expertBlackboard.updateGemstone(gemstone);
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