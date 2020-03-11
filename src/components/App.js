import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import GlobalStyles from './GlobalStyles';
import Home from './Home';
import Game from './Game';
import useInterval from '../hooks/use-interval.hook';


import {GameContext} from './GameContext';
// import items from './Data'


// const usePersistedState = (defaultValue, key) => {
//     const [state, setState] = React.useState(
//     () => JSON.parse(localStorage.getItem(key)) || defaultValue);

//     React.useEffect(() => {
//       localStorage.setItem(key, JSON.stringify(state));
//     }, [key, state]);
//     return [state, setState];
//   };

function App(props) {
  // const [numCookies, setNumCookies] = usePersistedState(1000, "num-cookies");
  // const [purchasedItems, setPurchasedItems] = usePersistedState({
  //   cursor: 0,
  //   grandma: 0,
  //   farm: 0
  // }, "purchased-items");

  // //COOKIES PER SECOND
  // const calculateCookiesPerSecond = purchasedItems => {
  //   return Object.keys(purchasedItems).reduce((acc, itemId) => {
  //     const numOwned = purchasedItems[itemId];
  //     const item = items.find(item => item.id === itemId);
  //     const value = item.value;
  
  //     return acc + value * numOwned;
  //   }, 0);
  // };

  const {numCookies, setNumCookies, purchasedItems, 
    calculateCookiesPerSecond} = React.useContext(GameContext);

  useInterval(() => {
    const numOfGeneratedCookies = calculateCookiesPerSecond(purchasedItems);
    setNumCookies(numCookies + numOfGeneratedCookies);
  }, 1000);

  return (<>
  
      <GlobalStyles />
      <Router>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/game">
          <Game />
        </Route>
      </Router>

  </>);
}

export default App;
