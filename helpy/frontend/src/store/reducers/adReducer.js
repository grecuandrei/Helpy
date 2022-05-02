import {  
    CREATE_AD,  
    RETRIEVE_ADS,  
    UPDATE_AD,  
    DELETE_AD,  
    DELETE_ALL_ADS,  
    LIKE_AD,  
} from "../actions/types";  

const initialState = [];  

function adReducer(ads = initialState, action) {  
    const { type, payload } = action;  

    switch (type) {  
        case CREATE_AD:  
            return [...ads, payload];  

        case RETRIEVE_ADS:  
            return payload;  

        case UPDATE_AD:  
            return ads.map((ad) => {  
                if (ad.id === payload.id) {  
                    return {  
                    ...ad,  
                    ...payload,  
                    };  
                }  
                return ad;  
            });  

        case DELETE_AD:  
            return ads.filter(({ id }) => id !== payload.id);  

        case DELETE_ALL_ADS:  
            return [];  

        case LIKE_AD:  
            return ads.map((ad) =>  
                ad.id === action.payload.id ? action.payload : ad  
            );  

        default:  
            return ads;  
    }  
}  

export default adReducer;