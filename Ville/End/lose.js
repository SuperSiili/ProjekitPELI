'use strict'

//uusien nappien luomiseksi popupin sisään
function newButton(buttonText = 'OK', action = closeModal, bClass = 'ok') {
  const button = document.createElement('button');
  button.innerText = buttonText;
  button.onclick = action;
  button.classList.add(bClass)
  popup.appendChild(button);
}

function userPrompt() {
  const userForm = document.createElement('form');
  userForm.appendChild(document.createElement('input'));
  popup.appendChild(userForm)
  popup.showModal();
}

function closeModal() {
    popup.close();
}

//fetching results from SQL
function fetchResults() {

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

        function nappi(action = closeModal) {
            const dialog = document.getElementById('popup')
            //clear dialog
            while (dialog.firstElementChild) {
                dialog.firstElementChild.remove();
            }
            const popuptext = popup.appendChild(document.createElement('h1'))
            popuptext.innerText = `YOU HAVE LOST THE GAME SUKAAAAAH! You collected total of ${endBalance} euros.`

            const form = document.createElement('form');
            const button = form.appendChild(document.createElement('button'));
            button.innerText = 'Next'
            button.onclick = action;


            popup.appendChild(button);
            popup.showModal()
        }
        nappi()
        } catch (e) {
            console.error(e.message);
        }
    }
    getJson()
}

fetchResults()



