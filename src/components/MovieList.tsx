import {useDispatch, useSelector} from "react-redux";
import {MovieType, removeMovie} from "../store/movieSlice.tsx";
import {Collapse, IconButton, List, ListItem, ListItemText} from "@mui/material";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {TransitionGroup} from 'react-transition-group';
import {Suspense} from "react";


function render({movie, handleRemoveMovie}: { movie: MovieType, handleRemoveMovie: (id: number) => void }) {
    return (<ListItem
        key={movie.id}
        disableGutters
        secondaryAction={
            <IconButton onClick={() => handleRemoveMovie(movie.id)}>
                <DeleteRoundedIcon/>
            </IconButton>
        }
    >
        <ListItemText primary={movie.name}/>
    </ListItem>)
}

function Loading() {
    return <h2>🌀 Loading...</h2>;
}

export function MovieList() {
    const movies = useSelector((state) => state.movies.movies)
    const dispatch = useDispatch()
    const handleRemoveMovie = (id: number) => {
        dispatch((removeMovie(id)))
    }
    return (
        <Suspense fallback={<Loading/>}>
            <List sx={{
                width: '100%', overflow: 'auto',
                maxHeight: 700,
            }}>
                <TransitionGroup>
                    {movies.map((movie: MovieType) => (
                        <Collapse key={movie.id}>{render({movie, handleRemoveMovie})}</Collapse>
                    ))}
                </TransitionGroup>
            </List>
        </Suspense>
    )

}
