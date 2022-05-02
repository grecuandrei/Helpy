import React from "react";

import { ReactComponent as ReactIcon } from "../assets/images/react.svg";
import { ReactComponent as ExpressIcon } from "../assets/images/express.svg";
import { ReactComponent as MongoDdIcon } from "../assets/images/mongodb.svg";
import { ReactComponent as NodeJsIcon } from "../assets/images/nodejs.svg";
import { ReactComponent as Auth0Icon } from "../assets/images/auth0.svg";

const Home = () => (
  <>
    <div className="text-center hero">
      <ReactIcon className="homeIcon" />
      <ExpressIcon className="homeIcon" />
      <MongoDdIcon className="homeIcon" />
      <NodeJsIcon className="homeIcon" />
      <Auth0Icon className="homeIcon" />
      <h1 className="mb-4">
        Fullstack MERN Application with Auth0 Identity Platform
      </h1>
      <h1 className="mb-4">🚀</h1>
    </div>
  </>
);

export default Home;
