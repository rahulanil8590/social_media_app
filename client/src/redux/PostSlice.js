import {createSlice} from '@reduxjs/toolkit';

const INITIAL_STATE = {
    posts: {}
}
const PostSlice = createSlice({
    name : "post",
    initialState: INITIAL_STATE,
    reducers :{
            getPost(state ,action){
                state.posts =action.payload
            }
    }

})
export default PostSlice.reducer

export  const Setpost = (val)=>{
    return (dispatch , getState) =>{
        dispatch(PostSlice.actions.getPost(val))
    }
}