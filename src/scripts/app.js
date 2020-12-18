const streetNameList = document.querySelector('.streets');
const searchBar = document.querySelector('form');
const nextBusList = document.getElementById("nextBusList")

// API Interaction Functions
function getStreetName(streetSearch) {
  return fetch(`https://api.winnipegtransit.com/v3/streets.json?name=${streetSearch}&usage=long&api-key=W1WB4GcxMZgFV2NvYrCX`
  ).then((response) => response.json());
}

function getAllBusStopsFromStreet(streetKey){
  return fetch(`https://api.winnipegtransit.com/v3/stops.json?street=${streetKey}&api-key=W1WB4GcxMZgFV2NvYrCX`
  ).then((response) => response.json());
}

function getSchedulesFromStop(stopKey) {
  return fetch(`https://api.winnipegtransit.com/v3/stops/${stopKey}/schedule.json?max-results-per-route=2&api-key=W1WB4GcxMZgFV2NvYrCX`)
  .then((response) => response.json())
}

// Methods for UI flow 
function showStreetNames(streetName) {
  getStreetName(streetName)
  .then((streets) => {
    if (streets.streets.length === 0) {
      createStreetNotFoundElement();
    }
    streets.streets.forEach((street) => {
      createStreetElement(street.key, street.name);
    })
  })
  .catch(err => console.log('Request failed', err));
}


function showBusScheduleForStreet(streetKey) {
  getAllBusStopsFromStreet(streetKey)
  .then((stopsArray) => {
    
    stopsArray.stops.forEach((stop) => {
      const busStopKey = stop.key

      getSchedulesFromStop(busStopKey)
      .then((scheduledStopsArray) => {
        scheduledStopsArray["stop-schedule"]["route-schedules"].forEach((schedule) => {
            schedule["scheduled-stops"].forEach((scheduledStops) => {
              createBusStopScheduleElement(
                stop.name, 
                stop["cross-street"].name, 
                stop.direction, 
                schedule.route.number, 
                scheduledStops.times.arrival["scheduled"]);
            });
        });
      })
    });
  });
}

// UI Interaction Methods
function createStreetElement(streetKey, streetName) {
  streetNameList.insertAdjacentHTML(
    "beforeend", 
    `<a href="#" data-street-key="${streetKey}">${streetName}</a>`
  )
}
function createStreetNotFoundElement() {
  streetNameList.insertAdjacentHTML(
    "beforeend", 
    `<a href="#" data-street-key="#">No street with that name was found. Try Again!</a>`
  )
}

function createBusStopScheduleElement(stopName, crossStreet, direction, busNumber, nextBus) {
  nextBusList.insertAdjacentHTML(
    "beforeend", 
    `<tr>
      <td>${stopName}</td>
      <td>${crossStreet}</td>
      <td>${direction}</td>
      <td>${busNumber}</td>
      <td>${nextBus}</td>
    </tr>`
  )
}

// Event Listeners
searchBar.addEventListener('submit', (event) => {
  event.preventDefault()
  streetNameList.innerHTML = "";
  streetSearch = event.target.firstElementChild.value

  showStreetNames(streetSearch);
  
})


streetNameList.addEventListener('click', (event) => {
  event.preventDefault()
  nextBusList.innerHTML = "";
  showBusScheduleForStreet(event.target.getAttribute("data-street-key"))
  
})