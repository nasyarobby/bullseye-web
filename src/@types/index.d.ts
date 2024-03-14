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

export interface QueueApiResponse {
    queues: QueueElement[];
}

export interface QueueElement {
    id:           string;
    connectionId: string;
    queueName:    string;
    friendlyName: string;
    dataFields?:  DataField[];
    queue:        QueueQueue;
    stats:        Stats;
}

export interface DataField {
    columnName: string;
    jsonPath:   string;
}

export interface QueueQueue {
    name:                  string;
    token:                 string;
    keyPrefix:             string;
    clients:               any[];
    clientInitialized:     boolean;
    _events:               Events;
    _eventsCount:          number;
    _initializing:         Initializing;
    handlers:              Initializing;
    processing:            any[];
    retrieving:            number;
    drained:               boolean;
    settings:              Settings;
    timers:                Timers;
    keys:                  Keys;
    subscriberInitialized: boolean;
    registeredEvents:      RegisteredEvents;
}

export interface Events {
    close: null[];
}

export interface Keys {
    "":              string;
    active:          string;
    wait:            string;
    waiting:         string;
    paused:          string;
    resumed:         string;
    "meta-paused":   string;
    id:              string;
    delayed:         string;
    priority:        string;
    "stalled-check": string;
    completed:       string;
    failed:          string;
    stalled:         string;
    repeat:          string;
    limiter:         string;
    drained:         string;
    progress:        string;
}

export interface RegisteredEvents {
    waiting:   Initializing;
    completed: Initializing;
}

export interface Settings {
    lockDuration:      number;
    stalledInterval:   number;
    maxStalledCount:   number;
    guardInterval:     number;
    retryProcessDelay: number;
    drainDelay:        number;
    backoffStrategies: Initializing;
    isSharedChildPool: boolean;
    lockRenewTime:     number;
}

export interface Timers {
    idle:      boolean;
    listeners: any[];
    timers:    Initializing;
}

export interface Stats {
    jobCounts: JobCounts;
    workers:   Worker[];
}

export interface JobCounts {
    waiting:   number;
    active:    number;
    completed: number;
    failed:    number;
    delayed:   number;
    paused:    number;
}

export interface Worker {
    id:    string;
    addr:  string;
    laddr: string;
}

export interface JobsListApiResponse {
    dataFields: DataField[];
    jobCounts:  number;
    jobs:       Job[];
}

export interface DataField {
    columnName: string;
    jsonPath:   string;
}

export interface Job {
    id:            string;
    name:          Name;
    data:          Data;
    opts:          Opts;
    progress:      number;
    delay:         number;
    timestamp:     number;
    attemptsMade:  number;
    stacktrace:    string[];
    returnvalue:   string;
    finishedOn:    number;
    processedOn:   number;
    failedReason?: string;
}

export interface Data {
    prompt:   string;
    nsfw:     boolean;
    user:     string;
    powerups: number;
}

export enum Name {
    Default = "__default__",
}

export interface Opts {
    attempts:  number;
    delay:     number;
    timestamp: number;
}

export interface ConnectionListApiResponse {
    connections: Connection[];
}

export interface Connection {
    id:         string;
    config:     Config;
    redis:      Redis;
    bclient:    any[];
    subscriber: PokedexSubscriber;
    status:     string;
}

export interface Config {
    name: string;
    host: string;
    port: string;
    db:   number;
}

export interface Redis {
    options:               Options;
    scriptsSet:            { [key: string]: ScriptsSet };
    addedBuiltinSet:       AutoPipelines;
    status:                string;
    isCluster:             boolean;
    reconnectTimeout:      null;
    connectionEpoch:       number;
    retryAttempts:         number;
    manuallyClosing:       boolean;
    _autoPipelines:        AutoPipelines;
    _runningAutoPipelines: AutoPipelines;
    _events:               AutoPipelines;
    _eventsCount:          number;
    commandQueue:          Queue;
    offlineQueue:          Queue;
    connector:             Connector;
    condition:             RedisCondition;
    stream:                Stream;
}

export interface Queue {
    _head:         number;
    _tail:         number;
    _capacityMask: number;
    _list:         null[];
}

export interface RedisCondition {
    select:     number;
    auth:       null;
    subscriber: boolean;
}

export interface Connector {
    connecting:        boolean;
    disconnectTimeout: number;
    options:           Options;
    stream:            Stream;
}

export interface Options {
    name:                          string;
    host:                          string;
    port:                          number;
    db:                            number;
    enableReadyCheck:              boolean;
    maxRetriesPerRequest:          null;
    family:                        number;
    connectTimeout:                number;
    disconnectTimeout:             number;
    keepAlive:                     number;
    noDelay:                       boolean;
    connectionName:                null;
    sentinels:                     null;
    role:                          string;
    natMap:                        null;
    enableTLSForSentinelMode:      boolean;
    updateSentinels:               boolean;
    failoverDetector:              boolean;
    username:                      null;
    password:                      null;
    enableOfflineQueue:            boolean;
    autoResubscribe:               boolean;
    autoResendUnfulfilledCommands: boolean;
    lazyConnect:                   boolean;
    keyPrefix:                     string;
    reconnectOnError:              null;
    readOnly:                      boolean;
    stringNumbers:                 boolean;
    maxLoadingRetryTime:           number;
    enableAutoPipelining:          boolean;
    autoPipeliningIgnoredCommands: any[];
    sentinelMaxConnections:        number;
}

export interface Stream {
    connecting:               boolean;
    _hadError:                boolean;
    _parent:                  null;
    _host:                    null;
    _closeAfterHandlingError: boolean;
    _events:                  Events;
    _readableState:           ReadableState;
    _writableState:           WritableState;
    allowHalfOpen:            boolean;
    _eventsCount:             number;
    _sockname:                null;
    _pendingData:             null;
    _pendingEncoding:         string;
    server:                   null;
    _server:                  null;
    timeout:                  number;
}

export interface Events {
    error: null[];
}

export interface ReadableState {
    highWaterMark:     number;
    buffer:            any[];
    bufferIndex:       number;
    length:            number;
    pipes:             any[];
    awaitDrainWriters: null;
}

export interface WritableState {
    highWaterMark: number;
    length:        number;
    corked:        number;
    writelen:      number;
    bufferedIndex: number;
    pendingcb:     number;
}

export interface ScriptsSet {
    lua:          string;
    numberOfKeys: number;
    keyPrefix:    string;
    readOnly:     boolean;
    sha:          string;
}

export interface PokedexSubscriber {
    options:               Options;
    scriptsSet:            AutoPipelines;
    addedBuiltinSet:       AutoPipelines;
    status:                string;
    isCluster:             boolean;
    reconnectTimeout:      null;
    connectionEpoch:       number;
    retryAttempts:         number;
    manuallyClosing:       boolean;
    _autoPipelines:        AutoPipelines;
    _runningAutoPipelines: AutoPipelines;
    _events:               AutoPipelines;
    _eventsCount:          number;
    commandQueue:          Queue;
    offlineQueue:          Queue;
    connector:             Connector;
    condition:             SubscriberCondition;
    stream:                Stream;
}

export interface SubscriberCondition {
    select:     number;
    auth:       null;
    subscriber: ConditionSubscriber;
}

export interface ConditionSubscriber {
    set: Set;
}

export interface Set {
    subscribe:  Subscribe;
    psubscribe: Psubscribe;
    ssubscribe: AutoPipelines;
}

export interface Psubscribe {
    "bull:comicxyz:download-chapters:waiting*"?: boolean;
    "bull:bing:img:waiting*"?:                   boolean;
}

export interface Subscribe {
    "bull:comicxyz:download-chapters:completed"?: boolean;
    "bull:bing:img:completed"?:                   boolean;
}
