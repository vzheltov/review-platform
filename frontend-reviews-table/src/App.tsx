import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TableContainer from "./components/TableContainer";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const originalTitle = document.title;

    const handleVisibilityChange = () => {
      let link = document.getElementById("app-favicon") as HTMLLinkElement;

      if (!link) {
        link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      }

      if (document.hidden) {
        link.href = "favicon-inactive.png";
        document.title = "Вернись, мы скучаем! 😭";
      } else {
        link.href = "favicon.png";
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-gray-900 font-sans text-white">
        <TableContainer />
      </main>
    </QueryClientProvider>
  );
};

export default App;
