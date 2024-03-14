import {
    CreateParams, CreateResponse,
    DeleteOneParams, DeleteOneResponse, GetListParams, GetListResponse, GetOneParams, GetOneResponse, UpdateParams, UpdateResponse
} from "@refinedev/core";
import axios, { AxiosResponse } from "axios";
import { Connection, ConnectionListApiResponse } from "../@types";

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

const connectionDataProvider: DataProviderInitiator = (url) => {
    const client = axios.create({
        baseURL: url
    });
  
    function handleResponse(response: AxiosResponse<ConnectionListApiResponse>) {
      const total = response.data.connections.length;
      return { 
        data: response.data.connections.map((v) => {
        return {
          ...v, 
          friendlyName: v.id+" "+v.config.host+":"+v.config.port+"/"+v.config.db,
        }
        }),
        total }
      }
  
    function handleOne(response: AxiosResponse<{data: Connection}>) {
      return { data: response.data.data };
    }
  
    return {
      getApiUrl: () => {
        return url;
      },
      getList: async ({ resource }) => {

        return client
          .get(`/${resource}`)
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
      deleteOne: async (params) =>
        client.get(`/${params.resource}`).then(handleOne),
      getOne: async (params) =>
        client
          .get(`/${params.resource}/${params.meta?.queue}/${params.id}`)
          .then(handleOne),
    };
};

export default connectionDataProvider;