export default class Gemstone{
    private image:string = "";
    private color:number[] = [0,0,0];
    private size:number = 0;
    // private attributes:Map<string,string> = new Map();
    private transparency:string = "";
    private shininess:string = "";
    private colorString:string = "";

    constructor(image?:string,color?:number[],size?:number,transparency?:string, shininess?:string, colorString?:string){
        if(image != undefined){
            this.image = image;
        }
        if(color != undefined){
            this.color = color;
        }
        if(size != undefined){
            this.size = size;
        }
        if(transparency != undefined){
            this.transparency = transparency;
        }
        if(shininess != undefined){
            this.shininess = shininess;
        }
        if(colorString != undefined){
            this.colorString = colorString;
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


    setTransparency(transparency:string){
        this.transparency = this.transparency;
    }

    getTransparency(){
        return this.transparency;
    };

    setShininess(shininess:string){
        this.shininess = this.shininess;
    }

    getShininess(){
        return this.shininess;
    };

    setColorString(colorString:string){
        this.colorString = this.colorString;
    }

    getColorString(){
        return this.colorString;
    };

}