import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { updateTokenData, clearToken } from "./token";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL || "http://localhost:4000",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).token.value.access_token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.token.value.refresh_token;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        { url: "/admin/auth/refresh-token", method: "POST", body: { refresh_token: refreshToken } },
        api,
        extraOptions,
      );

      const resp = refreshResult.data as {
        status?: number;
        data?: { access_token: string; refresh_token: string; _id: string };
      };

      if (resp && resp.data) {
        const { access_token, refresh_token, _id } = resp.data;
        api.dispatch(updateTokenData({ access_token, refresh_token, _id }));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearToken());
      }
    }
  }

  return result;
};
