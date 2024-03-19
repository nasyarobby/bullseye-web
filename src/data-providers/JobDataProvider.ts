import {
    CreateParams, CreateResponse,
    DeleteOneParams, DeleteOneResponse, GetListParams, GetListResponse, GetOneParams, GetOneResponse, UpdateParams, UpdateResponse
} from "@refinedev/core";
import axios, { AxiosResponse } from "axios";
import { stringify } from "query-string";
import { Job, JobsListApiResponse } from "../@types";

type DataType = {
    id: string
}

type Variables = {
    hello: string
}

type ParamsMeta = {
    meta: {
        name: string 
        fields?: { queue?: string } 
    }
}

interface MyDataProviderInterface<D> {
    getApiUrl: () => string;
    getList: (params: GetListParams & ParamsMeta) => Promise<GetListResponse<D>>;
    getOne: (params: GetOneParams & ParamsMeta) => Promise<GetOneResponse<D>>;
    create: (params: CreateParams<Variables>) => Promise<CreateResponse<D>>;
    update: (params: UpdateParams<Variables>) => Promise<UpdateResponse<D>>;
    deleteOne: (params: DeleteOneParams<Variables> & ParamsMeta) => Promise<DeleteOneResponse<D>>;
}

type DataProviderInitiator = (url: string) => MyDataProviderInterface<DataType>

const jobDataProvider: DataProviderInitiator = (url) => {
    const client = axios.create({
        baseURL: url
    });

    function handleResponse(response: AxiosResponse<JobsListApiResponse>) {
        const total = response.data.jobCounts;
        return { data: response.data.jobs, total, dataFields: response.data.dataFields || [] };
    }

    function handleOne(response: AxiosResponse<Job>) {
        return { data: response.data };
    }

    return {
        getApiUrl: () => {
            return url;
        },
        getList: async ({ resource, pagination, meta }) => {
            const status = meta?.status || "completed";
            const queue = meta?.name || "";

            const { current = 1, pageSize = 5 } = pagination ?? {};

            const query = {
                page: current,
                limit: pageSize,
                stats: true,
                status,
            };

            const queueUrl = queue ? `/${resource}/${queue}/jobs` : `/${resource}`

            return client
                .get(`${queueUrl}?${stringify(query)}`)
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
                    `/${params.resource}/${params.meta?.queue}/${params.id}`,
                    params.variables
                )
                .then(handleOne);
        },
        deleteOne: async (params) => {
            console.log(params)
            return client
                .delete(`/queues/${params.meta.name}/jobs/${params.id}`)
                .then(handleOne)
        },

        getOne: async (params) => {
            return client
                .get(`/queues/${params.meta.name}/jobs/${params.id}`)
                .then(handleOne)
        }
    };
};

export default jobDataProvider;