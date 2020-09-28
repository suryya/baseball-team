/*
* Context API has been used to store the data of the members 
* position and the combination there of which represents the team
*  
* The data is stored in local-storage , but the local storage 
* APis has been wrapped into promises to ensure that these 
* read and write operations are compatible to other async storage 
* mediums which can be plugged in later as an enhancment without much 
* change in the code.
*/

import React , {useEffect, useCallback, useRef} from 'react'
import {readFromStore, saveStateToLocalStorate, 
        writeMiddleware, readMiddleware} from '../../utils/localStoreUtils'
import ACTIONS from './actionTypes';
const {CREATE_TEAM, ADD_MEMBER, DATA_READY} = ACTIONS;

const CountStateContext = React.createContext()
const CountDispatchContext = React.createContext()

//5 options for position
const positionOptions = [
  'point guard (PG)',
  'shooting guard (SG)',
  'power forward (PF)',
  'small forward (SF)',
  'the center (C)'
];


//for reading from context
function useTeamState() {
  const context = React.useContext(CountStateContext)
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider')
  }
  return context
}

//for writing to context 
function useTeamDispatch() {
  const context = React.useContext(CountDispatchContext)
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider')
  }
  return context
}

//base reducer which updates state with the paylaod
// the main business logic has been shifted to a middleware 
// for supporing async ooperations prior to state write / update
function baseballReducer(state, {type,payload}) {
  switch (type) {
    default: {
      return {...state,...payload}
    }
  }
}

//the root provider component with the context of baseball team 
//this will be used to wrap around all the baseball related components
//to ensure all those child components can read and write from the store
function BaseballProvider({children}) {

  //empty store structure
  const initData =  useRef({members: [],team:[],positionOptions})
  const [state, dispatch] = React.useReducer(baseballReducer,initData.current)

  //fetches the data stored in local storage 
  useEffect( () => {
    const fetchedStoredData = async function(init){
      let fetchedData = await readMiddleware(readFromStore)(init)
      dispatch({
        type: DATA_READY,
        payload: fetchedData
      });
    }
    fetchedStoredData(initData.current)
  }, [initData]);

  //middleware which contains the business logic to recreate the state based on the 
  //action type , action paylaod and the previous state
  const dispatchMiddleware = useCallback((dispatch) => {
    return  (action) => {
      let newState;
      switch (action.type) {
        case ADD_MEMBER:
          let matched = state.members.filter((mem) => (`${mem.fname}${mem.lname}`).toLowerCase() === 
                                                       (`${action.payload.fname}${action.payload.lname}`).toLowerCase() )
          if(matched && matched.length){
            newState =  {...state}
          }
          newState = {...state,...{members: [...state.members,...[action.payload]]}}
           writeMiddleware(saveStateToLocalStorate)(newState).then(()=>{
            dispatch({type:action.type,payload:newState})
           },(e)=>console.log('Failed writing to store'))
          break;
        case CREATE_TEAM:
           newState = {...state,...{team:action.payload}}
           writeMiddleware(saveStateToLocalStorate)(newState).then(()=>{
              dispatch({type:action.type,payload:newState})
           },(e)=>console.log('Failed reading from store'))
          break;
        default:
          throw new Error(`Unhandled action type: ${action.type}`)
      }
    };      
  },[state])
  

  return (
    <CountStateContext.Provider value={state}>
      <CountDispatchContext.Provider value={dispatchMiddleware(dispatch)}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  )
}


export {BaseballProvider, useTeamState, useTeamDispatch }
