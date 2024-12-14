package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

type Movie struct {
	Title string `json:"title"`
}

func fetchMovies() ([]string, error) {
	resp, err := http.Get("https://freetestapi.com/api/v1/movies")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var movies []Movie
	if err := json.Unmarshal(body, &movies); err != nil {
		return nil, err
	}

	titles := make([]string, len(movies))
	for i, movie := range movies {
		titles[i] = movie.Title
	}

	return titles, nil
}

func main() {
	staticDir := "./dist"

	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if path == "/" {
			path = "/index.html"
		}
		filePath := filepath.Join(staticDir, path)
		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			http.NotFound(w, r)
			return
		}
		http.ServeFile(w, r, filePath)
	})

	mux.HandleFunc("/movies", func(w http.ResponseWriter, r *http.Request) {
		movies, err := fetchMovies()
		if err != nil {
			log.Printf("Error fetching movies: %v", err)
			http.Error(w, "Failed to fetch movies", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(movies); err != nil {
			log.Printf("Error writing response: %v", err)
		}
	})

	handler := corsMiddleware(mux)

	port := ":8080"
	log.Printf("Server is running on http://localhost%s", port)
	log.Fatal(http.ListenAndServe(port, handler))
}
