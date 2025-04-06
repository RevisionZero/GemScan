import Expert from "../experts/expert";

export default interface ExpertsFactory{
    createExperts():Expert[];
}