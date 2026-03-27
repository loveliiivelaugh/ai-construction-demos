//DBConfig.js|tsx

export const DBConfig = {
    name: "starter-local-db",
    version: 1,
    objectStoresMeta: [
        {
            store: "app_cache",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "created_at", keypath: "created_at", options: { unique: false } },
                { name: "key", keypath: "key", options: { unique: false } },
                { name: "value", keypath: "value", options: { unique: false } }
            ]
        }
    ],
};
