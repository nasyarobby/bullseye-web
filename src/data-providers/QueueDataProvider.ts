import {
    CreateParams, CreateResponse,
    DeleteOneParams, DeleteOneResponse, GetListParams, GetListResponse, GetOneParams, GetOneResponse, UpdateParams, UpdateResponse
} from "@refinedev/core";
import axios, { AxiosResponse } from "axios";
import { stringify } from "query-string";
import { QueueApiResponse, QueueElement } from "../@types";

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

type DataProviderInitiator = (url: string) => MyDataProviderInterface<DataType>

const queueDataProvider: DataProviderInitiator = (url) => {

    const client = axios.create({
        baseURL: url
    });

    function handleResponse(response: AxiosResponse<QueueApiResponse>) {
        return { data: response.data.queues, total: response.data.queues.length };
    }

    function handleOne(response: AxiosResponse<QueueElement>) {
        return { data: response.data };
    }

    return {
        getApiUrl: () => {
            return url;
        },
        getList: async ({ resource, pagination }) => {
            const { current = 1, pageSize = 5 } = pagination ?? {};

            const query = {
                page: current,
                limit: pageSize,
                stats: true,
            };
            return client
                .get(`/${resource}?${stringify(query)}`)
                .then(handleResponse);
        },
        create: async (params) => {
            return client
                .post(`/${params.resource}`, params.variables)
                .then(handleOne);
        },
        update: async (params) => {
            return client
                .post(
                    `/${params.resource}/${params.id}`,
                    params.variables
                )
                .then(handleOne);
        },
        deleteOne: async (params) =>
            client.get(`/${params.resource}`).then(handleOne),
        getOne: async (params) =>
            client
                .get(`/${params.resource}/${params.id}`)
                .then(handleOne),
    };
}

export default queueDataProvider;