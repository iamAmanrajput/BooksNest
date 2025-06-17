import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/provider/theme-provider";

createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
