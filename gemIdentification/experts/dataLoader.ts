export default class DataLoader{
    private static dataPath = "../../gemdata.json";
    
    static readData():JSON{

        let data:any = JSON.parse(this.dataPath);
        console.log(data);
        return data;
    }
}