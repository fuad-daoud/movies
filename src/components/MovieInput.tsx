import {useState} from "react";
import {addAllMovies, addMovie, clearMovies} from "../store/movieSlice.tsx";
import {useDispatch, useSelector} from "react-redux";
import {Alert, IconButton, Input, CircularProgress} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';

export function MovieInput() {
    const [state, setState] = useState<MovieInputState>({
        newMovie: "",
        alert: false,
        alertText: "",
        level: undefined,
        loading: false,
    })
    const isEmpty = useSelector(state => state.movies.movies.length == 0)

    const dispatch = useDispatch()

    const handleAddMovie = () => {
        if (!state.newMovie) {
            setState(
                {
                    ...state,
                    alert: true,
                    alertText: "You are trying to add an empty movie",
                    level: "warning",
                })
            return;
        }

        dispatch(addMovie(state.newMovie))
        setState({
            ...state,
            newMovie: "",
            alert: false,
            alertText: "",
            level: undefined,
        })
    }
    const handleClear = () => {
        if (isEmpty) {
            setState({
                ...state,
                alert: true,
                alertText: "You are trying to clear but there is no movies",
                level: "warning",
            })
            return;
        }
        dispatch(clearMovies({}))
    }
    const handleDownload = async () => {
        setState({
            ...state,
            loading: true
        });
        try {
            const response = await fetch("/movies")
            if (response.status != 200) {
                setState({
                    ...state,
                    alert: true,
                    alertText: "Something went wrong fetching data",
                    level: "error",
                    loading: false,
                });
                return
            }
            const data = await response.json();
            dispatch(addAllMovies(data));
            setState({
                ...state,
                loading: false,
            });
        } catch (error) {
            console.error(error)
            setState({
                ...state,
                level: "error",
                alertText: "Something went wrong fetching data",
                alert: true,
                loading: false,
            });
        }

    }
    const handleOnChange = (event: { target: { value: string }; }) => {
        setState({
            ...state,
            newMovie: event.target.value
        })
    }


    return (
        <>
            <Input disabled={state.alert} placeholder="My Favorite Movie" onChange={handleOnChange} value={state.newMovie}/>
            <IconButton disabled={state.alert} color="primary" sx={{p: '10px'}} aria-label="directions"
                        onClick={handleAddMovie}>
                <AddIcon/>
            </IconButton>
            <IconButton disabled={state.alert} color="primary" sx={{p: '10px'}} aria-label="directions" onClick={handleClear}>
                <ClearIcon/>
            </IconButton>
            <IconButton disabled={state.alert || state.loading} color="primary" sx={{p: '10px'}} aria-label="directions"
                        onClick={handleDownload}>
                {state.loading ? <CircularProgress size={24} /> : <DownloadIcon />}
            </IconButton>

            <Collapse in={state.alert}>
                <Alert
                    severity={state.level}
                    variant="filled"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setState({
                                    ...state,
                                    alert: false
                                })
                            }}
                        >
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                    }
                    sx={{mb: 2}}
                >{state.alertText}</Alert>
            </Collapse>
        </>
    )
}

interface MovieInputState {
    newMovie: string,
    alert: boolean,
    alertText: string,
    level: "success" | "info" | "warning" | "error" | undefined,
    loading: boolean,
}