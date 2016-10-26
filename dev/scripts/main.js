var appSong = {};

appSong.city = ''
appSong.state = ''
appSong.country = ''

//this is the start of everything
//STEP 1
//when user enters city in search field, take value and search in appSong.getMatchingCities
appSong.usersLocation = function(city) {
    $('.cities').hide();

  $('.locationInput').on('submit', function(e) {
    $('.cities').show();
    e.preventDefault();
    var location = $('#autocomplete').val();
    //take the location that the user entered and split into an array
    location = location.split(',')

    console.log(location)
    
    //assigning the answers to different objects
    appSong.city = location[0]
    appSong.state = location[1]
    appSong.country = location[2]
    
    appSong.getMatchingCities(appSong.city);

  });

} //appSong.usersLocation


//STEP 1A autocomplete the input for city selection
appSong.getLocations = function(){
     var autocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('autocomplete')),
      {types: ['geocode']});
     console.log("testing", autocomplete)


} //appSong.getLocations


//STEP 2
//returns list of cities that match query name
appSong.getMatchingCities = function (city) {
  $.ajax ({
    // console.log('appSong.getMetro', arguments);
    url: 'http://api.songkick.com/api/3.0/search/locations.json',
    method: 'GET',
    dataType: 'json',
    data: {
      query: city,
      apikey: 'hHSjLHKTmsfByvxU'
    }
  }).then(function(metroLocation) {
    metroLocation = metroLocation.resultsPage.results.location
    //gives appSong.displayLocation the results
    appSong.matchLocations(metroLocation);
    console.log('appSong.getMatchingCities', metroLocation);
  });
}


//STEP 3
appSong.matchLocations = function(matchLocations) {

  if (appSong.city === matchLocations.displayName && appSong.country === matchLocations.country.displayName) {
    return matchLocations.id
  } else {
    alert('No matching location');
  }
  console.log('matchLocations', matchLocations.id)
}


//STEP 4
// returns the metro ID of the user selected city
appSong.getMetroId = function(metroID) {
  $.ajax ({
    url: `http://api.songkick.com/api/3.0/metro_areas/${metroID}/calendar.json`,
    method: 'get',
    dataType: 'json',
    data: {
      apikey: 'hHSjLHKTmsfByvxU'
    }
  }).then(function(bandReturn) {
    bandReturn = bandReturn.resultsPage.results.event
    appSong.displayConcerts(bandReturn)
    console.log('return bands playing', bandReturn)
  });
}


//STEP 5
appSong.findConcerts = function(findConcerts) {
// find concerts that are in the same metroID area as was indicated based on above
  $('.cities').on('submit', function(e) {
    e.preventDefault();
    // when the user submits the location (the 'specific Toronto', take the value of the radio button
    //put it into the metroID search to return concert listings within that area
    var usersMetroId = $("input[type=radio]").val()
    console.log("users metroID", usersMetroId)
    appSong.getMetroId(usersMetroId);
  });
}


//STEP 6
appSong.displayConcerts = function(concertsPlaying) {
//take the concert results and display the concert name and bands involved at the concert
  concertsPlaying.forEach(function(concertInfo) {

    var $concertResults = $('<article>').addClass('concertResults')
    var $concertName = $('<h2>').text(concertInfo.displayName)
    
    $concertResults.append($concertName)

    var $bandFilter = concertInfo.performance

      $bandFilter.forEach(function(bandFilter) {
        var $bandForm = $('<form>')
        var $bandNames = $('<input>').attr({
            value: bandFilter.displayName,
            name: "bandNames",
            type: "radio",
            id: bandFilter.displayName
          });
        var $bandLabel = $('<label>').text(bandFilter.displayName).attr({
            for: bandFilter.displayName
          });
        $bandForm.append($bandNames, $bandLabel)
        $concertResults.append($bandForm)

      })

    $('.bandSelection').append($concertResults)

  });

  appSong.matchBands(concertsPlaying)

}

//STEP 7 - take band picked
appSong.matchBands = function(matchBands) {

  $('.concertResults').on('submit', function(e) {
    e.preventDefault();
    var bandPicked = $('input[type=radio]').val()

  });

  appSong.getSpotify(bandPicked)

} //appSong.matchBands

//STEP 8 - match bands to spotify
appSong.getSpotify = function(artisit) {
  $.ajax ({
    url: 'https://api.spotify.com/v1/search',
    method: 'GET',
    dataType: 'json',
    data: {
      q: artisit,
      type: 'playlist',
      limit: 3,
      client_id: 'd3dc1222c5184993bddad0fa6b53fbf4',
      client_secret: 'c6461a15139446c6aea0b5854cd1f8ce'
    }
  }).then(function(playlists) {
    playlists = playlists
    console.log('Spotfiy', playlists)
  });
} //appSong.getSpotify

//STEP 9 - display playlist 
// appSong.displayPlaylist = function(displayPlaylist) {

//   displayPlaylist.forEach(function(showingPlaylists) {

//   })

// } //displayPlaylist
// 

//take the matching metro id and enter into getMetroID

//then display the concerts in that metro id
appSong.init = function() {
  appSong.getLocations();
  appSong.usersLocation();
}

$(function() {
  appSong.init()
});




//STEP 3 --- might not need -- filtering auto complete
// appSong.displayLocation = function(displayLocation) {
// //display matching cities and have user select the correct one 
// //displays the cities that match what the user inputting
//   //$('.cities').empty();

// //creates the radio buttons
// //take the results of what they've inputted and use it to find the metroID
// //creates a radio button for each possible result based on the name of the location

//   displayLocation.forEach(function(locationChoice) {
//     var $radioButtonsCity = $('<input>').attr({
//       value: locationChoice.metroArea.id, 
//       name: "locationChoice", 
//       type: "radio",
//       id: locationChoice.metroArea.id
//     })
//     var $radioLabel = $('<label>').text(locationChoice.city.displayName + ', ' + locationChoice.city.country.displayName).attr({
//       for: locationChoice.metroArea.id
//     })
// // appends the options to the page in the form of radio buttons
//     $('.cities').append($radioButtonsCity, $radioLabel);

//   });

//   console.log('drop down cities', displayLocation)
// // takes the results from the location search and passes it along to the concert search
//   appSong.findConcerts(displayLocation)
// }