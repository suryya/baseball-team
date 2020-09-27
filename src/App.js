import React from 'react';
//import logo from './logo.svg';
import {BaseBallTeam} from './pages'
import { Helmet } from "react-helmet";
function App() {
  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Baseball Team App</title>
        <link rel="canonical" href="https://reactjs.org/" />
      </Helmet>
      <header className="App-header">
      </header>
      <main>
        <BaseBallTeam/>
      </main>
    </div>
  );
}

export default App;
