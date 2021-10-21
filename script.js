var priceArray = [
    {
        name: 'weapon_musket',
        sanitized_name: 'Musket',
        price: 400000
    },
    {
        name: 'weapon_rpg',
        sanitized_name: 'RPG',
        price: 500000
    },
    {
        name: 'deluxo',
        sanitized_name: 'Deluxo',
        price: 3000000
    },
    {
        name: 'weapon_hominglauncher',
        sanitized_name: 'Homing Launcher',
        price: 600000
    },
    {
        name: '300_mag',
        sanitized_name: '.300 Magnum',
        price: 60000
    },
    {
        name: 'kevlar',
        sanitized_name: 'Kevlar',
        price: 34000
    },
];
var alreadyDid = [];
const getId = setInterval(() => {
    var weapon = priceArray[~~(Math.random() * priceArray.length)];
    fetch(`http://localhost:3000/api/${weapon.name}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Chromium\"",
                "sec-ch-ua-mobile": "?0"
            },
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors"
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            for (value in json) {
                const item = json[value];
                if (item.price < weapon.price) {
                    var sanitized_price = item.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                    console.log(weapon.sanitized_name, sanitized_price)
                    fetch("https://gtalife/gameMenuAuctionEvent", {
                        "headers": {
                            "accept": "application/json, text/plain, */*",
                            "content-type": "application/json;charset=UTF-8",
                            "sec-ch-ua": "\"Chromium\"",
                            "sec-ch-ua-mobile": "?0"
                        },
                        "referrer": "",
                        "referrerPolicy": "no-referrer-when-downgrade",
                        "body": `{\"type\":\"takeOffer\",\"data\":{\"id\":${item.id},\"sell\":true}}`,
                        "method": "POST",
                        "mode": "cors"
                    });
                    
                }
            }
        });
}, 200);
console.log("interval id = ", getId);