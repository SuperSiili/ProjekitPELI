'use strict'

function closeModal() {
    popup.close();
}

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




const map = L.map('map').setView([59.734, 21.797], 5)

// making center map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = L.marker([60.3219, 24.9441]).addTo(map);
const Toimii = 'toimii';

marker.bindPopup("<b>Helsinki Vantaa</b><br><button id='button' onclick='console.log(Toimii)'>Click to Fly</button>");



function Tutorial() {
    //setting inner html to the dialog
    const dialog = document.getElementById('popup');
    dialog.innerHTML = 'Tervetuloa Tutorialiin';
    //creating new closing for modal (popup doesnt register??)
    function closeModal() {
        dialog.close();
    }
    //calling for random shitty function
    popup('random testi');
    function popup(buttonText, action = closeModal) {
        const button = dialog.appendChild(document.createElement('button'));
        const userForm = dialog.appendChild(document.createElement('form'));
        userForm.appendChild(document.createElement('input'));
        button.innerText = buttonText;
        button.onclick = action;

        dialog.appendChild(button);
        dialog.appendChild(userForm)
        dialog.showModal();
    }
}


userPrompt()
newButton('Next')