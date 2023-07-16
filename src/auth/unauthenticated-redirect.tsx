import React, { useEffect } from "react";

import { InteractionType } from "@azure/msal-browser";
import { MSAL_SCOPES } from "./auth-config";
import { useMsalAuthentication } from "@azure/msal-react";

export const UnAuthenticatedRedirect = () => {
  const { login, error } = useMsalAuthentication(InteractionType.Redirect, { scopes: MSAL_SCOPES });
  useEffect(() => {
    if (error) {
      login(InteractionType.Redirect, { scopes: MSAL_SCOPES });
    }
  }, [error, login]);
  return <React.Fragment />;
};
