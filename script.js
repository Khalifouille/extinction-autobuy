var priceArray = [
    { name: 'weapon_musket', sanitized_name: 'Musket', price: 400000 },
    { name: 'weapon_rpg', sanitized_name: 'RPG', price: 500000 },
    { name: 'deluxo', sanitized_name: 'Deluxo', price: 3000000 },
    { name: 'weapon_hominglauncher', sanitized_name: 'Homing Launcher', price: 600000 },
    { name: '300_mag', sanitized_name: '.300 Magnum', price: 60000 },
    { name: 'kevlar', sanitized_name: 'Kevlar', price: 34000 },
];

var alreadyDid = [];
const corsProxy = "https://cors-anywhere.herokuapp.com/";

async function fetchData() {
    try {
        const weapon = priceArray[~~(Math.random() * priceArray.length)];
        const response = await fetch(`${corsProxy}http://localhost:3000/api/${weapon.name}`, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Chromium\"",
                "sec-ch-ua-mobile": "?0"
            },
            method: "GET",
            mode: "cors"
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const json = await response.json();
        for (let value in json) {
            const item = json[value];
            await fetch(`${corsProxy}https://gtalife/gameMenuAuctionEvent`, {
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "content-type": "application/json;charset=UTF-8",
                    "sec-ch-ua": "\"Chromium\"",
                    "sec-ch-ua-mobile": "?0"
                },
                body: JSON.stringify({
                    "type": "takeOffer",
                    "data": { "id": item.id, "sell": false }
                }),
                method: "POST",
                mode: "cors"
            });

            const marketResponse = await fetch(`${corsProxy}https://api.gtaliferp.fr:8443/v1/extinction/marketplace/sell/${weapon.name}`);
            if (!marketResponse.ok) {
                throw new Error(`Erreur HTTP: ${marketResponse.status}`);
            }

            const marketData = await marketResponse.json();
            if (marketData.length > 0) {
                const marketPrice = marketData[0].price;
                if (item.price !== marketPrice) {
                    const adjustedPrice = marketPrice - 1;
                    console.log(`${weapon.sanitized_name} : Prix ajusté du marché: ${adjustedPrice}`);
                    await fetch(`${corsProxy}https://gtalife/gameMenuAuctionEvent`, {
                        headers: {
                            "accept": "application/json, text/plain, */*",
                            "content-type": "application/json;charset=UTF-8",
                            "sec-ch-ua": "\"Chromium\"",
                            "sec-ch-ua-mobile": "?0"
                        },
                        body: JSON.stringify({
                            "type": "createOffer",
                            "data": {
                                "offer": {
                                    "itemId": weapon.name,
                                    "itemName": weapon.sanitized_name,
                                    "quantity": 1,
                                    "price": adjustedPrice
                                },
                                "sell": true
                            }
                        }),
                        method: "POST",
                        mode: "cors"
                    });
                }
            }
        }
    } catch (error) {
        console.error("Erreur :", error);
    }
}

const intervalId = setInterval(fetchData, 200);
console.log("Interval ID =", intervalId);