

export const newProductPayload={

    
    "id": Date.now(),  // unique id
    "title": "pen-" + Math.floor(Math.random() * 1000),
    "price": Math.floor(Math.random() * 500) + 100,
    "description": "automation product " + Date.now(),
    "category": "stationary",
    "image": "http://example.com/" + Date.now()

}