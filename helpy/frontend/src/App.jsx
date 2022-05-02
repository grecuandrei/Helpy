import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import NavBar from "./components/NavBar";
import AppRouter from "./components/AppRouter";
import Loading from "./components/Loading";

const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) return <Loading />;

  return (
    <div id="app" className="d-flex flex-column h-100">
      <AppRouter />
      <NavBar />
    </div>
  );
};

export default App;
