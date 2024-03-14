import { CreateManyParams, CreateManyResponse, CreateParams, CreateResponse, CustomParams, CustomResponse, DataProvider, DeleteManyParams, DeleteManyResponse, DeleteOneParams, DeleteOneResponse, GetListParams, GetListResponse, GetOneParams, GetOneResponse, UpdateParams, UpdateResponse } from "@refinedev/core";

type DataType = {
    id: string
}

type Params = {
    hello: string
}

interface MyDataProviderInterface<D> {
    create: (params: CreateParams<Params>) => Promise<CreateResponse<D>>;
    deleteOne: (params: DeleteOneParams<Params>) => Promise<DeleteOneResponse<D>>; 
    getApiUrl: () => string;
    getList: (params: GetListParams) => Promise<GetListResponse<D>>;
    getOne: (params: GetOneParams) => Promise<GetOneResponse<D>>;
    update: (params: UpdateParams<Params>) => Promise<UpdateResponse<D>>;
}

class MyDataProvider implements MyDataProviderInterface<DataType> {
    constructor() {
        this.create = async (params) => {
            return {
                data: {
                    id: 'string'
                }
            }
        }

        this.deleteOne = async (params) => {
            return {
                data: {
                    id: 'string'
                }
            }
        }

        this.getApiUrl = () => {
            return ""
        }
    }
}