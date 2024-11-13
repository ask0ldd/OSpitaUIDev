import { IModelDetails } from "../IModelDetails";

export interface IListModelResponse {
        models : IModelInfos[]
}

interface IModelInfos{
        name: string;
        model: string;
        modifiedAt: Date | string;
        size: number;
        digest: string;
        details?: IModelDetails;  
}