import { Doc } from "../_generated/dataModel";

export type StatisticsInfo = {
    user: Doc<"users">;
    statistics: {
        totalPersons: number,
        insidePersons: number,
        outsidePersons: number
    };
}

export type StatisticsResult = {
    info: StatisticsInfo[]; 
};