import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import useInterval from '../hooks/use-interval.hook';
import useKeydown from '../hooks/useKeydown';
import useDocumentTitle from '../hooks/useDocumentTitle';

import cookieSrc from '../cookie.svg';
import Item from './Item';
import items from './Data';
import {GameContext} from './GameContext';

//FUNCTION TO PERSIST DATA IN LOCAL STORAGE
const usePersistedState = (defaultValue, key) => {
  const [state, setState] = React.useState(
  () => JSON.parse(localStorage.getItem(key)) || defaultValue);
  
  React.useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};



const Game = () => {
  //CONTEXT
  const {
    numCookies, 
    setNumCookies, 
    purchasedItems, 
    setPurchasedItems, 
    clickValue,
    setClickValue, 
    calculateCookiesPerSecond
  } = React.useContext(GameContext);

//"COUNTS" COOKIES WHEN CLOSED
  let firstTime = (new Date()).getTime();
  const [time, setTime] = usePersistedState(firstTime, "last-date");
    React.useEffect(() => {
      let date = (new Date()).getTime();
      let diff = Math.abs(date - time);
      let cookieHaul = Math.floor(diff/1000)*(calculateCookiesPerSecond(purchasedItems)) + numCookies;
      setNumCookies(cookieHaul);
  // eslint-disable-next-line
  }, []);

///COOKIE UPDATE
  useInterval(() => {
    const numOfGeneratedCookies = calculateCookiesPerSecond(purchasedItems);
    setNumCookies(numCookies + numOfGeneratedCookies);
    let newTime = (new Date()).getTime();
    setTime(newTime);
}, 1000);

///INCREMENT FUNCTION
  const incrementCookies = () => {
    setNumCookies(c => c + clickValue);
  };

///TITLE
  useDocumentTitle(`${numCookies} cookies - Cookie Clicker Workshop`, 'Cookie Clicker Workshop')

///CLICK ON SPACEBAR
  useKeydown('Space', incrementCookies);
  
//ITEM PURCHASING
  const handleAttemptedPurchase = (item, cost) => {
    if (numCookies < cost) {
      alert('Cannot afford item');
      return;
    };
    setNumCookies(numCookies - cost);
    setPurchasedItems({
      ...purchasedItems,
      [item.id]: purchasedItems[item.id] + 1
    });
    if (item.type === 'active'){
      setClickValue(n => n + item.value)
    };
  }


  return (
    <Wrapper>
      <GameArea>
        <Indicator>
          <Total>{numCookies} cookies</Total>
          <p>
            <strong>{calculateCookiesPerSecond(purchasedItems)}</strong> cookies per second
          </p>
          <p>
            <strong>{clickValue}</strong> cookies per click
          </p>
        </Indicator>
        <Button onClick={incrementCookies}>
          <Cookie src={cookieSrc} />
        </Button>
      </GameArea>

      <ItemArea>
        <SectionTitle>Items:</SectionTitle>
        {items.map((item, index) => {
          return (
            <Item
              item={item}
              key={item.id}
              index={index}
              numOwned={purchasedItems[item.id]}
              handleAttemptedPurchase={handleAttemptedPurchase}
            />
          );
        })}
      </ItemArea>
      <HomeLink to="/">Return home</HomeLink>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;
const GameArea = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
`;
const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  transform-origin: center center;

  &:active {
    transform: scale(0.9);
  }
`;

const Cookie = styled.img`
  width: 200px;
`;

const ItemArea = styled.div`
  height: 100%;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SectionTitle = styled.h3`
  text-align: center;
  font-size: 32px;
  color: yellow;
`;

const Indicator = styled.div`
  position: absolute;
  width: 250px;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
`;

const Total = styled.h3`
  font-size: 28px;
  color: lime;
`;

const HomeLink = styled(Link)`
  position: absolute;
  top: 15px;
  left: 15px;
  color: #666;
`;

export default Game;
