/*
  Very strange behaviour, read on immutability when wifi is back LOL
*/
const user10 = Object.freeze({
  id: 10,
  name: 'Clementina DuBuque',
  username: 'Moriah.Stanton',
  email: 'Rey.Padberg@karina.biz',
  address: Object.freeze({
    street: 'Kattie Turnpike',
    suite: 'Suite 198',
    city: 'Lebsackbury',
    zipcode: '31428-2261',
    geo: Object.freeze({
      lat: '-38.2386',
      lng: '57.2232'
    })
  }),
  phone: '024-648-3804',
  website: 'ambrose.net',
  company: Object.freeze({
    name: 'Hoeger LLC',
    catchPhrase: 'Centralized empowering task-force',
    bs: 'target end-to-end models'
  })
})

export const users = Object.freeze([user10])

// addressChanges è un oggetto che contiene una o più proprietà di Address da cambiare, ad esempio { city: London }
// Restituire l'array di utenti con le proprietà cambiate, mantenendo invariate quelle non presenti in addressChanges
export const changeUsersAddress = (users, addressChanges) => {
  //Map??!
  return users.map(user =>{
    const newUser = Object.assign({},user);
    const changedAddress = Object.assign({},user["address"]);
    for(const key in addressChanges){
      changedAddress[key] = addressChanges[key]
    }
    newUser["address"] = Object.assign({},changedAddress)
    return newUser;
  })
}

// Restituire l'array di utenti senza geo in address
export const removeAddressCoordinates = (users) => {
  let newUsers = [];
  let newUser = {};
  users.forEach(user => {
    newUser = Object.assign({},user);
    let changedAddress = Object.assign({},user["address"]);
    delete changedAddress["geo"];
    newUser["address"] =Object.assign({},changedAddress)
    newUsers.push(newUser)

  });
  return newUsers;
}

// Restituire l'array di utenti senza company
export const removeCompanyInfo = (users) => {
  let newUsers = [];
  let newUser = {};
  users.forEach(user => {
    newUser = Object.assign({},user);
    delete newUser["company"]
    newUsers.push(newUser)

  });
  return newUsers;
}

// Restituire newUser a users e restituire l'array
export const addNewUser = (users, newUser) => {
  let newUsers = [];
  users.forEach(user =>{
    newUsers.push(user);
  })
  newUsers.push(newUser);
  return newUsers;
}

// Restituire l'array di utenti con lat e lng dentro geo convertiti in numero, non stringa
export const convertUsersGeoToNumber = (users) => {
  let newUsers = [];
  let newUser = {};
  users.forEach(user => {
    
    let newGeo = Object.assign({},user["address"]["geo"])
    for(let key in newGeo){
      
      newGeo[key] = Number(user["address"]["geo"][key])
    }
    let newAddress = Object.assign({},user["address"]);
    newAddress["geo"] = newGeo;
    newUser = {...user, address: newAddress}
    newUsers.push(newUser)

  });
  return newUsers;
}
