type RedisConnection = {
    host: string,
    port: number,
    db: number,
    password?: string
}

type QueueType = {
    name: string,
    key: string,
    redis: RedisConnection
}