const url = "https://localhost:44361/api/film"
var page = document.getElementById("Content");



console.log(localStorage)

GetMovies(url);

function GetMovies(url) {
    fetch(url)
        .then(response => response.json())
        .then((data) => {
            DisplayMovies(data);
        });
}


// Called after all movies have been fetched, then display them
function DisplayMovies(movies) {
    page.innerHTML = "";

    page.insertAdjacentHTML("afterbegin", `<ul id="MovieList"> </ul>`)

    if (localStorage.getItem("userId") !== null) {
        var navBar = document.getElementById("navBar");
        navBar.innerHTML = "";
        navBar.insertAdjacentHTML("afterbegin", `
            <button class="NavBtn" id="MoviesBtn">Movies</button>
            <button class="NavBtn" id="LogoutBtn">Logout</button>`
        );

        var logoutBtn = document.getElementById("LogoutBtn");
        logoutBtn.addEventListener("click", () => {
            LogoutUser();
        })

        var moviesBtn = document.getElementById("MoviesBtn");
        moviesBtn.addEventListener("click", () => {
            location.reload();
        })

    }



    var img = "";
    var movieList = document.getElementById("MovieList");


    movies.forEach(element => {


        var trivia = ""

        console.log(element);
        if (element.name === "Jurassic Park") {
            img = "../img/jp.jpg";
        }
        else if (element.name === "Blade Runner") {
            img = "../img/br.jpg";
        }
        else if (element.name === "Rambo") {
            img = "../img/rb.jpg";
        }
        else {
            img = "../img/NotFound.png";
        }

        if (localStorage.getItem("userId") !== null) {
            movieList.insertAdjacentHTML("afterbegin",
                `<li>
                <div class="MovieCard">
                    <img src="${img}" alt="" class="MovieImage">
                    <div class="MovieCardContent">
                        <h3 class="MovieTitle">${element.name}</h3>
                        <ul id="MovieTrivia" class="MovieTrivia"> ${trivia} </ul>
                    </div>
                    <div class="CardActions">
                        <div class="tooltip">
                            <button id="RentMovie_${element.id}" class="fas fa-check Rent"></button>
                            <span class="tooltiptext">Rent</span>
                        </div>
                        <div class="tooltip">
                            <button id="ReturnMovie_${element.id}" class="fas fa-times Rent"></button>
                            <span class="tooltiptext">Return</span>
                        </div>
                        <div class="tooltip">
                            <button id="AddTrivia_${element.id}" class="fas fa-edit Rent"></button>
                            <span class="tooltiptext">Add trivia</span>
                        </div>
                        
                        </div>
                    </div>
                </li>`
            )


        }
        else {
            movieList.insertAdjacentHTML("afterbegin",
                `<li>
                <div class="MovieCard">
                    <img src="${img}" alt="" class="MovieImage">
                    <div class="MovieCardContent">
                        <h3 class="MovieTitle">${element.name}</h3>
                        <ul id="MovieTrivia" class="MovieTrivia"> ${trivia} </ul>
                    </div>
                </div>
            </li>`
            )
        }
        trivia = DisplayTrivia(element);

        if (trivia === undefined) {
            trivia = "";
        }
    });

    movieList.addEventListener("click", (e) => {
        LoanMovie(e);
        ReturnMovie(e);
        AddTrivia(e);
    });
}

function LoanMovie(event) {
    switch (event.target.id) {
        case "RentMovie_1":
            console.log(`${localStorage.getItem("userId")}  Rented Jurassic Park`)
            var userId = localStorage.getItem("userId");
            var data = {
                FilmId: 1,
                StudioId: parseInt(userId)
            };
            PostToRent(data);
            break;
        case "RentMovie_2":
            console.log(`${localStorage.getItem("userId")}  Rented Blade Runner`)
            var userId = localStorage.getItem("userId");
            var data = {
                FilmId: 2,
                StudioId: parseInt(userId)
            };
            PostToRent(data);
            break;
        case "RentMovie_3":
            console.log(`${localStorage.getItem("userId")}  Rented Rambo`)
            var userId = localStorage.getItem("userId");
            var data = {
                FilmId: 3,
                StudioId: parseInt(userId)
            };
            PostToRent(data);
            break;

        default:
            break;
    }
}

function ReturnMovie(event) {
    switch (event.target.id) {
        case "ReturnMovie_1":
            console.log(`${localStorage.getItem("userId")}  Returned Jurassic Park`)
            ReturnRented(parseInt(localStorage.getItem("userId")), 1);
            break;
        case "ReturnMovie_2":
            console.log(`${localStorage.getItem("userId")}  Returned Blade Runner`)
            ReturnRented(parseInt(localStorage.getItem("userId")), 2);
            break;
        case "ReturnMovie_3":
            console.log(`${localStorage.getItem("userId")}  Returned Rambo`)
            ReturnRented(parseInt(localStorage.getItem("userId")), 3);
            break;

        default:
            break;
    }
}

function AddTrivia(event) {
    switch (event.target.id) {
        case "AddTrivia_1":
            console.log(`${localStorage.getItem("userId")}  Added trivia for Jurassic Park`)
            PostTrivia("Jurrasic Park", 1);
            break;
        case "AddTrivia_2":
            console.log(`${localStorage.getItem("userId")}  Added trivia for Blade Runner`)
            PostTrivia("Blade Runner", 2);
            break;
        case "AddTrivia_3":
            console.log(`${localStorage.getItem("userId")}  Added trivia for Rambo`)
            PostTrivia("Rambo", 3);
            break;
        default:
            break;
    }
}


// Post to the api that this studio has rented this movies
function PostToRent(data) {
    fetch('https://localhost:44361/api/RentedFilm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// First check that the studio has rented this movie then delete it from database
function ReturnRented(studioId, movieId) {
    fetch('https://localhost:44361/api/RentedFilm')
        .then(response => response.json())
        .then((data) => {
            data.forEach(element => {
                if (element.filmId === movieId && element.studioId === studioId) {
                    var id = parseInt(element.id);
                    fetch(`https://localhost:44361/api/RentedFilm/` + id, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            console.log('Success:', response);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
                else {
                    console.log("Studio has not loaned that movie")
                }
            });
        });
}

function PostTrivia(movie, movieId) {
    page.innerHTML = "";
    page.insertAdjacentHTML("afterbegin", `
        <div class="FormContainer"> 
            <h2>Write a trivia for ${movie}</h2>
            <form>
                <textarea id = "triviaBox" name="message" rows="10" cols="30">Write something...</textarea>
                <br><br>
                <button id = "addTrivia" type = "button">Post Trivia</button>
            </form>
        </div>`
    )
    var postTriviaBtn = document.getElementById("addTrivia");
    postTriviaBtn.addEventListener("click", () => {
        var content = document.getElementById("triviaBox").value;
        var data = {
            filmId: movieId,
            trivia: content
        }
        fetch('https://localhost:44361/api/filmTrivia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    })

}

function DisplayTrivia(movie) {
    var triviaList = document.getElementById("MovieTrivia");

    fetch('https://localhost:44361/api/filmTrivia')
        .then(response => response.json())
        .then((data) => {
            data.forEach(element => {
                if (movie.id === element.filmId) {
                    triviaList.insertAdjacentHTML("afterbegin", `<li class="TriviaContent"> ${element.trivia} </li>`)
                }
            });
        });
}

var loginBtn = document.getElementById("LoginBtn");

loginBtn.addEventListener("click", () => DisplayLogin())

function DisplayLogin() {
    console.log("Clicked!!!");
    page.innerHTML = "";
    page.insertAdjacentHTML("afterbegin", `
    <div id="LoginForm" class="FormContainer">
        <form class="LoginForm">
            <label for="uname">User name</label><br>
            <input type="text" id="uname" name="uname"><br>
            <label for="password">Password</label><br>
            <input type="text" id="password" name="password"><br>
            <button type="button" id="Login">Login</button>
        </form>
        <p>Need an account?</p>
        <button id="CreateBtn" style="width: 100px;">Create Account</button>
    </div>`
    )

    var login = document.getElementById("Login");
    login.addEventListener("click", () => LoginUser())

    var createBtn = document.getElementById("CreateBtn");
    createBtn.addEventListener("click", () => {
        CreateStudio();
    });
}

function LoginUser() {
    var uname = document.getElementById("uname").value;
    var password = document.getElementById("password").value;

    console.log(uname + " " + password);

    fetch('https://localhost:44361/api/filmstudio')
        .then(response => response.json())
        .then((data) => {
            CheckUser(data, uname, password);
        });
}

function CheckUser(users, uname, password) {
    users.forEach(element => {
        if (element.name === uname && element.password === password) {
            localStorage.setItem("userId", element.id);
        }

    });

    if (localStorage.getItem("userId") !== null) {
        console.log("You are now loggedin!");
        GetMovies(url);
    }
    else {
        var loginForm = document.getElementById("LoginForm");
        loginForm.insertAdjacentHTML("afterbegin", `<p>Wrong password :(</p>`)
    }
}

function LogoutUser() {
    localStorage.clear("userId");
    location.reload();
}

function CreateStudio() {
    page.innerHTML = "";
    page.insertAdjacentHTML("afterbegin", `
        <div>
            <form class="FormContainer">
                <label for="fname">Movie studio name:</label><br>
                <input type="text" id="uname" name="uname"><br>
                <label for="lname">Password:</label><br>
                <input type="text" id="password" name="password"><br>
                <button type="button" id="Create">Create</button>
            </form>
        </div>`
    );

    var create = document.getElementById("Create");
    create.addEventListener("click", () => {
        var uname = document.getElementById("uname").value;
        var password = document.getElementById("password").value;

        const data = {
            name: uname,
            password: password,
            verified: true
        };

        fetch('https://localhost:44361/api/filmstudio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    });
}

function Reload() {
    location.reload();
}