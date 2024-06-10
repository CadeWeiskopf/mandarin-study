import "./App.css";
import { Home } from "./pages/home/Home";
import { FlashCardDeck } from "./components/flashcard/FlashCardDeck";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/set/:setId"
            element={<FlashCardDeck />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const app = () => (
  <AppContextProvider>
    <App />
  </AppContextProvider>
);
export default app;
