import { LiveEvent, LiveProvider } from "@refinedev/core"

type MessageType = {
    data: {
        type: string,
        payload: {
            ids: string[]
        },
        channel: string,
        date: Date
    }
}

type Channel = {
    subscribe: (fn: (message: MessageType) => void) => void
}

type Client = {
    channels: {
        get: (channel: string) => Channel
    }
}
 
const liveProvider: (client: Client) => LiveProvider = (client) => {

    return {
        publish: (event: LiveEvent) => {
            console.log({ event })
        },
        unsubscribe: (subscription: any) => {
            console.log(subscription)
        },
        subscribe: ({ channel, types, params, callback }) => {
            const channelInstance = client.channels.get(channel);

            const listener = (message: MessageType) => {
                if (types.includes("*") || types.includes(message.data.type)) {
                    if (
                        message.data.type !== "created" &&
                        params?.ids !== undefined &&
                        message.data?.payload?.ids !== undefined
                    ) {
                        if (
                            params.ids
                                .map(String)
                                .filter((value) =>
                                    message.data.payload?.ids?.map(String).includes(value),
                                ).length > 0
                        ) {
                            callback(message.data as LiveEvent);
                        }
                    } else {
                        callback(message.data);
                    }
                }
            };
            channelInstance.subscribe(listener);

            return { channelInstance, listener };
        },
    }
}

export default liveProvider