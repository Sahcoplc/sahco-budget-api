import redis from "redis";

const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, NODE_ENV } = process.env;

export const client = NODE_ENV === 'development' ? redis.createClient() : redis.createClient({
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

const parseJSON = (data) => {
    let parsed = JSON.parse(data);
    if (typeof parsed === "string") {
        parsed = parseJSON(parsed);
    }
    return parsed;
};

export const fetch = async (key) => {
    const data = await client.get(key);
    const result = parseJSON(data);
    return result;
};

/**
 *
 * @param {String} key
 * @param {Object} options
 * @returns
 */

export const insert = async (key, value, options) => {
    const data = typeof value === "string" ? value : JSON.stringify(value);
    const result = options?.EX ? await client.SETEX(key, options.EX, data) : await client.set(key, data);
    return result;
};

export const destroy = async (key) => {
    await client.del(key);
};
