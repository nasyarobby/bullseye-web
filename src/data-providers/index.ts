import { DataProvider } from "@refinedev/core";
import { IDataMultipleContextProvider } from "@refinedev/core/dist/interfaces";
import axios, { AxiosResponse } from "axios";
import { stringify } from "query-string";


const createDataProvider: (url: string) => DataProvider = (
    url: string
  ) => {
    const client = axios.create({
        baseURL: url
    });
  
    function handleResponse(response: AxiosResponse) {
        const total = response.data.jobCounts;
        return { data: response.data.jobs, total };
    }
  
    function handleOne(response: AxiosResponse<{ status: string; data: any }>) {
      return { data: response.data.data };
    }
  
    return {
      getApiUrl: () => {
        return url;
      },
      getList: async ({ resource, pagination, meta }) => {
        const status = meta?.status || "completed";
        console.log({meta})
        const queue = meta?.fields?.queue || "mailtoken";
  
        const { current = 1, pageSize = 5 } = pagination ?? {};
  
        const query = {
          page: current,
          limit: pageSize,
        };
  
        return client
          .get(`/${resource}/${queue}/jobs/${status}?${stringify(query)}`)
          .then(handleResponse);
      },
      create: async (params) => {
        return client
          .post(`/${params.resource}`, params.variables)
          .then(handleOne);
      },
      update: async (params) => {
        console.log({ params });
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

export const appDataProvider: IDataMultipleContextProvider = {
    default: createDataProvider("/api/"),
  };
  