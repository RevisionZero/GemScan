import Result from "../types/result";
import ResultsAggregator from "./resultsAggregator";

export default class ForumAggregator implements ResultsAggregator{

    aggregateResults(results: Result[]): Result {
        console.log('Inisde results aggregator')
        let result = new Result();
        let maxConfidence = 0;
        results.forEach(res => {
            if(res.confidence > maxConfidence){
                console.log('FOUND NEW MAX CONFIDENCE',res.confidence)
                result = res;
                console.log('NEW HIGHEST CONFIDENCE:\n',result)
                maxConfidence = res.confidence;
            }
        })
        return result;
    }
}