// Movie Class

class Movie {
    constructor(title, genre, certification) {
        this.title = title;
        this.genre = genre;
        this.certification = certification;
    }
}

// UI Class

class UI {
    // Display Movies Method
    static displayMovies() {

        const movies = Store.getMovies();
        // Arrow function and forEach to loop each movie then call addMovieToList method to display in UI
        movies.forEach((movie) => UI.addMovieToList(movie));
    }

    // Add Books Method
    static addMovieToList(movie) {

        const list = document.querySelector('#movie-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${movie.title}</td >
            <td>${movie.genre}</td>
            <td>${movie.certification}</td>
            <td><a href="#" class="btn btn-danger btn-sm"><i class="far fa-trash-alt delete"></i></a></td>  
        `;

        list.appendChild(row);
    }

    // Event Propagation Method to remove complete row instead of just delete icon
    static deleteMovie(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.parentElement.remove();
        }
    }

    // Show Alert Message Method
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.col');
        const form = document.querySelector('#movie-form');
        // Insert div before form to display alert dynamically 
        container.insertBefore(div, form);
        // Alert vanishes after 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    // Clear fields after submit is clicked
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#genre').value = '';
        document.querySelector('#certification').value = '';
    }
}

// Store Movies in Local Storage
class Store {

    static getMovies() {
        let movies;
        // Check first if there is not an item called 'movies' already in local storage
        if (localStorage.getItem('movies') === null) {
            // if null then initialise and set an empty array called movies
            movies = [];
        } else {
            // if movies is found use JSON.parse to convert string to object from local storage (LS uses strings)
            movies = JSON.parse(localStorage.getItem('movies'));
        }

        return movies;
    }

    static addMovie(movie) {
        const movies = Store.getMovies();
        // push on movie passed into addMovie(movie) to movies
        movies.push(movie);
        // convert movies from array object back to a string for use in LS using stringify
        localStorage.setItem('movies', JSON.stringify(movies));
    }

    static removeMovie(title) {
        const movies = Store.getMovies();
        // Loop each movie and also access the index for each movie
        movies.forEach((movie, index) => {
            if (movie.title === title) {
                movies.splice(index, 1);
            }
        });

        // Reset LS to string
        localStorage.setItem('movies', JSON.stringify(movies));
    }
}


// Display Movies Event
document.addEventListener('DOMContentLoaded', UI.displayMovies);

// Submit Button Event
document.querySelector('#movie-form').addEventListener('submit', (e) => {
    // Prevent Submit
    e.preventDefault();

    // Get the Values
    const title = document.querySelector('#title').value;
    const genre = document.querySelector('#genre').value;
    const certification = document.querySelector('#certification').value;

    // Validate input fields
    if (title === '' || genre === '' || certification === '') {
        UI.showAlert('Please Fill in All Fields', 'danger')
    } else {
        // Instantiate new movie object
        const movie = new Movie(title, genre, certification);

        // Add movie to UI
        UI.addMovieToList(movie);

        // Add movie to Store
        Store.addMovie(movie);

        // Success Message
        UI.showAlert('Movie Added', 'success');

        // Clear the fields
        UI.clearFields();
    }
});

// Remove a Movie Event
document.querySelector('#movie-list').addEventListener('click', (e) => {

    // Remove book from UI
    UI.deleteMovie(e.target);

    // Remove movie from local store and traverse DOM from delete icon to remove movie title identifier
    Store.removeMovie(e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    // Delete Success message
    UI.showAlert('Movie Removed', 'success');

});