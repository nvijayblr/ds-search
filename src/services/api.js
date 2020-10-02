/* eslint no-underscore-dangle: [1, { "allow": ["__env"] }] */
import axios from "axios";

const { apiDomain } = window.__env;

/* eslint-disable no-param-reassign */
axios.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => Promise.reject(error)
);
/* eslint-enable no-param-reassign */

// DDS Search realted API
export const getDSMSearchRequest = (query, queryOption, options, signal) =>
  axios.get(
    `${apiDomain}search/?${queryOption}=${query}&page=${options.page}&pagesize=${options.pageSize}${options.sorting}${options.filtering}`,
    signal
  );

export const getDSMTypeaheadRequest = (query, field, size) =>
  axios.get(`${apiDomain}typeahead/${field}/?typeahead=${query}&limit=${size}`);

export const getDSMFilterTypeaheadRequest = (
  queryOption,
  query,
  filter,
  value,
  field
) =>
  axios.get(
    `${apiDomain}typeahead/${field}/?${queryOption}=${query}${filter}&limit=15`
  );
