import * as jwt from "jsonwebtoken";
import * as msal from "@azure/msal-browser";
import { acquireTokenDetails } from "./auth-msal";

export const getAdUser = async (): Promise<any | undefined> => {
  const response = await acquireTokenDetails();

  if (response === undefined) return undefined;

  const graphOutput: GraphOutput = {
    displayName: "",
    givenName: "",
    surname: "",
    mail: "",
  };
  if (response.account !== undefined) {
    fillGraphOutput(
      graphOutput,
      response.account as NamePayload
    );
  }
  if (response.idTokenClaims !== undefined) {
    fillGraphOutput(
      graphOutput,
      response.idTokenClaims as NamePayload
    );
  }
  if (response.accessToken !== undefined) {
    const accessToken = jwt.decode(response.accessToken, { complete: true });
    fillGraphOutput(
      graphOutput,
      accessToken?.payload as NamePayload
    );
  }
  if (response.idToken !== undefined) {
    const accessToken = jwt.decode(response.idToken, { complete: true });
    fillGraphOutput(
      graphOutput,
      accessToken?.payload as NamePayload
    );
  }
  nameHelper(graphOutput);
  return getAuthenticatedUser(
    graphOutput,
    response
  );
};

const fillGraphOutput = (
  user: GraphOutput,
  payload: NamePayload
): void => {
  if (payload !== undefined) {
    user.displayName = fieldHelper(payload.name, user.displayName);
    user.givenName = fieldHelper(payload.given_name, user.givenName);
    user.surname = fieldHelper(payload.family_name, user.surname);
    user.mail = fieldHelper(payload.username, user.mail, true);
    user.mail = fieldHelper(payload.mail, user.mail, true);
    user.mail = fieldHelper(payload.email, user.mail, true);
    user.mail = fieldHelper(payload.upn, user.mail, true);
  }
};

const toLowerCase = (value: string, lowerCase: boolean): string => {
  if (lowerCase) return value.toLowerCase().trim();
  return value.trim();
};

const fieldHelper = (
  field: string | undefined,
  existingValue: string,
  lowerCase = false
): string => {
  if (existingValue) return existingValue;
  if (field) return toLowerCase(field, lowerCase);
  return "";
};

const NameMappings = [
  { regexp: "([^,]*),([^(]*)", givenName: 2, surname: 1 }, // "Last, First (Optional Org)"
  { regexp: "([^\\s]*)\\s([^(]*)", givenName: 1, surname: 2 }, // "First Last (Optional Org)"
];

const nameHelper = (user: GraphOutput): void => {
  for (let i = 0; i < NameMappings.length && user.displayName; i++) {
    const mapping = NameMappings[i];
    let match = user.displayName.match(mapping.regexp);
    if (match !== undefined && match !== null) {
      user.givenName = fieldHelper(match![mapping.givenName], user.givenName);
      user.surname = fieldHelper(match![mapping.surname], user.surname);
    }
  }
};

interface GraphOutput {
  displayName: string;
  givenName: string;
  mail: string;
  surname: string;
}

interface IdTokenClaims {
  roles?: string[];
}

interface NamePayload {
  given_name?: string;
  family_name?: string;
  name?: string;
  username?: string;
  upn?: string;
  mail?: string;
  email?: string;
}

const getFriendlyName = (displayName: string, component: string) => {
  let result = component;
  try {
    const match = displayName.match(new RegExp(component, "gi"));
    if (match) {
      result = match[0];
    }
  } catch (e) {
    // swallow this and return the default result;
  }
  return result;
};

const getAuthenticatedUser = (
  graphOutput: GraphOutput,
  authenticationResult: msal.AuthenticationResult
): any => {
  const roles: string[] = [];
  const firstName = graphOutput.givenName;
  const lastName = graphOutput.surname;
  const displayName = graphOutput.displayName;
  const email = graphOutput.mail;

  if ("idTokenClaims" in authenticationResult && "roles" in authenticationResult.idTokenClaims) {
    roles.push(
      ...((authenticationResult.idTokenClaims as IdTokenClaims).roles ?? [])
    );
  }

  let friendlyFirstName = getFriendlyName(displayName, firstName);
  let friendlyLastName = getFriendlyName(displayName, lastName);

  return {
    firstname: friendlyFirstName,
    lastname: friendlyLastName,
    email: email ? email?.toLowerCase() : '',
    sessionExpiration: authenticationResult.expiresOn || new Date(0),
    roles,
    token: authenticationResult.idToken,
  };
};
