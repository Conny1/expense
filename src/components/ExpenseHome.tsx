import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import ExpensesPage from "@/pages/ExpensesPage";
import { store, type AppDispatch, type RootState } from "@/redux/store";
import { loadTokensFromDB, updateTokenData } from "@/redux/token";

type Props = {
  baseurl: string;
  tokens: { access_token: string; refresh_token: string; _id: string } | null;
};

const Home = ({ baseurl, tokens }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loaded } = useSelector((state: RootState) => state.token);

  useEffect(() => {
    if (tokens && !loaded) {
      dispatch(updateTokenData(tokens));
      dispatch(loadTokensFromDB());
    }
  }, [loaded, dispatch, tokens]);

  if (!tokens) return <div><p>Loading...</p></div>;
  if (!loaded) return <div><p>Loading...</p></div>;

  return (
    <div className="w-full">
      <Toaster position="top-right" richColors />
      <BrowserRouter basename={baseurl}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<ExpensesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </div>
  );
};

export default function ExpenseHome(props: Props) {
  return <Provider store={store}><Home {...props} /></Provider>;
}
