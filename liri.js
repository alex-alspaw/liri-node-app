require('dotenv').config();

const keys = require('./keys');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');
const spotify = new Spotify(keys.spotify);

const inputList = process.argv;

const inputCommand = process.argv[2];

let artist = '';
let movie = '';
let music = '';

const songCommand = function () {

    for (let i = 3; i < inputList.length; i++) {
        music = inputList.slice(3, inputList.length).join(' ');
    };

    spotify.search({ type: 'track', query: `${music}` }, function (err, data) {

        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data.tracks.items[0].album.artists[0].name);

        console.log(data.tracks.items[0].name);
        if (data.tracks.items[0].preview_url === null) {
            console.log(`There is no preview url :( but no need to fret! Better yet, here is a link to the full song: ${data.tracks.items[0].external_urls.spotify}`)
        } else {
            console.log(`Here is a link if you'd like to preview the ear candy: ${data.tracks.items[0].preview_url}`)
        };

        console.log(data.tracks.items[0].album.name);

    });
};

if (inputCommand === 'concert-this') {

    for (let i = 3; i < inputList.length; i++) {

        artist = artist += `${inputList[i]}`;
        //artist = inputList.slice(3, inputList.length).join(' ');
    };

    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            myArr = JSON.parse(body);

            venueList = [];

            for (let i = 0; myArr.length; i++) {

                if (typeof myArr[0].venue !== "undefined") {
                    venueList += myArr[0].venue[i];
                };

            };
            console.log(venueList);
            console.log(`${artist}'s next show is at ${myArr[0].venue.name} 
                    in ${myArr[0].venue.city}, ${myArr[0].venue.region}`);
        }
    });

} else if (inputCommand === 'spotify-song') {

    songCommand();

} else if (inputCommand === 'movie-this') {

    for (let i = 3; i < inputList.length; i++) {
        movie += `+${inputList[i]}`;
        movie = inputList.slice(3, inputList.length).join(' ');
    };

    if (inputList[3] === undefined) {
        console.log("If you haven't watched Mr. Nodbody you should: <http://www.imdb.com/title/tt0485947/>\nIt's on Netflix!")
    } else {
        request(`http://www.omdbapi.com/?apikey=trilogy&t=${movie}`, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // Then log the body from the site!

                movieObj = JSON.parse(body);
                console.log(`${movieObj.Title} came out in ${movieObj.Year}`);
                console.log(`imdb rating is ${movieObj.Ratings[0].Value}`)
                if (movieObj.Ratings.length < 2) {
                    console.log("Tomatometer N/A")
                } else {
                    console.log(`This movie achieved ${movieObj.Ratings[1].Value} on the Tomatometer`);
                };
                console.log(`Production country: ${movieObj.Country}`);
                console.log(`Language of the movie: ${movieObj.Language}`);
                console.log(`Plot summary: ${movieObj.Plot}`);
                console.log(`Actors: ${movieObj.Actors}`);
            }
        });
    }

} else if (inputCommand === 'do-what-it-says') {

    //console.log(nameList);
    //console.log(nameList[1]);

    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) throw err;
        //console.log(data);
        let liriCommands = data.replace(/['"]+/g, '').split(',');
        //console.log(liriCommands);
        //console.log(liriCommands[0]);
        //console.log(liriCommands[1]);
        //const randomSong = JSON.parse(data.split(',').splice(1, 1));
        //console.log(randomSong);
        music = liriCommands[1];
        songCommand();
    });

} else {
    console.log("Not a valid command");
};