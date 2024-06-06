import { configureStore } from "@reduxjs/toolkit";

import { rootReducer } from "./reducer"
const Store = configureStore({
    reducer: rootReducer
})

const { dispatch } = Store

export {
    dispatch,
    Store
}