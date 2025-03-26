class Gemstone{
    private image:string = "";
    private color:number[] = [0,0,0];
    private size:number = 0;
    private attributes:Map<String,String> = new Map();

    constructor(){
    };

    setImage(uri:string){
        this.image = uri;
    };

    getImage(){
        return this.image;
    }


    setColor(color:number[]){
        if(color.length == 3){
            this.color = color;
        }
    };

    getColor(){
        return this.color;
    };


    setSize(size:number){
        this.size = size;
    };

    getSize(){
        return this.size;
    };


    setAttributes(attributes:Map<string,string>){
        this.attributes = attributes;
    }

    getAttributes(){
        return this.attributes;
    };

}