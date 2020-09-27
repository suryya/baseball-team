import React from 'react';
import {BaseBallTeam} from './pages'
import { Helmet } from "react-helmet";
import AppTheme from './theme';


function App() {
  return (
    <AppTheme>
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
    </AppTheme>
  );
}

export default App;
