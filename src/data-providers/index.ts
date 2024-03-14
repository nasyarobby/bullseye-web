import { DataProvider } from "@refinedev/core";
import { BaseRecord, CreateParams, CreateResponse, IDataMultipleContextProvider } from "@refinedev/core/dist/interfaces";
import axios, { AxiosResponse } from "axios";
import { stringify } from "query-string";


const queueDataProvider: (url: string) => DataProvider = (
  url: string
) => {
  const client = axios.create({
      baseURL: url
  });

  function handleResponse(response: AxiosResponse) {
      const queues = Object.keys(response.data.queues);
      return { data: queues.map(key => response.data.queues[key]), total: queues.length };
  }

  function handleOne(response: AxiosResponse<{ queue: {id: string} }>) {
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
        .get(`/${params.resource}/${params.id}`)
        .then(handleOne),
  };
};

const queueJobsDataProvider: (url: string) => DataProvider = (
  url: string
) => {
  const client = axios.create({
      baseURL: url
  });

  function handleResponse(response: AxiosResponse) {
      const total = response.data.jobCounts;
      return { data: response.data.jobs, total, dataFields: response.data.dataFields || [] };
  }

  function handleOne(response: AxiosResponse<{ status: string; data: any }>) {
    return { data: response.data };
  }

  return {
    getApiUrl: () => {
      return url;
    },
    getList: async ({ resource, pagination, meta }) => {
      const status = meta?.status || "completed";
      const queue = meta?.fields?.queue || "";

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

const connectionsDataProvider: (url: string) => DataProvider = (
  url: string
) => {
  const client = axios.create({
      baseURL: url
  });

  function handleResponse(response: AxiosResponse) {
    const total = response.data.connections.length;
    return { 
      data: response.data.connections.map((v: {id: string, config: {host: string, port: string, db: string}}) => {
      return {
        ...v, 
        friendlyName: v.id+" "+v.config.host+":"+v.config.port+"/"+v.config.db,
      }
      }),
      total }
    }

  function handleOne(response: AxiosResponse<{ status: string; data: any }>) {
    return { data: response.data.data };
  }

  return {
    getApiUrl: () => {
      return url;
    },
    getList: async ({ resource, pagination, meta }) => {
      const { current = 1, pageSize = 5 } = pagination ?? {};

      const query = {
        page: current,
        limit: pageSize,
      };

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

export const appDataProvider: IDataMultipleContextProvider = {
    default: queueDataProvider("/api/"),
    jobs: queueJobsDataProvider("/api/"),
    connections: connectionsDataProvider("/api/"),
  };
  