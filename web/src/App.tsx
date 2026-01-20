import { AppProvider } from "./Provider";
import { AppRouter } from "./Router";

export function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
