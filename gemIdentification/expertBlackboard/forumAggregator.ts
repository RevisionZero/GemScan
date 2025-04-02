import Result from "../types/result";
import ResultsAggregator from "./resultsAggregator";

export default class ForumAggregator implements ResultsAggregator{

    aggregateResults(results: Result[]): Result {
        return new Result();
    }
}