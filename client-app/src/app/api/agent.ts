import axios, { AxiosResponse } from 'axios'
import { Activity } from '../models/activity';

axios.defaults.baseURL = "https://localhost:5001/api";

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const request = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const sleep = (delay: number) => {
    return new Promise((e) => {
        setTimeout(e, delay);
    })
}

axios.interceptors.response.use(
    async response => {
        try {
            await sleep(1000);
            return response;
        } catch (error) {
            console.log(error);
            return await Promise.reject(error);
        }
    }
)

const Activities = {
    list: () => request.get<Activity[]>('/activities'),
    details: (id:string) => axios.get<void>(`/activities/${id}`),
    create: (activity:Activity) => axios.post<void>('/activities/',activity),
    update: (activity:Activity) => axios.put<void>(`/activities/${activity.id}`,activity),
    delete: (id:string) => request.del<void>(`/activities/${id}`),
}

const agent = {
    Activities
}

export default agent;