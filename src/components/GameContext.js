import React from 'react';
import items from './Data';
// import useInterval from '../hooks/use-interval.hook'; 


export const GameContext = React.createContext(null);


//FUNCTION TO PERSIST DATA IN LOCAL STORAGE
const usePersistedState = (defaultValue, key) => {
    const [state, setState] = React.useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue);
    
    React.useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
};


//establishes all variables/funcs that would need to be passed down through app, then creates some global provider tags that pass these values
export const GameProvider = ({ children }) => {
    
    //PERSISTS/USESTATES OUR DATA TO LOCALSTORAGE
    const [numCookies, setNumCookies] = usePersistedState(1000, "num-cookies");
    const [purchasedItems, setPurchasedItems] = usePersistedState({
        cursor: 0,
        grandma: 0,
        farm: 0,
        double: 0
    }, "purchased-items");
    const [clickValue, setClickValue] = usePersistedState(1, "click-value");
    
    //COOKIES PER SECOND
    const calculateCookiesPerSecond = purchasedItems => {
        return Object.keys(purchasedItems).reduce((acc, itemId) => {
        const numOwned = purchasedItems[itemId];
        const item = items.find(item => item.id === itemId);
        if (item.type !== 'active'){
            const value = item.value;
            return acc + value * numOwned;
        } else {
            return acc
        }
        }, 0);
    };
    ////{children} is a special prop to allow for elements that will go between GameProvider tags
    //would be {props.children} if argument was GameProvider = (props)  =>
    //RETURNS CONTEXT TAGS (will go 'above' App)
    return (
        <GameContext.Provider value={{
            numCookies, 
            setNumCookies, 
            purchasedItems, 
            setPurchasedItems,
            clickValue,
            setClickValue,
            calculateCookiesPerSecond
        }}>
        {children} 
        </GameContext.Provider>
    );
};