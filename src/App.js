import React from 'react';
import { ThemeProvider } from 'styled-components';
//^ através do ThemeProvider, ocorrerá a encapsulação 
import { Reset } from 'styled-reset';

import Home from './pages/Home';
import theme from './theme';

function App() {
  return (
     <ThemeProvider theme={theme}//A themes é uma variavel q recebe o valor de theme.js
     >
       <Reset />
       <Home />
     </ThemeProvider>
  );
}

export default App;
