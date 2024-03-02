type RedisConnection = {
    host: string,
    port: number,
    db: number,
}

type QueueType = {
    name: string,
    key: string,
    redis: RedisConnection
}