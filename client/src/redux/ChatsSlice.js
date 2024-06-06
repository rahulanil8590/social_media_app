import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
   chat: JSON.parse(window?.localStorage?.getItem("chat")) ?? []
}
const ChatSlice = createSlice({
    name : "chat",
    initialState: INITIAL_STATE,
    reducers :{
            getChat(state ,action){
                state.chat =action.payload
                localStorage?.setItem("chat", JSON.stringify(action?.payload))
            }
    }

})
export default ChatSlice.reducer

export  const SetChat = (val)=>{
    return (dispatch , getState) =>{
        dispatch(ChatSlice.actions.getChat(val))
    }
}