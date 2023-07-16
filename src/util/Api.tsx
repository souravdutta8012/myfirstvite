import { invokeAxios } from "./Axios";

export async function getPicture(body: any): Promise<any> {
    return await invokeAxios(`get-picture`, "POST", {
        data: body,
    });
}

export async function getLocation(): Promise<any> {
    return await invokeAxios(`location/fetch`, "GET");
}
