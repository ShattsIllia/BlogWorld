import '../scss/blog.scss'
import '../js/modalWindow_plugin'

import 'popper.js';
import 'bootstrap';
import 'jquery';


class PostCreator {
    constructor(postCount) {
        this.postCount = postCount;
        this.types = {
            video: 0,
            audio: 0,
            image: 0,
            text: 0
        };
        this.API_KEY = 'b4f5c0f05bf151014cc60d3244c26353';
    }

    async createPosts() {
        const movies = await this.fetchMoviesJSON();
        const slicedMovies = movies.slice(0, this.postCount);
        const extendedMovies = await this.getExtendedMovies(slicedMovies);

        for (let extendedMovie of extendedMovies) {
            const type = this.getType(this.types);
            if (type === 'video') {
                const post = new VideoPost(this.createConfigurationForPost(extendedMovie), '.before-content');
                post.createPost();
                post.playVideo();
            } else if (type === 'audio') {
                const post = new AudioPost(this.createConfigurationForPost(extendedMovie), '.before-content');
                post.createPost();
                post.playAudio();
            } else if (type === 'image') {
                const post = new ImgPost(this.createConfigurationForPost(extendedMovie), '.before-content');
                post.createPost();
            } else {
                const post = new TextPost(this.createConfigurationForPost(extendedMovie), '.before-content');
                post.createPost();
            }
            this.types[type]++;
        }
    }

    createConfigurationForPost(movie) {
        return {
            id: movie.id,
            poster: `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`,
            logo: movie.details.production_companies[0].logo_path ?
                `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${movie.details.production_companies[0].logo_path}` : './img/no-logo.jpg',
            author: movie.details.production_companies[0].name,
            releaseDate: this.getReleaseDateData(movie.release_date),
            runtime: movie.details.runtime,
            votes: movie.vote_count,
            postRating: this.getpostRating(movie.vote_average),
            postTitle: movie.title,
            postText: movie.overview
        }
    }
    getReleaseDateData(data) {
        let month = [
            'jan',
            'feb',
            'mar',
            'apr',
            'may',
            'jun',
            'jul',
            'aug',
            'sep',
            'oct',
            'nov',
            'dec'
        ]
        if (data === undefined) {
            data = "2021-11-31";
        }
        let year = data.slice(0, 4);
        let day = data.slice(8);
        let curentMonth = +data.slice(5, 7);
        return `${day} ${month[curentMonth]}, ${year}`;
    }
    getpostRating(data) {
        const maxNumberStars = 5;
        const rating = data / 2;
        const numberOfFullStars = Math.floor(rating);
        let numberOfGreyStars = 0;
        let numberOfHalfStars = 0;
        if (Number.isInteger(data) === false) {
            numberOfGreyStars = maxNumberStars - numberOfFullStars - 1;
            numberOfHalfStars = 1;
        } else {
            numberOfGreyStars = maxNumberStars - numberOfFullStars;
        }

        return {
            numberOfFullStars,
            numberOfHalfStars,
            numberOfGreyStars
        };
    }


    async fetchMoviesJSON() {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${this.API_KEY}&page=1`);
        const movies = await response.json();
        return movies.results;
    }

    async fetchMovieByIdJSON(id) {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${this.API_KEY}`);
        const movie = await response.json();
        return movie;
    }

    async getExtendedMovies(movies) {
        const extendedMovies = [];
        for (const movie of movies) {
            const movieById = await this.fetchMovieByIdJSON(movie.id);
            const extendedMovie = {...movie, details: movieById };
            extendedMovies.push(extendedMovie);
        }
        return extendedMovies;
    }

    getType(types) {
        const entries = Object.entries(types);
        return entries.reduce((prev, current) => {
            return prev[1] <= current[1] ? prev : current
        })[0];
    }
}

class Post {
    constructor(configuration, whereToAdd) {
        this.configuration = configuration;
        this.placeToAddContent = document.querySelector(whereToAdd);
    }

    createPost() {
        this.placeToAddContent.insertAdjacentHTML('beforeend', this.createHtmlTemplate());
    }

    createHtmlTemplate() {
        return 'Html Template';
    }
    drawStars(starsObj) {
        let ratingHtmlTemplate = '';

        for (let i = 0; i < starsObj['numberOfFullStars']; i++) {
            ratingHtmlTemplate = ratingHtmlTemplate + '<img src="./img/icons/Star-1.svg"></img>';
        }
        for (let i = 0; i < starsObj['numberOfHalfStars']; i++) {
            ratingHtmlTemplate = ratingHtmlTemplate + '<img src="./img/icons/Group.svg"></img>';
        }
        for (let i = 0; i < starsObj['numberOfGreyStars']; i++) {
            ratingHtmlTemplate = ratingHtmlTemplate + '<img src="./img/icons/Star-2.svg"></img>';
        }
        return ratingHtmlTemplate;
    }
}

class AudioPost extends Post {
    createHtmlTemplate() {
        return `<div class="row shadow-element flex-md-row justify-content-between post w-100 next-post">
        <div class="post__background col-12 col-lg-5 col-xl-6 p-0">
        <img class="post__icon" src="${this.configuration.poster}"></div>
        <div class="post__content post__content_audio col-lg-7 col-xl-6">
            <div class="post__author d-flex flex-column flex-lg-row">
            <div class="post__author__img"><img src="${this.configuration.logo}" width=100px, height=100px alt="company-logo"></div>
                <div class="post__description">
                    <div class="post__author__name">${this.configuration.author}</div>
                    <div class="post__metrics d-flex align-items-center">
                        <div class="release__date">${this.configuration.releaseDate}</div>
                        <div class="oval"></div>
                        <div class="run-time">${this.configuration.runtime} min</div>
                        <div class="oval"></div>
                        <div class="d-flex votes">${this.configuration.votes} &nbsp <img src="./img/icons/a-icon-comment.svg"></div>
                        <div class="d-flex post__rating">${this.drawStars(this.configuration.postRating)}</div>
                    </div>
                </div>
            </div>
            <div class="post__title">${this.configuration.postTitle}</div>
            <div class="post__audio">
              <audio class="audio-player" src="/EPAM/fl-15/HW_06/img/Qeen.mp3" controls="controls" loop preload="auto">
            </audio></div>
            <div class="post__text post__text_audio">${this.configuration.postText}</div>
            <div class="post__button"><input class="post__button_item post__button_item_black" type="button" value="Read more">
            <input class="post__button_item post__button_item_delete ml-5" type="button" value="Delete post"></div>
        </div>
    </div>`;
    }

    playAudio() {
        const audioButton = document.querySelector('.audio-player');
        audioButton.addEventListener('playing', () => {
            console.log('Audio is playing');
        })
    }
}

class ImgPost extends Post {
    createHtmlTemplate() {
        return `<div class="row shadow-element flex-md-row justify-content-between post w-100 next-post">
        <div class="post__background col-lg-5 col-xl-6 p-0">
        <img class="post__icon" src="${this.configuration.poster}"></div>
        <div class="post__content post__content_picture col-lg-7 col-xl-6">
            <div class="post__author d-flex flex-column flex-lg-row">
            <div class="post__author__img"><img src="${this.configuration.logo}" width=100px, height=100px alt="company-logo"></div>
                <div class="post__description">
                    <div class="post__author__name">${this.configuration.author}</div>
                    <div class="post__metrics d-flex align-items-center">
                        <div class="release__date">${this.configuration.releaseDate}</div>
                        <div class="oval"></div>
                        <div class="run-time">${this.configuration.runtime} min</div>
                        <div class="oval"></div>
                        <div class="d-flex votes">${this.configuration.votes} &nbsp <img src="./img/icons/a-icon-comment.svg"></div>
                        <div class="d-flex post__rating">${this.drawStars(this.configuration.postRating)}</div>
                    </div>
                </div>
            </div>
            <div class="post__title">${this.configuration.postTitle}</div>
            <div class="post__text">${this.configuration.postText}</div>
            <div class="post__button"><input class="post__button_item" type="button" value="Read more">
            <input class="post__button_item post__button_item_delete ml-5" type="button" value="Delete post"></div>
        </div>
    </div>`;
    }
}

class TextPost extends Post {
    createHtmlTemplate() {
        return `<div class="post__content post__content_text col-12 next-post">
        <div>
        <div class="post__author post__author_text d-flex flex-column flex-lg-row">
            <div class="post__author__img"><img src="${this.configuration.logo}" width=100px, height=100px alt="company-logo"></div>
            <div class="post__description">
                <div class="post__author__name">${this.configuration.author}</div>
                <div class="post__metrics d-flex align-items-center">
                    <div class="release__date">${this.configuration.releaseDate}</div>
                    <div class="oval"></div>
                    <div class="run-time">${this.configuration.runtime} min</div>
                    <div class="oval"></div>
                    <div class="d-flex votes">${this.configuration.votes} &nbsp <img src="./img/icons/a-icon-comment.svg"></div>
                    <div class="d-flex post__rating">${this.drawStars(this.configuration.postRating)}</div>
                </div>
            </div>
        </div>
        <div class="post__title post__title_text">${this.configuration.postTitle}</div>
        <div class="post__text post__text_text">${this.configuration.postText}</div>
        <div class="post__button post__button_text"><input class="post__button_item post__button_item_text" type="button" value="Read more">
        <input class="post__button_item post__button_item_delete ml-5" type="button" value="Delete post"></div>
        </div>
    </div>`;
    }
}

class VideoPost extends Post {
    createHtmlTemplate() {
        return `<div class="row shadow-element flex-md-row justify-content-between post w-100 first-post">
            <div class="post__background post__background_video col-lg-5 col-xl-6 p-0">
            <img class="post__icon post__icon_video" src="${this.configuration.poster}"></div>
            <div class="post__content post__content_video col-lg-7 col-xl-6">
                <div class="post__author d-flex flex-column flex-lg-row">
                <div class="post__author__img"><img src="${this.configuration.logo}" width=100px, height=100px alt="company-logo"></div>
                    <div class="post__description">
                        <div class="post__author__name">${this.configuration.author}</div>
                        <div class="post__metrics d-flex align-items-center">
                            <div class="release__date">${this.configuration.releaseDate}</div>
                            <div class="oval"></div>
                            <div class="run-time">${this.configuration.runtime} min</div>
                            <div class="oval"></div>
                            <div class="d-flex votes">${this.configuration.votes} &nbsp <img src="./img/icons/a-icon-comment.svg"></div>
                        <div class="d-flex post__rating">${this.drawStars(this.configuration.postRating)}</div>
                    </div>
                </div>
            </div>
            <div class="post__title">${this.configuration.postTitle}</div>
            <div class="post__text">${this.configuration.postText}</div>
            <div class="post__button"><input class="post__button_item" type="button" value="Read more">
            <input class="post__button_item post__button_item_delete ml-5" type="button" value="Delete post"></div>
        </div>
    </div>`;
    }

    playVideo() {
        const playButton = document.querySelector('.post__background_video');
        playButton.addEventListener('click', () => {
            console.log('Video is playing');
        })
    }
}

let postCreator = new PostCreator(20);
postCreator.createPosts().then(() => {
    downloadLastFilter();
    processFilterByAuthor();
    processFilterByTitle();

})

function downloadLastFilter() {
    let filterByAuthorString = localStorage.getItem('filterByAuthor');
    let filterByTitleString = localStorage.getItem('filterByTitle');

    if (filterByAuthorString) {
        let input = document.querySelector('.blog__search_item');
        filterByAuthor(filterByAuthorString);
        input.innerHTML = filterByAuthorString;
    }

    if (filterByTitleString) {
        let input = document.querySelector('.blog__search_item_title');
        filterByTitle(filterByTitleString);
        input.innerHTML = filterByTitleString;
    }
}

function processFilterByTitle() {
    let input = document.querySelector('.blog__search_item_title');
    input.addEventListener('keyup', () => {
        let filterValue = input.value;
        if (validate(filterValue)) {
            if (document.querySelector('#errorStr')) {
                document.getElementById('errorStr').remove();
            }
            localStorage.setItem('filterByTitle', filterValue);
            localStorage.removeItem('filterByAuthor');
            filterByTitle(filterValue);
        } else {
            filterByTitle('');
            if (!document.querySelector('#errorStr')) {
                const inputParent = document.querySelector('.blog__search_title')
                let errorString = document.createElement('div');
                errorString.id = 'errorStr';
                errorString.innerHTML = 'min 6, max 60 characters, first letter upercase, only Latin, may contain "!", "-", ":", "?", ",". ';
                inputParent.append(errorString);
            }
        }
    });

    input.onblur = function() {
        if (document.querySelector('#errorStr')) {
            document.getElementById('errorStr').remove();
        }
    };
}

function processFilterByAuthor() {
    let input = document.querySelector('.blog__search_item');
    input.addEventListener('keyup', () => {
        let filterValue = input.value.toLowerCase();
        localStorage.setItem('filterByAuthor', filterValue);
        localStorage.removeItem('filterByTitle');
        filterByAuthor(filterValue);
    })
}

function filterByAuthor(filterValue) {
    let filterElems = document.querySelectorAll('.post__author__name');
    let counter = 0;
    filterElems.forEach(item => {
        if (item.innerHTML.toLowerCase().indexOf(filterValue) > -1) {
            item.parentElement.parentElement.parentElement.parentElement.style.display = '';
        } else {
            item.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            counter++;
        }
    });
    displayNotFoundMessage(counter, filterElems);
}

function filterByTitle(filterValue) {
    let filterElems = document.querySelectorAll('.post__title');
    let counter = 0;
    filterElems.forEach(item => {
        if (item.innerHTML.indexOf(filterValue) > -1) {
            item.parentElement.parentElement.style.display = '';
        } else {
            item.parentElement.parentElement.style.display = 'none';
            counter++;
        }
    })
    displayNotFoundMessage(counter, filterElems);
}

function validate(title) {
    return /^[A-Z]{1}[\w\d!,?.\s:-].{4,60}$/gm.test(title);
}

function displayNotFoundMessage(counter, filterElems) {
    const inputParent = document.querySelector('.blog__search_title');
    const noDataDiv = document.querySelector('.no_data');
    if (counter === filterElems.length && !noDataDiv) {
        inputParent.insertAdjacentHTML('afterend', '<div class="no_data">No movies were found</div>');
    } else if (noDataDiv && counter !== filterElems.length) {
        noDataDiv.remove();
    }
}


$('.main-container').openModalWindowPlugin("Are you Sure you want to delete this post?", "error", "dark", 'delete')
$('.main-container').openModalWindowPlugin("Subscribe to this blog and get new updates first", "success", "light", 'subscribe')