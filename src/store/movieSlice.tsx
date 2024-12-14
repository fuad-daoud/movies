import {createSlice} from "@reduxjs/toolkit";

interface MoviesType {
    movies: MovieType[]
}

export interface MovieType {
    id: number
    name: string
}

const initState:MoviesType = {
    movies: []
}
const movieSlice = createSlice({
    name: "movies",
    initialState: initState,
    reducers: {
        addMovie: (state, action) => {
            if(state.movies.length == 0) {
                const newMovie = {
                    id: 21,
                    name: action.payload
                }
                state.movies.push(newMovie)
                return
            }
            const newMovie = {
                id: state.movies[state.movies.length - 1].id + 20,
                name: action.payload
            }
            state.movies.push(newMovie)
        },

        removeMovie: (state, action) => {
            state.movies = state.movies.filter((movie) => movie.id !== action.payload)
        },
        clearMovies: (state, action) => {
            state.movies = [];
        }
    },
})

export const { addMovie, removeMovie, clearMovies } = movieSlice.actions

export default movieSlice.reducer