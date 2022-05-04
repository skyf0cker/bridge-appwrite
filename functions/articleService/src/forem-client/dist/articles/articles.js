"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArticleDetailById = exports.getPublishedArticles = void 0;
const client_1 = require("../client/client");
// https://developers.forem.com/api#operation/getArticles
function getPublishedArticles(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client_1.foremClient.get('/api/articles', {
            params: params,
        });
        return resp.data;
    });
}
exports.getPublishedArticles = getPublishedArticles;
function getArticleDetailById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield client_1.foremClient.get(`/api/articles/${id}`);
        return resp.data;
    });
}
exports.getArticleDetailById = getArticleDetailById;
exports.default = {
    getPublishedArticles,
    getArticleDetailById
};
