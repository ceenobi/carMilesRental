import { RouterProvider } from "react-router/dom";
import { router } from "./routes";
import ToastProvider from "./components/context/toastProvider";

function App() {
  return (
    <>
      <ToastProvider />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
