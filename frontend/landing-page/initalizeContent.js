let buildings =
[
    {
      "name": "AGSM",
      "rooms_available": 9,
      "building_picture": "./agsm.webp"
    },
    {
      "name": "Ainsworth Building",
      "rooms_available": 16,
      "building_picture": "./ainsworth.webp"
    },
    {
      "name": "Anita B Lawrence Centre",
      "rooms_available": 44,
      "building_picture": "./anitab.webp"
    },
    {
      "name": "Biological Sciences",
      "rooms_available": 6,
      "building_picture": "./biologicalScience.webp"
    },
    {
      "name": "Biological Science (West)",
      "rooms_available": 8,
      "building_picture": "./biologicalScienceWest.webp"
    },
    {
      "name": "Blockhouse",
      "rooms_available": 42,
      "building_picture": "./blockhouse.webp"
    },
    {
      "name": "Business School",
      "rooms_available": 18,
      "building_picture": "./businessSchool.webp"
    },
    {
      "name": "Civil Engineering Building",
      "rooms_available": 8,
      "building_picture": "./civilBuilding.webp"
    },
    {
      "name": "Colombo Building",
      "rooms_available": 5,
      "building_picture": "./colombo.webp"
    },
    {
      "name": "Computer Science & Eng (K17)",
      "rooms_available": 7,
      "building_picture": "./cseBuilding.webp"
    }
]

let mainBody = document.getElementById('main-body');

for (let building of buildings) {
    let buildingObject = document.createElement('div');

    let name = building.name;
    let roomsAvailable = building.rooms_available;
    let imagePath = '../assets' + building.building_picture.substring(1);

    buildingObject.innerHTML = `
        <img src="${imagePath}" alt="${name} image">
            <div class="overlay rooms-avaliable">
                <span class="avaliable-icon"></span>
                ${roomsAvailable} rooms avaliable
            </div>
        <div class="overlay building-name">${name}</div>
    `
    
    buildingObject.className = 'building-container';
        
    console.log(mainBody.innerHTML);

    mainBody.appendChild(buildingObject);
}
