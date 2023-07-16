import { AccountInfo, Configuration, IPublicClientApplication, ProtocolMode, SilentRequest } from "@azure/msal-browser";

const tenantId = "a3299bba-ade6-4965-b011-bada8d1d9558";
const clientId = import.meta.env.VITE_AAD_CLIENTID || "cd7fccfa-00f3-46d5-87fd-588b50c12637";
const authority = `https://login.microsoftonline.com/${tenantId}`;
export const MSAL_SCOPES = ["offline_access", "profile", "openid", "email"];

const hostname = window.location.hostname;

export const loginRequest = (): SilentRequest => {
  if (hostname === "localhost") {
    return {
      scopes: MSAL_SCOPES,
      authority,
    };
  } else {
    return {
      scopes: MSAL_SCOPES,
      authority: `https://${hostname}`,
    };
  }
};

export const msalConfig = (): Configuration => {
  if (hostname === "localhost") {
    return {
      auth: {
        clientId,
        postLogoutRedirectUri: window.location.origin,
        navigateToLoginRequestUrl: true,
        redirectUri: window.location.origin,
        authority: `https://login.microsoftonline.com/${tenantId}`,
      },
      cache: {
        cacheLocation: "localStorage",
      },
    };
  } else {
    return {
      auth: {
        clientId,
        postLogoutRedirectUri: window.location.origin,
        navigateToLoginRequestUrl: true,
        authority: `https://${hostname}`,
        knownAuthorities: [`https://${hostname}`],
        protocolMode: ProtocolMode.OIDC,
        redirectUri: `https://${hostname}`,
      },
      cache: {
        cacheLocation: "localStorage",
      },
    };
  }
};

export async function RequestToken(instance: IPublicClientApplication, account: AccountInfo) {
  if (account) {
    try {
      const res = await instance.acquireTokenSilent({
        ...loginRequest(),
        account: account,
      });
      return res.accessToken;
    } catch (e) {
      await instance.loginRedirect();
    }
  }
  return "";
}