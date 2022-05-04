import axios, { AxiosRequestConfig } from 'axios';

const endpoint = 'https://dev.to';

export const foremClient = axios.create({
    baseURL: endpoint,
});

foremClient.interceptors.request.use(requestInterceptors, requestErrorReject);

function requestInterceptors(config: AxiosRequestConfig): AxiosRequestConfig {
    if (process.env.DEBUG === "true") {
        console.log(config);
    }

    return config
}

function requestErrorReject(err: any): any {
    console.log(err)
    return Promise.reject(err)
}
