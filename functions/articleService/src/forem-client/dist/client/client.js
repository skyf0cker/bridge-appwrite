"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.foremClient = void 0;
const axios_1 = __importDefault(require("axios"));
const endpoint = 'https://dev.to';
exports.foremClient = axios_1.default.create({
    baseURL: endpoint,
});
exports.foremClient.interceptors.request.use(requestInterceptors, requestErrorReject);
function requestInterceptors(config) {
    if (process.env.DEBUG === "true") {
        console.log(config);
    }
    return config;
}
function requestErrorReject(err) {
    console.log(err);
    return Promise.reject(err);
}
