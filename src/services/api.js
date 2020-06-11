/* eslint no-underscore-dangle: [1, { "allow": ["__env"] }] */
import axios from "axios";

const { searchApi } = window.__env;

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export const getSearchRequest = (query, option, signal) =>
  axios.get(
    `${searchApi}${query}&page=${option.page}&pagesize=${option.pageSize}`,
    signal
  );
