

import {configureStore} from "@reduxjs/toolkit";
import movieReducer from "./movieSlice.tsx"



export const store = configureStore({
    reducer: {
        movies: movieReducer
    },
    devTools: window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']()
})