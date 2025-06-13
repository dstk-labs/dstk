import { AppProvider } from './Provider';
import { AppRouter } from './Router';

export const App = () => (
  <AppProvider>
    <AppRouter />
  </AppProvider>
);
