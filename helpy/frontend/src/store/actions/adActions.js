import {  
    CREATE_AD,  
    RETRIEVE_ADS,  
    UPDATE_AD,  
    DELETE_AD,  
    DELETE_ALL_ADS, LIKE_AD, VIEW_AD  
  } from './types';  
  
import AdDataService from "../../services/adService";

export const createAd = (formData) => async (dispatch) => {
  try {
    const res = await AdDataService.create(formData);

    dispatch({
      type: CREATE_AD,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const retrieveAds = () => async (dispatch) => {
  try {
    const res = await AdDataService.getAll();

    dispatch({
      type: RETRIEVE_ADS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateAd =
  ({ id, data }) =>
  async (dispatch) => {
    try {
      const res = await AdDataService.update({ id, data });

      dispatch({
        type: UPDATE_AD,
        payload: data,
      });

      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject(err);
    }
  };

export const deleteAd =
  ({ id, token }) =>
  async (dispatch) => {
    try {
      await AdDataService.delete({ id, token });

      dispatch({
        type: DELETE_AD,
        payload: { id },
      });
    } catch (err) {
      console.log(err);
    }
  };

export const deleteAllAds = (token) => async (dispatch) => {
  try {
    const res = await AdDataService.deleteAll(token);

    dispatch({
      type: DELETE_ALL_ADS,
      payload: res.data,
    });

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const findAdsByTitle = (title) => async (dispatch) => {
  try {
    const res = await AdDataService.findByTitle(title);

    dispatch({
      type: RETRIEVE_ADS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const likeAd = (data) => async (dispatch) => {
  try {
    const res = await AdDataService.like(data);

    dispatch({
      type: LIKE_AD,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};