import axios from 'axios';
import dayjs from 'dayjs';
import md5 from 'md5';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "X-Auth": md5(`Valantis_${dayjs(new Date).format("YYYYMMDD")}`),
    }
});

api.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error?.message === 'Network Error') {
            console.log("No connected internet");
        }

        let action: string = "";
        let params: { ids?: string[] } = {};

        try {
            const { action: actionType, params: actionParams } = JSON.parse(error.response.config.data);
            action = actionType;
            params = actionParams;
        } catch (e) {
            console.error("Error parsing JSON:", e);
            return Promise.reject(e);
        }
console.log(action,"action")
        switch (action) {
            case "get_ids":
                if (params && Object.keys(params).length > 0) {
                    return getAllData(1);
                } else {
                    return getAllInfo();
                }
            case "get_items":
                return getAllDataInfo(params?.ids as string[]);
            default:
                console.log("Unknown action:", action);
                return Promise.reject("Unknown action");
        }
    }

);

export const getAllInfo = () => {
    return api.post("", { "action": "get_ids" })
        .catch((err) => {
            console.log(err.message)
            return err;
        })
}

export const getAllData = (page: number) => {
    const limit = 50;
    const offset = (page - 1) * limit + 1;
    return api.post("", { "action": "get_ids", "params": { "offset": offset, "limit": limit } })
        .catch((err) => {
            console.log(err.message)
            return err;
        })
}

export const getAllDataInfo = (ids:string[]) => {
    if (ids.length) {
        return api.post("", {
            "action": "get_items",
            "params": {
                "ids": ids
            }
        }).catch((err) => {
            console.log(err.message)
            return err;
        })
    }
}

export const searchData = (data: {title:string, value:string | number }) => {
    const { title, value } = data
    let params = {};
    switch (title) {
        case "product":
            params = { "product": value };
            break;
        case "brand":
            params = { "brand": value };
            break;
        default:
            params = { "price": +value };
    }

    return api.post("", {
        "action": "filter",
        "params": params
    }).catch((err) => {
        console.log(err.message)
        return err;
    });
}