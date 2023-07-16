import { APP_ROLE } from "./Constant";

export const isAdmin = (auth: any) => {
    if (auth?.roles?.includes(APP_ROLE.ADMIN)) {
        return true;
    } else {
        return false;
    }
}
