import {Dispatch, SetStateAction, useState} from "react";
import {addMovie, clearMovies} from "../store/movieSlice.tsx";
import {useDispatch, useSelector} from "react-redux";
import {Alert, IconButton, Input, CircularProgress} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';

export function MovieInput() {
    const [newMovie, setNewMovie] = useState("")
    const [alert, setAlert] = useState(false)
    const [alertText, setAlertText] = useState("")
    const [level, setLevel]:["success" | "info" | "warning" | "error" | undefined, Dispatch<SetStateAction<"success" | "info" | "warning" | "error" | undefined>>] = useState()
    const [loading, setLoading]:[boolean, Dispatch<boolean>] = useState(false)

    const isEmpty = useSelector(state => state.movies.movies.length == 0)

    const dispatch = useDispatch()

    const handleAddMovie = () => {
        if (!newMovie) {
            setAlertText("You are trying to add an empty movie");
            setLevel("warning")
            setAlert(true);
            return;
        }

        dispatch(addMovie(newMovie))
        setNewMovie("")
    }
    const handleClear = () => {
        if (isEmpty) {
            setLevel("warning")
            setAlertText("You are trying to clear but there is no movies");
            setAlert(true)
            return;
        }
        dispatch(clearMovies({}))
    }
    const handleDownload = async () => {
        setLoading(true)
        try {
            const response = await fetch("/movies")
            if (response.status != 200) {
                setLevel("error")
                setAlertText("Something went wrong fetching data");
                setAlert(true)
                setLoading(false)
                return
            }

            const data = await response.json();

            data.forEach((record:string) => {
                dispatch(addMovie(record))
            })
        } catch (error) {
            console.error(error)
            setLevel("error")
            setAlertText("Something went wrong fetching data");
            setAlert(true)
            return
        } finally {
            setLoading(false)
        }

    }
    const handleOnChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setNewMovie(event.target.value)
    }


    return (
        <>
            <Input disabled={alert} placeholder="My Favorite Movie" onChange={handleOnChange} value={newMovie}/>
            <IconButton disabled={alert} color="primary" sx={{p: '10px'}} aria-label="directions"
                        onClick={handleAddMovie}>
                <AddIcon/>
            </IconButton>
            <IconButton disabled={alert} color="primary" sx={{p: '10px'}} aria-label="directions" onClick={handleClear}>
                <ClearIcon/>
            </IconButton>
            <IconButton disabled={alert || loading} color="primary" sx={{p: '10px'}} aria-label="directions"
                        onClick={handleDownload}>
                {loading ? <CircularProgress size={24} /> : <DownloadIcon />}
            </IconButton>

            <Collapse in={alert}>
                <Alert
                    severity={level}
                    variant="filled"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setAlert(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                    }
                    sx={{mb: 2}}
                >{alertText}</Alert>
            </Collapse>
        </>
    )
}