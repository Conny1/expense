import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { openDB } from "idb";

const DB_NAME = import.meta.env.VITE_DB_NAME || "modulor_db";
const STORE_NAME = import.meta.env.VITE_STORE_NAME || "modulor_store";

type TokenData = {
  _id: string | null;
  access_token: string | null;
  refresh_token: string | null;
};

type TokenState = {
  value: TokenData;
  loaded: boolean;
};

let dbInstance: Awaited<ReturnType<typeof openDB>> | null = null;

const initDB = async () => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });

  return dbInstance;
};

const saveTokenToDB = async (key: string, value: string) => {
  const db = await initDB();
  await db.put(STORE_NAME, value, key);
};

const getTokenFromDB = async (key: string): Promise<string | null> => {
  const db = await initDB();
  return (await db.get(STORE_NAME, key)) || null;
};

const clearTokensFromDB = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};

export const loadTokensFromDB = createAsyncThunk<TokenData>("token/loadFromDB", async () => {
  const access_token = await getTokenFromDB("access_token");
  const refresh_token = await getTokenFromDB("refresh_token");
  const _id = await getTokenFromDB("_id");
  return { access_token, refresh_token, _id };
});

const initialState: TokenState = {
  value: { _id: null, access_token: null, refresh_token: null },
  loaded: false,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    updateTokenData: (state, action: PayloadAction<TokenData>) => {
      const { access_token, refresh_token, _id } = action.payload;
      if (access_token) saveTokenToDB("access_token", access_token);
      if (refresh_token) saveTokenToDB("refresh_token", refresh_token);
      if (_id) saveTokenToDB("_id", _id);
      state.value = { access_token, refresh_token, _id };
    },
    clearToken: (state) => {
      clearTokensFromDB();
      state.value = { _id: null, access_token: null, refresh_token: null };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTokensFromDB.fulfilled, (state, action) => {
      state.value = action.payload;
      state.loaded = true;
    });
  },
});

export const { updateTokenData, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
