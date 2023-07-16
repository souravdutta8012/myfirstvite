import * as msal from "@azure/msal-browser";
import { loginRequest, msalConfig } from "./auth-config";
import { setGlobalCrypto } from "../tests/test.crypto";

class MSALInstance {
  private static instance: msal.PublicClientApplication;
  private constructor() { }
  private static createInstance() {
    const msalInstance = new msal.PublicClientApplication(msalConfig());
    msalInstance.addEventCallback((event) => {
      if (event.eventType !== msal.EventType.LOGIN_SUCCESS) return;
      const authenticationResult = event.payload as msal.AuthenticationResult;
      if (authenticationResult.account !== undefined) {
        const account = authenticationResult.account;
        msalInstance.setActiveAccount(account);
      }
    });
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
    }
    return msalInstance;
  }

  public static getInstance() {
    if (!MSALInstance.instance) {
      MSALInstance.instance = MSALInstance.createInstance();
    }
    return MSALInstance.instance;
  }
}

if (!("crypto" in window)) {
  setGlobalCrypto();
}

export const msalInstance = (): msal.PublicClientApplication => {
  return MSALInstance.getInstance();
};

export const acquireTokenDetails = async (): Promise<
  msal.AuthenticationResult | undefined
> => {
  const request = loginRequest();
  const context = MSALInstance.getInstance();
  const cachedUser = context.getActiveAccount();
  if (cachedUser) {
    const response = await context.acquireTokenSilent({
      ...request,
      account: cachedUser,
    });

    return response;
  }
  return undefined;
};

export const acquireTokenAsync = async (): Promise<string | undefined> => {
  const response = await acquireTokenDetails();
  if (response === undefined) return undefined;
  return response.idToken;
};
