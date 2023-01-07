'use strict';

function closeModal() {
  popup.close();
}

//uusien nappien luomiseksi popupin sisään
function newButton(buttonText = 'OK', action = closeModal, bClass = 'ok') {
  const button = document.createElement('button');
  button.innerText = buttonText;
  button.onclick = action;
  button.classList.add(bClass);
  popup.appendChild(button);
}

function userPrompt() {
  const userForm = document.createElement('form');
  userForm.appendChild(document.createElement('input'));
  popup.appendChild(userForm);
  popup.showModal();
}

//Setting leaflet
const map = L.map('map').setView([59.734, 21.797], 5);

// making center map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const FlaskUrl = 'http://127.0.0.1:3000/airport/';

//when clicked on marker 'Click to fly' runs this function
function markerEvent() {

  const targetMarker = document.querySelector('.leaflet-popup-content');
  //Clearing marker not working yet
  //while (targetMarker.firstElementChild) {
  //targetMarker.firstElementChild.remove();
  //}
  document.getElementById('popupContent').querySelector('button').style.display = 'none'

  const icao = targetMarker.innerText[0] + targetMarker.innerText[1] +
      targetMarker.innerText[2] + targetMarker.innerText[3];
  const p = targetMarker.appendChild(document.createElement('p'));
  const p2 = targetMarker.appendChild(document.createElement('p'));
  const p3 = targetMarker.appendChild(document.createElement('p'));
  const p4 = targetMarker.appendChild(document.createElement('p'));
  p.innerText = 'Landed pretty much safely.';
  p2.innerText = 'Now time to sell some stuff you got with ya';
  p3.innerText = 'Roheiini: Earn 800€, 40% chance to get caught'
  p4.innerText = 'PBK: Earn 200€, 20% chance to get caught'

  //function run order
  flight();
  sellEvt();


//flight code to next place
  function flight() {
    try {
      const updateIcao = fetch('http://127.0.0.1:3000/fly/' + icao);
      console.log(updateIcao)

    } catch (e) {
      console.error(e.message);
    }
  }

  function sellEvt(action = sellOrLose) {
    //create product form
    const form = targetMarker.appendChild(document.createElement('form'));
    //create produc section
    const select = form.appendChild(document.createElement('select'));
    select.setAttribute('id', 'selectProduct');
    select.innerText = 'Choose a product to sell!';
    //create product options
    const option1 = select.appendChild(document.createElement('option'));
    const option2 = select.appendChild(document.createElement('option'));
    //const option3 = select.appendChild(document.createElement('option'));
    option1.innerText = 'Roheiini';
    option2.innerText = 'PBK';
    //option3.innerText = 'Currently no more products';
    //create product button
    const input = form.appendChild(document.createElement('input'));
    input.setAttribute('id', 'Sellbutton');
    input.setAttribute('type', 'button');
    input.setAttribute('value', 'Sell the item');
    input.onclick = action;
  }

  //Function for selling / getting caught
  function sellOrLose() {
    const selectValue = document.getElementById('selectProduct').value;
    product = selectValue;
    console.log(selectValue);

    async function fetchJson(url, options = {}) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Invalid input');
        return await response.json();
      } catch (e) {
        console.error(e.message);
      }
    }

    async function getJson() {
      try {
        const results = await fetchJson(
            'http://127.0.0.1:3000/sell/' + selectValue);
        console.log(results);

        const answer = results[0].answer;
        console.log(answer);

        if (answer === 'yes') {
          Lose();
        } else if (answer === 'no') {
          Sell();
        }

      } catch (e) {
        console.error(e.message);
      }
    }

    getJson();
  }

}

function Lose() {
  //Clear dialog, clear marker
  const targetMarker = document.querySelector('.leaflet-popup-content');
  while (targetMarker.firstElementChild) {
    targetMarker.firstElementChild.remove();
  }
  const dialog = document.getElementById('popup');
  while (dialog.firstElementChild) {
    dialog.firstElementChild.remove();
  }
  //create something to pop up
  location.replace('../End/lose.html');

}

let product = 'empty';

function Sell() {

  //clear dialog, clear marker/*
  const targetMarker = document.querySelector('.leaflet-popup-content');
  while (targetMarker.firstElementChild) {
    targetMarker.firstElementChild.remove();
  }
  const dialog = document.getElementById('popup');
  while (dialog.firstElementChild) {
    dialog.firstElementChild.remove();
  }

  congratulations();

  function congratulations(text, action = closeModal) {
    const dialog = document.getElementById('popup');
    //clear dialog
    while (dialog.firstElementChild) {
      dialog.firstElementChild.remove();
    }
    const popuptext = popup.appendChild(document.createElement('h1'));
    if (product === 'Roheiini') {
      popuptext.innerText = 'Congratulations, you have sold Roheiini for 800€.';
    } else if (product === 'PBK') {
      popuptext.innerText = 'Congratulations, you have sold PBK for 200€.';
    }

    const form = document.createElement('form');
    const button = form.appendChild(document.createElement('button'));
    button.innerText = 'Next';
    button.onclick = action;

    console.log(product);
    popup.appendChild(button);
    popup.showModal();

  }
  updateBalance()

}

// creating markers from all big airports in SQL, setting click function to them, airport name and icao
function createMarkers() {

  async function fetchJson(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Invalid input');
      return await response.json();
    } catch (e) {
      console.error(e.message);
    }
  }

  async function getJson() {
    try {
      const largeAirports = await fetchJson(FlaskUrl + 'large');

      for (let i in largeAirports) {
        //making variables for name,latitude and longitude
        const name = largeAirports[i].name;
        const lat = largeAirports[i].latitude_deg;
        const long = largeAirports[i].longitude_deg;
        const icao = largeAirports[i].gps_code;

        //creating markers
        const flyButton = document.createElement('button');
        flyButton.onclick = markerEvent;
        flyButton.innerText = 'Click to fly here';
        flyButton.id='fly-button'

        let popupContent = document.createElement('span');
        popupContent.innerText = icao + '\n' + name + '\n'
        popupContent.id = 'popupContent'
        popupContent.appendChild(flyButton);
        const marker = L.marker([lat, long]).addTo(map);
        markerCreation();

        function markerCreation() {
          marker.bindPopup(popupContent).openPopup;
        }
      }
    } catch (e) {
      console.error(e.message);
    }

  }
  getJson();
}

//kaupan piilottaminen/näyttäminen:
const hideButton = document.getElementById('hide-button');
const sidebar = document.getElementById('sidebar');
//const htmlMain = document.querySelector('main');
let sidebarHidden = false;
hideButton.addEventListener('click', function(evt) {
  if (sidebarHidden === false) {
    sidebar.style.display = 'none';
    hideButton.innerText = '<<';
    sidebarHidden = true;
  } else if (sidebarHidden === true) {
    sidebar.style.display = 'flex';
    hideButton.innerText = '>>';
    sidebarHidden = false;
  }
});

// Shop codes --------------------------------------------------------------------------------

createShop();

function createShop(
    action1 = shop1, action2 = shop2, action3 = shop3, action4 = shop4,
    action5 = shop5) {

  const div = document.getElementById('sidebar');
  const form = div.appendChild(document.createElement('form'));

  const title = form.appendChild(document.createElement('h2'));
  title.innerText = 'Shop';

  const button1 = form.appendChild(document.createElement('button'));
  button1.setAttribute('id', 'button1');
  button1.setAttribute('type', 'button');
  button1.onclick = action1;
  button1.innerText = 'Jogging Shoes 200€';
  const p1 = form.appendChild(document.createElement(
      'p')).innerText = 'Jogging shoes for running.(-10% to get caught)';

  const button2 = form.appendChild(document.createElement('button'));
  button2.setAttribute('id', 'button2');
  button2.setAttribute('type', 'button');
  button2.onclick = action2;
  button2.innerText = 'Better Packing 500€';
  const p2 = form.appendChild(document.createElement(
      'p')).innerText = 'Better packing for less smell and more cover.(-20% to get caught)';

  const button3 = form.appendChild(document.createElement('button'));
  button3.setAttribute('id', 'button3');
  button3.setAttribute('type', 'button');
  button3.onclick = action3;
  button3.innerText = 'Suitcase 800€';
  const p3 = form.appendChild(document.createElement(
      'p')).innerText = 'Suitcase with secret pocket, to hide products.(-40% to get caught)';

  const button4 = form.appendChild(document.createElement('button'));
  button4.setAttribute('id', 'button4');
  button4.setAttribute('type', 'button');
  button4.onclick = action4;
  button4.innerText = 'Quality 400€';
  const p4 = form.appendChild(document.createElement(
      'p')).innerText = 'Products have better quality.(+20% profit)';

  const button5 = form.appendChild(document.createElement('button'));
  button5.setAttribute('id', 'button5');
  button5.setAttribute('type', 'button');
  button5.onclick = action5;
  button5.innerText = 'Overall Quality Control 600€';
  const p5 = form.appendChild(document.createElement(
      'p')).innerText = 'Progressive quality control of the products.(20% profit)';

}

//joggers
function shop1() {
  getJson();


  async function fetchJson(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Invalid input');
      return await response.json();
    } catch (e) {
      console.error(e.message);
    }
  }

  async function getJson() {
    try {
      const results = await fetchJson(
          'http://127.0.0.1:3000/shop/' + 'joggers');
      console.log(results);

      const answer = results[0].answer;
      console.log(answer);

      if (answer === 'yes') {
        buttonSell();
        updateBalance();
      } else if (answer === 'no') {
        buttonFail();
      }


    } catch (e) {
      console.error(e.message);
    }
  }

}

//packing
function shop2() {
  getJson();


  async function fetchJson(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Invalid input');
      return await response.json();
    } catch (e) {
      console.error(e.message);
    }
  }

  async function getJson() {
    try {
      const results = await fetchJson(
          'http://127.0.0.1:3000/shop/' + 'packing');
      console.log(results);

      const answer = results[0].answer;
      console.log(answer);

      if (answer === 'yes') {
        while (popup.firstElementChild) {
          popup.firstElementChild.remove();
        }
        buttonSell();
        updateBalance();
      } else if (answer === 'no') {
        buttonFail();
      }

    } catch (e) {
      console.error(e.message);
    }
  }
}

//suitcase
function shop3() {
  getJson();


  async function fetchJson(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Invalid input');
      return await response.json();
    } catch (e) {
      console.error(e.message);
    }
  }

  async function getJson() {
    try {
      const results = await fetchJson(
          'http://127.0.0.1:3000/shop/' + 'suitcase');
      console.log(results);

      const answer = results[0].answer;
      console.log(answer);

      if (answer === 'yes') {
        while (popup.firstElementChild) {
          popup.firstElementChild.remove();
        }
        buttonSell();
        updateBalance();
      } else if (answer === 'no') {
        buttonFail();
      }

    } catch (e) {
      console.error(e.message);
    }
  }
}

//Total quality
function shop4() {
  getJson();


  async function fetchJson(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Invalid input');
      return await response.json();
    } catch (e) {
      console.error(e.message);
    }
  }

  async function getJson() {
    try {
      const results = await fetchJson(
          'http://127.0.0.1:3000/shop/' + 'quality');
      console.log(results);

      const answer = results[0].answer;
      console.log(answer);

      if (answer === 'yes') {
        while (popup.firstElementChild) {
          popup.firstElementChild.remove();
        }
        buttonSell();
        updateBalance();
      } else if (answer === 'no') {
        buttonFail();
      }

    } catch (e) {
      console.error(e.message);
    }
  }
}

//quality control
function shop5() {
  getJson();


  async function fetchJson(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Invalid input');
      return await response.json();
    } catch (e) {
      console.error(e.message);
    }
  }

  async function getJson() {
    try {
      const results = await fetchJson(
          'http://127.0.0.1:3000/shop/' + 'qualityc');
      console.log(results);

      const answer = results[0].answer;
      console.log(answer);

      if (answer === 'yes') {
        while (popup.firstElementChild) {
          popup.firstElementChild.remove();
        }
        buttonSell();
        updateBalance();
      } else if (answer === 'no') {
        buttonFail();
      }


    } catch (e) {
      console.error(e.message);
    }
  }

}

//update cash balance

function updateBalance() {

  async function fetchJson(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Invalid input');
        return await response.json();
    } catch (e) {
        console.error(e.message);
    }
  }
  async function getJson() {
        try {
            const results = await fetchJson('http://127.0.0.1:3000/results');
            console.log(results)

            const endBalance = results[0].Saldo
            console.log(endBalance)

        function updateB() {
          if (endBalance === 'null') {
            const h2Element = document.getElementById('totalmoney');
            h2Element.innerText = 'Current balance: 0€';
          }
          else {
            const h2Element = document.getElementById('totalmoney');
            h2Element.innerText = 'Current balance: ' + endBalance + '€';
          }
        }

        updateB();

        } catch (e) {
            console.error(e.message);
        }
  }
  getJson();
}

// close buttons for shop
function buttonSell(action = closeModal) {
  const dialog = document.getElementById('popup');
  //clear dialog
  while (dialog.firstElementChild) {
    dialog.firstElementChild.remove();
  }
  const popuptext = popup.appendChild(document.createElement('h1'));
  popuptext.innerText = `Product bought`;

  const form = document.createElement('form');
  const button = form.appendChild(document.createElement('button'));
  button.innerText = 'Next';
  button.onclick = action;


  popup.appendChild(button);
  popup.showModal();
}

function buttonFail(action = closeModal) {
  const dialog = document.getElementById('popup');
  //clear dialog
  while (dialog.firstElementChild) {
    dialog.firstElementChild.remove();
  }
  const popuptext = popup.appendChild(document.createElement('h1'));
  popuptext.innerText = `NOT ENOUGHT FYRGYLÄ TO BUY THIS PRODUCT`;

  const form = document.createElement('form');
  const button = form.appendChild(document.createElement('button'));
  button.innerText = 'Next';
  button.onclick = action;


  popup.appendChild(button);
  popup.showModal();
}

