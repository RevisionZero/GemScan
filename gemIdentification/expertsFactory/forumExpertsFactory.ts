import AIExpert from "../experts/aiExpert";
import CNNExpert from "../experts/cnnExpert";
import DataExpert from "../experts/dataExpert";
import Expert from "../experts/expert";
import ExpertsFactory from "./expertsFactory";

export default class ForumExpertsFactory implements ExpertsFactory{
    createExperts():Expert[]{
        let experts:Expert[] = [];
        experts.push(new AIExpert());
        experts.push(new CNNExpert());
        experts.push(new DataExpert());  

        return experts;
    };
}