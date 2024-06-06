import {combineReducers} from "@reduxjs/toolkit"
import UserSlice from  "./UserSlice";
import themeSlice from "./themeSlice"
import PostSlice from "./PostSlice"
import ChatSlice from "./ChatsSlice";


const rootReducer = combineReducers({
    user: UserSlice,
    theme:themeSlice,
    posts: PostSlice,
    chat: ChatSlice
})

export { rootReducer }