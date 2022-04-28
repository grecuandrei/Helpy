import {  
    CREATE_AD,  
    RETRIEVE_ADS,  
    UPDATE_AD,  
    DELETE_AD,  
    DELETE_ALL_ADS, LIKE_AD,  
  } from './types';  
  
  import AdDataService from '../../services/adService';  
  
  export const createAd =  (data) => async (dispatch) => {};  
  
  export const retrieveAds = () => async (dispatch) => {};  
  
  export const updateAd = ({id, data}) => async (dispatch) => {};  
  
  export const deleteAd = ({id, token}) => async (dispatch) => {};  
  
  export const deleteAllAds = (token) => async (dispatch) => {};  
  
  export const findAdsByTitle = (title) => async (dispatch) => {};  
  
  export const likeAd = (data) => async (dispatch) => {};