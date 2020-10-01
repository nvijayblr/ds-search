/* eslint no-underscore-dangle: [1, { "allow": ["__env"] }] */
import axios from 'axios';
import moment from 'moment';

const { apiDomain, authApiDomain, sharedKey, dmsSearchApiDomain } = window.__env;

/* eslint-disable no-param-reassign */
axios.interceptors.request.use(
  config => {
    // let auth = localStorage.getItem('auth');
    // const loginUrl = `${authApiDomain}/login/${sharedKey}`;

    // let token = null;
    // let loginExpiryMoment = null;
    // let loginExpired = null;

    // if (config.url === loginUrl) {
    //   localStorage.removeItem('auth');
    //   localStorage.removeItem('roles');
    //   auth = null;
    // }
    // if (auth) {
    //   const parsedAuth = JSON.parse(auth);

    //   token = parsedAuth.jwt;
    //   loginExpiryMoment = moment.unix(parsedAuth.logged_in_till);
    //   loginExpired = moment().isAfter(loginExpiryMoment);

    //   if (loginExpired) {
    //     localStorage.removeItem('auth');
    //     localStorage.removeItem('roles');
    //     window.location.href = '/public/login';
    //     return;
    //   }

    //   if (token) {
    //     config.headers['X-auth'] = token;
    //   }
    // } else if (config.url !== loginUrl && config.url.indexOf('heartbeat') < 0) {
    //   window.location.href = '/public/login';
    // }

    // eslint-disable-next-line consistent-return
    return config;
  },

  error => Promise.reject(error)
);
/* eslint-enable no-param-reassign */

export const loginRequest = values =>
  axios({
    method: 'post',
    url: `${authApiDomain}/login/${sharedKey}`,
    timeout: 10 * 1000,
    data: values
  });

export const getRolesRequest = query => axios.get(`${apiDomain}/dds-pages/`);

export const getDevicesPassword = deviceId => axios.get(`${apiDomain}/device/${deviceId}/oob-pwd/`);

export const getConnectionPolling = (connectionTimeout, pageName, username) =>
  axios.get(`${apiDomain}/sys/heartbeat?page=${pageName}&user_id=${username}`, {
    timeout: connectionTimeout
  });

// DSM Related API

export const getDSMWorkspacesRequest = () => axios.get(`${apiDomain}/dsm/all/`);

export const getDSMTemplatesRequest = () => axios.get(`${apiDomain}/dsm/`);

export const getDSMD3ObjectRequest = (workspace, domain, model) =>
  axios.get(`${apiDomain}/dsm/${workspace}/${domain}/${model}/`);

export const getDSMDevicesRequest = (query, option, signal) =>
  axios.get(`${apiDomain}/search-dsm/?q=${query}&page_size=1&option=${option}`, signal);

export const getDSMSearchOptions = () => axios.get(`${apiDomain}/search-dsm-options/`);

export const runDSMAction = (workspace, domain, model, action) =>
  axios.get(`${apiDomain}/dsm/${workspace}/${domain}/${model}/${action}`);

// DDS Search realted API

export const getDevicesRequest = (query, signal) =>
  axios.get(`${apiDomain}/device/?q=${query}`, signal);

export const getCmaDataRequest = (deviceId, cmaItemId, ingestionId) =>
  axios.get(`${apiDomain}/device/${deviceId}/cma-objects/${cmaItemId}/?result=${ingestionId}`);

export const getEasyIPRequest = ip => axios.get(`${apiDomain}/easyip/?q=${ip}`);

export const getDeviceDataRequest = (deviceId, ingestionId) =>
  axios.get(`${apiDomain}/device/${deviceId}/?result=${ingestionId}`);

export const getIngestionHistoryRequest = deviceId =>
  axios.get(`${apiDomain}/device/${deviceId}/history/`);

export const getLogsRequest = (params, signal) => {
  if (params) {
    return axios.get(
      `${apiDomain}/generic/audit-log/?datetime_gte=${params.start}&datetime_lte=${params.end}&page_size=1000`,
      signal
    );
  }

  return axios.get(`${apiDomain}/api/generic/audit-log/?page_size=1000`, signal);
};

export const getDSMSearchRequest = (query, queryOption, options, signal) =>
  axios.get(
    `${dmsSearchApiDomain}search/?${queryOption}=${query}&page=${options.page}&pagesize=${options.pageSize}${options.sorting}${options.filtering}`,
    signal
  );

export const getDSMTypeaheadRequest = (query, field, size) =>
  axios.get(`${dmsSearchApiDomain}typeahead/${field}/?typeahead=${query}&limit=${size}`);

export const getDSMFilterTypeaheadRequest = (queryOption, query, filter, value, field) =>
  axios.get(`${dmsSearchApiDomain}typeahead/${field}/?${queryOption}=${query}${filter}&limit=15`);
