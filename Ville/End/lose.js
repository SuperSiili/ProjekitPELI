'use strict';

fetchResults();
leaderboard();

let screenname;

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

function closeModal() {
  popup.close();
}

//fetching results from SQL
async function fetchResults() {

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
      console.log(results);

      const endBalance = results[0].Saldo;
      console.log(endBalance);

      function nappi(action = closeModal) {
        const dialog = document.getElementById('popup');
        //clear dialog
        while (dialog.firstElementChild) {
          dialog.firstElementChild.remove();
        }
        const popuptext = popup.appendChild(document.createElement('h1'));
        popuptext.innerText = `YOU HAVE LOST THE GAME SUKAAAAAH! You collected total of ${endBalance} euros.`;

        const form = document.createElement('form');
        const button = form.appendChild(document.createElement('button'));
        button.innerText = 'Next';
        button.onclick = action;

        popup.appendChild(button);
        popup.showModal();

        screenname = results[0].screen_name
      }

      nappi();
    } catch (e) {
      console.error(e.message);
    }
  }

  getJson();
}

function reset() {
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
      await fetchJson('http://127.0.0.1:3000/resetall');

    } catch (e) {
      console.error(e.message);
    }
  }
}

async function leaderboard() {
  async function fetchJson(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Invalid input');
      return await response.json();
    } catch (e) {
      console.error(e.message);
    }
  }

  try {
    const leaderboard = await fetchJson(
        'http://127.0.0.1:3000/leaderboard');
    console.log(leaderboard);
    for (let i = 0; i < 10; i++) {
      console.log(leaderboard[i])

      let row = document.createElement("div")
      let left = document.createElement("p")
      let right = document.createElement("p")
      let separator = document.createElement("span")

      left.innerText = (i + 1) + ". " + leaderboard[i][0];
      right.innerText = leaderboard[i][1] + "€";

      left.classList.add("lb-left")
      right.classList.add("lb-right")
      separator.classList.add("separator")

      row.appendChild(left)
      row.appendChild(separator)
      row.appendChild(right)

      row.classList.add("lb-item")

      // changing nickname color if current run is on the leaderboard:
      if (screenname === leaderboard[i][0]) {
        row.classList.add("current-run")
      }

      document.getElementById("leaderboard").appendChild(row)
    }
  } catch (e) {
    console.error(e.message);
  }
}