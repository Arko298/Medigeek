import "../styles/globals.css";
import { AppProps } from "next/app";
import { ActiveButtonProvider } from '../components/Sidebar/context/activeBtnContext'; 
import { Provider } from "react-redux";
import store from "@/store";
import { StrictMode } from "react";
import { ToastContainer } from "react-toastify";


function MyApp({ Component, pageProps }: AppProps) {
  return(
    <StrictMode>
  <ActiveButtonProvider>
    <ToastContainer/>
    <Provider store={store}>
    <Component {...pageProps} />;
    </Provider>
  </ActiveButtonProvider>
  </StrictMode>
  );
}
export default MyApp;


