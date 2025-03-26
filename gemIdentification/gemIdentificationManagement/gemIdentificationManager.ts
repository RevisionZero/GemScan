class GemIdentificationManager{

    static instance:GemIdentificationManager;
    private premium:string = "";
    private expertBlackboard:ExpertBlackboard;
    private expertsFactory:ExpertsFactory;

    static getInstance(){
        if(GemIdentificationManager.instance == null){
            GemIdentificationManager.instance = new GemIdentificationManager("a");
        }
        return this.instance;
    }

    constructor(premium:string){
        this.premium = premium;
    }

    scanGemstone(){
        const gemstone = new Gemstone()
    };

}