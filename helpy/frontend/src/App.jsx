import "./App.css";
import React from "react";
import Router from "./utils/Routing";
import "./styling/admin.tailwind.css";
import "./styling/user.tailwind.css";
import "./styling/global.tailwind.css";
import Wrapper from "./utils/AuthWrapper";
// App
const App = () => {
  return (
    <Wrapper>
      <Router />
    </Wrapper>
  );
};

export default App;
