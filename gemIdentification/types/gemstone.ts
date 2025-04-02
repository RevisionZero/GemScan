export default class Gemstone{
    private image:string = "";
    private color:number[] = [0,0,0];
    private size:number = 0;
    private attributes:Map<string,string> = new Map();

    constructor(image?:string,color?:number[],size?:number,attributes?:Map<string,string>){
        if(image != undefined){
            this.image = image;
        }
        if(color != undefined){
            this.color = color;
        }
        if(size != undefined){
            this.size = size;
        }
        if(attributes != undefined){
            this.attributes = attributes;
        }
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