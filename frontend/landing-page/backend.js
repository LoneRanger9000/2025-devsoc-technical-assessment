const logoContainer = document.getElementById('freerooms-logo-container');
const logoImg = document.getElementById('door-logo')

let clickCounter = 0;

logoContainer.addEventListener('click', () => {
    clickCounter++;

    if (clickCounter % 2 === 0) {
        logoImg.src = '../assets/openDoor.png';
    } else {
        logoImg.src = '../assets/freeroomsDoorClosed.png';
    }
});
