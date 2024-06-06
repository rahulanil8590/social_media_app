import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    theme: JSON.parse(window?.localStorage.getItem("theme" )) ?? "dark"
}


const themeSlice = createSlice({
    name : "theme",
    initialState: INITIAL_STATE,
    reducers :{
        setTheme(state , action){
            state.theme =action.payload;
            localStorage.setItem("theme", JSON.stringify(action.payload))
        }
    }
})

export default themeSlice.reducer

export const SetTheme = (value) =>{
    return (dispatch) =>{
        dispatch(themeSlice.actions.setTheme(value))
    }
}