import React from "react";
import { getAdUser } from "../auth/auth-msal-user";
type Action = { type: "setUserAuth"; payload: { auth: any } };
type Dispatch = (action: Action) => void;
type Props = { children: React.ReactNode };

export type State = {
    auth: any;
};

export const UserStateContext = React.createContext<State | undefined>(
    undefined
);

export const UserDispatchContext = React.createContext<Dispatch | undefined>(
    undefined
);

export const userReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "setUserAuth": {
            const auth = { ...action.payload.auth };

            return {
                ...state,
                auth,
            };
        }
    }
};

export const UserProvider = ({ children }: Props) => {
    const [state, dispatch] = React.useReducer(userReducer, {
        ...initialUserState,
    });

    React.useEffect(() => {
        async function getUser() {
            const auth = await getAdUser();
            if (auth === undefined) return;
            dispatch({ type: "setUserAuth", payload: { auth: auth } });
        }
        getUser();
    }, []);

    return (
        <UserStateContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
};

export const useUserDispatch = () => {
    const context = React.useContext(UserDispatchContext);
    if (context === undefined) {
        throw new Error("useUserDispatch must be used within a UserProvider");
    }
    return context;
};

export const useUserState = () => {
    const context = React.useContext(UserStateContext);
    if (context === undefined) {
        throw new Error("useUserState must be used within a UserProvider");
    }
    return context;
};

const initialUserState: State = {
    auth: {
        firstname: "",
        lastname: "",
        email: "",
        roles: [],
        sessionExpiration: new Date(),
        token: null,
    },
};
