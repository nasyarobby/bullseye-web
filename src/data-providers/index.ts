import { DataProvider } from "@refinedev/core";
import { IDataMultipleContextProvider } from "@refinedev/core/dist/interfaces";
import queueDataProvider from "./QueueDataProvider";
import jobDataProvider from "./JobDataProvider";
import connectionDataProvider from "./ConnectionDataProvider";

// cast default as DataProvider
export const appDataProvider: IDataMultipleContextProvider = {
    default: queueDataProvider("/api/") as DataProvider,
    jobs: jobDataProvider("/api/"),
    connections: connectionDataProvider("/api/"),
  };
  