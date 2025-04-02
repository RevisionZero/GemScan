import Result from "../types/result";

export default interface ResultsAggregator{
    aggregateResults(results:Result[]): Result;
}