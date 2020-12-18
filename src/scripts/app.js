const getMatchingStreetName = document.querySelector('.streets');
const searchBar = document.querySelector('form');

// API Interaction Functions
function getStreetName(streetSearch) {
  return fetch(`https://api.winnipegtransit.com/v3/streets.json?name=${streetSearch}&usage=long&api-key=W1WB4GcxMZgFV2NvYrCX`
  ).then((response) => response.json());
}

function getStopsFromStreet(streetName) {

}

function ShowStreetNames(streetName) {
  getStreetName(streetName)
  .then((streets) => {
    if (streets.streets.length === 0) {
      createStreetNotFoundElement()
    }
    streets.streets.forEach((street) => {
      createStreetElement(street.key, street.name)
    })
  })
  .catch(err => console.log('Request failed', err));
}


// UI Interaction Methods
function createStreetElement(streetKey, streetName) {
  getMatchingStreetName.insertAdjacentHTML(
    "beforeend", 
    `<a href="#" data-street-key="${streetKey}">${streetName}</a>`
  )
}
function createStreetNotFoundElement() {
  getMatchingStreetName.insertAdjacentHTML(
    "beforeend", 
    `<a href="#" data-street-key="#">No street with that name was found. Try Again!</a>`
  )
}


// Event Listeners
searchBar.addEventListener('submit', (event) => {
  event.preventDefault()
  getMatchingStreetName.innerHTML = "";
  streetSearch = event.target.firstElementChild.value

  ShowStreetNames(streetSearch);
  
  
})

