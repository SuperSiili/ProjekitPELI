'use strict';



//url to flask
const FlaskUrl = 'http://127.0.0.1:3000/username/';

const popup = document.getElementById('popup');

function closeModal() {
    popup.close();
}



//function to login modal
function closeStartModal() {
    const userName = document.querySelector('#username').value;



    Username()
    //adding username to SQL and resetting country to helsinki vantaa
    function Username() {
        async function createUsername() {
            try {
                const addName = await fetch(FlaskUrl + userName);
                console.log(addName);

                const resetICAO = await fetch('http://127.0.0.1:3000/reset/' + userName);
                console.log(resetICAO);

            } catch (e) {
                console.error(e.message);
            }
        }
        //create or use already found one
        createUsername()
    }

    //if empty for username
    if (userName === '') {
        //clear the feed
        document.querySelector('p').remove();
        //creates Error message
        const form = document.createElement('form');
        const p = form.appendChild(document.createElement('p'));
        p.innerText = "Can't leave the username empty";
        popup.appendChild(p);
    }
    //if username is given, continues to the tutorial
    else if (userName !== '') {
        //clean up popups
        const dialog = document.getElementById('popup')
        while (dialog.firstElementChild) {
            dialog.firstElementChild.remove();
        }
        popup.close();
        preTutorial()
    }

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

//----------------------------------------------------------------------------------------------------

// START OF THE GAME
// if we want some start up pop up
function Startup(startText, action= closeModal, startClass = 'startup') {
    //const welcome = document.createElement('h2')
    //const startImg = document.createElement('img');
    //welcome.innerHTML = 'Welcome to the Smuggling Simulator!'
    //startImg.src = '/Ryhmätehtävä/Tarvittavat/java/smugg.png'



    //const button = document.createElement('button');
    //button.innerText = startText;
    //button.onclick = action;
    //button.classList.add(startClass)

    //popup.appendChild(startImg)
    //popup.appendChild(welcome)
    //popup.appendChild(button)
    //popup.showModal();

}
// creating start dialog
//const div = document.getElementById('start');
//const startUpDialog = div.appendChild(document.createElement('dialog'));
//startUpDialog.setAttribute('id', 'startDialog');

// creating button inside the start dialog
function startButton(buttonText, action = login, bClass = 'ok') {

    const div = document.getElementById('start');
    const startButton = div.appendChild(document.createElement('button'))
    startButton.innerText = 'CLICK HERE TO START THE SMUGGLING';
    startButton.onclick = action;
    startButton.classList.add(bClass)
}

//creating login function
function login(loginText, action = closeStartModal) {
    //clear the popups (dialog)
    const dialog = document.getElementById('popup');
    while (dialog.firstElementChild) {
        dialog.firstElementChild.remove();
    }


    const text = document.createElement('h1');
    text.innerHTML = 'Please choose a nickname, or play with an existing one'

    const form = document.createElement('form');
    const input1 = form.appendChild(document.createElement('input'));
    const input2 = form.appendChild(document.createElement('input'));

    input1.setAttribute('id', 'username');
    input1.setAttribute('name', 'user');
    input1.setAttribute('type', 'text');
    input1.setAttribute('placeholder', 'your username');

    input2.setAttribute('id', 'startbutton');
    input2.setAttribute('type', 'submit');
    input2.setAttribute('value', 'Log in or continue');
    input2.onclick = action;


    popup.appendChild(text);
    popup.appendChild(input1);
    popup.appendChild(input2);
    popup.showModal();

}

// creating tutorial choose yes or no funktions

//function to play tutorial
function playTutorial() {
    location.replace('./Tutorial/tutorial.html')
}

//functio to the Game
function toTheGame() {
    location.replace('./game/thegame.html')
}

// pretutorial function creation
function preTutorial(action = playTutorial, action2 = toTheGame) {


    const text = document.createElement('h1');
    text.innerHTML = 'DO YOU WANT TO START THE GAME?'

    const form = document.createElement('form');
    //const button1 = form.appendChild(document.createElement('button'));
    const button2 = form.appendChild(document.createElement('button'));
    //yes button
    //button1.setAttribute('id', 'tutorial');
    //button1.innerText = 'Yes, ofcourse!';
    //button1.onclick = action;
    //no button
    button2.setAttribute('id', 'notutorial');
    button2.innerText = 'Heeeeell yeah man!';
    button2.onclick = action2;

    popup.appendChild(text);
    //popup.appendChild(button1);
    popup.appendChild(button2);
    popup.showModal();

}


//Tutorial script
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

//adding username to the SQL and checking if it exists



startButton();

// end of the start of the game of the ----------------------------------------------------------------------------------------------