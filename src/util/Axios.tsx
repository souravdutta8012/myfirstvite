import axios, { AxiosRequestConfig, Method } from "axios";
import jwt from "jsonwebtoken";
import { acquireTokenAsync } from "../auth/auth-msal";

const axiosBaseConfig: any = {
  timeout: 20000, //20 Seconds
  timeoutErrorMessage: "Timed out",
  headers: {},
};

/**
 * Invokes the API and returns the object type expected.
 * @param endpoint
 * @param method
 * @param config - params that need to be passed to axios request. contentType is only needed for binary types
 * @returns
 */

export const invokeAxios = async <T extends unknown>(
  endpoint: string,
  method: Method = "GET",
  config?: AxiosRequestConfig & { contentType?: any }
) => {
  const baseUrl = process.env.REACT_APP_BASEAPI;
  const token: any = await acquireTokenAsync();
  const decodedToken: any = jwt.decode(token, { complete: true }) as unknown;

  if (Date.now() >= decodedToken.payload.exp * 1000) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }

  if (axiosBaseConfig?.headers) {
    axiosBaseConfig.headers["Authorization"] = `Bearer ${token}`;
    // Needed for binary data
    if (config?.responseType === "blob" || config?.responseType === "arraybuffer") {
      axiosBaseConfig.headers["Accept"] = config.contentType;
    }
  }

  const axiosReqConfig = { ...axiosBaseConfig, ...config };
  try {
    switch (method) {
      case "get":
      case "GET":
        return (await axios.get<T>(`${baseUrl}${endpoint}`, axiosReqConfig)).data;
      case "put":
      case "PUT":
        return (await axios.put<T>(`${baseUrl}${endpoint}`, config?.data, axiosReqConfig)).data;
      case "post":
      case "POST":
        return (await axios.post<T>(`${baseUrl}${endpoint}`, config?.data, axiosReqConfig)).data;
      case "patch":
      case "PATCH":
        return (await axios.patch<T>(`${baseUrl}${endpoint}`, config?.data, axiosReqConfig)).data;
      case "delete":
      case "DELETE":
        return (await axios.delete<T>(`${baseUrl}${endpoint}`, axiosReqConfig)).data;
      default:
        throw new Error(`Not an implemented type: ${method}`);
    }
  } catch (err) {
    if (err) {
      // The axios request was made and the server responded with a status code that falls out of the range of 2xx
      // throw new Error(err?.response.data.message ?? err.response.data); // If service call returns with an object, get the message attribute else just the regular axios data attibute
    } else {
      // throw new Error(err.message); // Not an axios http error
    }
  }
};
