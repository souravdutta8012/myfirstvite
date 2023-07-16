import crypto from "crypto";

export const setGlobalCrypto = () => {
  Object.defineProperty(window, "crypto", {
    value: {
      getRandomValues: (arr: any) => {
        return crypto.randomBytes(arr?.byteLength ?? 0);
      },
    },
  });
};
