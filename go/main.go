package main

import (
	"encoding/json"
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
		log.Printf("Returning list of movies: %d", len(movies))

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

var movies = []string{
	"The Shawshank Redemption",
	"The Godfather",
	"The Dark Knight",
	"Pulp Fiction",
	"Forrest Gump",
	"Inception",
	"The Matrix",
	"The Lord of the Rings: The Return of the King",
	"The Dark Knight Rises",
	"Interstellar",
	"Fight Club",
	"Gladiator",
	"The Silence of the Lambs",
	"The Departed",
	"Saving Private Ryan",
	"The Prestige",
	"Schindler's List",
	"Django Unchained",
	"Parasite",
	"Whiplash",
	"Mad Max: Fury Road",
	"The Lion King",
	"Titanic",
	"Avatar",
	"The Social Network",
	"The Grand Budapest Hotel",
	"Joker",
	"Black Panther",
	"The Wolf of Wall Street",
	"12 Years a Slave",
	"Spider-Man: Into the Spider-Verse",
	"Get Out",
	"La La Land",
	"Logan",
	"The Irishman",
	"A Star is Born",
	"Moonlight",
	"Arrival",
	"The Revenant",
	"Inside Out",
	"The Green Mile",
	"Shutter Island",
	"Slumdog Millionaire",
	"The King's Speech",
	"Argo",
	"Les Misérables",
	"The Hunger Games",
	"The Pursuit of Happyness",
	"The Pianist",
	"Good Will Hunting",
	"The Truman Show",
	"Cast Away",
	"A Beautiful Mind",
	"Memento",
	"No Country for Old Men",
	"There Will Be Blood",
	"The Big Short",
	"Inglourious Basterds",
	"The Hateful Eight",
	"Once Upon a Time in Hollywood",
	"Bohemian Rhapsody",
	"Rocketman",
	"Frozen",
	"Frozen II",
	"Moana",
	"Zootopia",
	"Coco",
	"Soul",
	"Luca",
	"Turning Red",
	"Encanto",
	"Ratatouille",
	"WALL-E",
	"Toy Story",
	"Toy Story 3",
	"Toy Story 4",
	"Finding Nemo",
	"Finding Dory",
	"Up",
	"The Incredibles",
	"The Incredibles 2",
	"Brave",
	"Monsters, Inc.",
	"Monsters University",
	"Cars",
	"Cars 2",
	"Cars 3",
	"A Bug's Life",
	"The Good Dinosaur",
	"Onward",
	"Lightyear",
	"The Secret Life of Pets",
	"Despicable Me",
	"Despicable Me 2",
	"Despicable Me 3",
	"Minions",
	"Minions: The Rise of Gru",
	"Sing",
	"Sing 2",
	"The Lego Movie",
	"The Lego Movie 2: The Second Part",
	"Shrek",
	"Shrek 2",
	"Shrek the Third",
	"Shrek Forever After",
	"Puss in Boots",
	"Kung Fu Panda",
	"Kung Fu Panda 2",
	"Kung Fu Panda 3",
	"Madagascar",
	"Madagascar: Escape 2 Africa",
	"Madagascar 3: Europe's Most Wanted",
	"How to Train Your Dragon",
	"How to Train Your Dragon 2",
	"How to Train Your Dragon: The Hidden World",
	"Deadpool & Wolverine",
	"John Wick: Chapter 4",
	"Aftersun",
	"The Whale",
	"Watchmen",
	"300",
	"True Grit",
	"Deadpool 2",
	"Hell or High Water",
}
