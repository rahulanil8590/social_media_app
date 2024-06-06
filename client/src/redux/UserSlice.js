import {createSlice} from '@reduxjs/toolkit';
import {user} from '../Assets'
const INITIAL_STATE = {
    user :JSON.parse(window?.localStorage?.getItem("user")) ?? {},
    edit : false , 
    socialLink : false
}

const UserSlice = createSlice({
    name : "user",
    initialState: INITIAL_STATE,
    reducers :{
        login(state , action ){
            state.user = action?.payload;
            localStorage?.setItem("user", JSON.stringify(action?.payload))
        },
        logout(state ,action){
            state.user = null ;
            localStorage.removeItem("user")
        },
        UpdateProfile(state ,action){
            state.edit = action.payload
        },
        SocialMediaLink(state , action){
            state.socialLink = action.payload
        }

    }

})

export default UserSlice.reducer


 export const login = (user) =>{
    return (dispatch , getItem) =>{
        dispatch(UserSlice.actions.login(user))
    }
}
export const logout = () =>{
    return (dispatch , getItem) =>{
        dispatch(UserSlice.actions.logout())
    }
}
export const UpdateProfile = (val) =>{
    return (dispatch , getItem) =>{
        dispatch(UserSlice.actions.UpdateProfile(val))
    }
}
export const SocialMediaLink = (val) =>{
    return (dispatch , getItem) =>{
        dispatch(UserSlice.actions.SocialMediaLink(val))
    }
}