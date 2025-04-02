class ForumExpertsFactory implements  ExpertsFactory{
    createExperts():Expert[]{
        let experts:Expert[] = [];
        experts.push(new AIExpert);
        experts.push(new CNNExpert);
        experts.push(new DataExpert);

        return experts;
    };
}