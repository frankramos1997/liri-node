require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require('moment');

var verb = process.argv[2];
var noun = process.argv[3];
liri(verb, noun);

function liri(){

    if(verb === "spotify-this"){
        var spotifyNoun = noun;
 
        if(noun === undefined){
            var spotifyNoun = 'The Sign Ace of Base';
        }

        spotify.search({ type: 'track', query: spotifyNoun, limit: 20}, function(err, data) {
            if (err) {
              return console.log('Woops! An error occurred: ' + err);
            }
            for (i=0; i < data.tracks.items.length; i++){
                var artistName = "";

                for (let x = 0; x < data.tracks.items[i].album.artists.length; x++ ) {
                    artistName = artistName + data.tracks.items[i].album.artists[x].name;
                  }

                console.log("Artist:", artistName);
                console.log("Song Name:", data.tracks.items[i].name);
                console.log("Album:", data.tracks.items[i].album.name);

                if(data.tracks.items[i].preview_url === null){
                    console.log('Preview Link Unavailable for this track');
                } else(
                    console.log("Preview Link:", data.tracks.items[i].preview_url)
                )
                console.log("---------");

            }

          });

    }

    if(verb === "concert-this"){
        var concertArtistNoun = noun;
        axios.get("https://rest.bandsintown.com/artists/" + concertArtistNoun + "/events?app_id=codingbootcamp").then(
            function(response) {
                    for(i=0; i < response.data.length; i++){
                        console.log("Venue: ", response.data[i].venue.name);
                        console.log("Location: ", response.data[i].venue.city + ", "+ response.data[i].venue.region);
                        console.log("Date: ", moment(response.data[i].datetime).format('MM/DD/YYYY'));
                        console.log("-----------");
                    }

            }
          
        )}

        if(verb === "movie-this"){
            if(noun === undefined){
                var movieNoun = 'Mr. Nobody';
            } else{
                var movieNoun = noun;
            }
            axios.get("http://www.omdbapi.com/?t=" + movieNoun + "&y=&plot=short&apikey=trilogy").then(
                function(response) {
                    console.log("Title: ", response.data.Title);
                    console.log("Year: ", response.data.Year);

                    if(response.data.Ratings[0].Value === undefined){
                        console.log("IMDB Rating: Unavailable")
                    }else {
                    console.log("IMDB Rating: ", response.data.Ratings[0].Value);
                    }
                    
                    if(response.data.Ratings[1] === undefined){
                        console.log("Rotten Tomatoes Rating: Unavailable")
                    }else {
                    console.log("Rotten Tomatoes Rating: ", response.data.Ratings[1].Value);
                    }
                    
                    console.log("Country: "+ response.data.Country);
                    console.log("Language: " + response.data.Language);
                    console.log("Plot: " + response.data.Plot);
                    console.log("Actors: " + response.data.Actors);
                    console.log("-----------");


                
                }
              
            )}



    if (verb === "do-what-it-says") {
        var fs = require("fs");
        
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
            return console.log('Error occurred: ' + error);
            }

            var dataArr = data.split(",")
        
            var verb = dataArr[0];
            var noun = dataArr[1];

            liri ();
        });
    }

};