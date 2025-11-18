// run tests by going in intro-3 and running npm test 
// Advice: NO else, avoid nested fors, use more methods, avoid returning the initial array
// Advice 2: array functions like map/reduce; const for objects and arrays that do not get reassigned
// Advice 2 2: spread operators for immutability?

// Duplicare l'array
export function cloneArray(array) {
    return [...array];
}

// Inserire l'elemento alla fine
export function addToArrayEnd(array, newElement) {
    return [...array, newElement];
}

// Inserire l'elemento all'inizio
export function addToArrayBeginning(array, newElement) {
    return [newElement, ...array]
}

// Inserire l'elemento all'indice specificato
// Se l'indice è negativo, inserirlo all'inizio dell'array
// Se l'indice è superiore alla lunghezza dell'array, inserirlo alla fine
export function insertIntoArray(array, newElement, index) {
    if (index < 0){
        return addToArrayBeginning(array,newElement);
    }
    if(index >(array.length)){
        return addToArrayEnd(array,newElement)
    }
    let retArray = [...array];
    retArray.splice(index,0,newElement);
    return retArray;
    
}

// Dato un array di oggetti, trovare l'elemento in base a `condition`
// `condition` è un oggetto tipo { id: 46 } o { name: 'Anna' }
// Nel primo caso `findBy` deve restituire il primo elemento che ha un id uguale a 46;
// nel secondo caso il primo elemento che ha name uguale ad Anna
// Restituire null se non viene trovato nulla
export function findBy(array, condition) {
    return array.find(object => object[Object.keys(condition)[0]] == Object.values(condition)[0]) ?? null
}

// Come `findBy`, ma restituisce tutti gli elementi per i quali `condition` risulta vera
// Se per nessun elemento risulta vera, restituire un array vuoto
export function filterBy(array, condition) {
    return array.filter(object => object[Object.keys(condition)[0]] == Object.values(condition)[0])
}

// Dato un array e un elemento, se l'elemento non è presente nell'array va inserito alla fine
// Se l'elemento è già presente, va rimosso
export function toggleArrayItem(array, element) {
    
    const foundIndex = array.findIndex((item => item == element))
    if(foundIndex == -1 ){
        return addToArrayEnd(array,element)
    }
    let retArray = cloneArray(array)
    retArray.splice(foundIndex,1);
    return retArray;
}

// Rimuove dall'array l'elemento all'indice specificato
// Se l'indice è superiore o inferiore alla lunghezza dell'array, restituire l'array originale
export function removeFromArray(array, index) {
    return (index < 0 || index >= array.length) ? array : array.filter((_,arrIndex) => index !== arrIndex)
}

// Dati 2 o più array, unirli in un unico array
export function mergeArrays(...arrays) {
    return [].concat(...arrays);
}

// Dati 2 o più array, unirli in un unico array, ma rimuovere eventuali duplicati
export function mergeArraysUnique(...arrays) {
    return [...new Set (mergeArrays(...arrays))]
}

// Dato un array di oggetti, una chiave e una direzione (ASC | DESC), ordinare l'array in base ai valori della chiave specificata
// Se `direction` è ASC l'ordine deve essere ascendente, se è DESC discendente
// Es.: [{ age: 44, name: 'Mary' }, { age: 22, name: 'John' }, { age: 31, name: 'Mark' }] con chiave age e direction DESC
// restituisce [{ age: 44, name: 'Mary' }, { age: 31, name: 'Mark' }, { age: 22, name: 'John' }]
// Nota: `key` farà sempre riferimento a valori numerici

export function sortBy(array, key, direction) {
    let retArray = cloneArray(array)
    return (direction == 'ASC') 
    ? retArray.sort(function(a,b){return a[key]-b[key]}) 
    : retArray.sort(function(a,b){return b[key]-a[key]})
}

// Dato un array di oggetti, convertirlo in oggetto e usare come chiave il valore di `key`
// Es.: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] con key = 'name' deve restituire
// { A: { id: 1, name: 'A' }, B: { id: 2, name: 'B' } }
export function keyBy(array, key) {
    const obj = {}
    for(const element of array){
        obj[element[key]] = element
    }
    return obj
}

// Dato un array, inserire il nuovo elemento all'indice specificato, sostituendo quello che c'è già
export function replaceItemAtIndex(array, newItem, index) {
    let newArray = cloneArray(array);
    newArray[index] = newItem;
    return newArray;
}

// Dato un array di oggetti, aggiungere a ogni oggetto le proprietà specificate
// Es.: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] con properties { city: 'X', number: 99 }
// deve restituire [{ id: 1, name: 'A', city: 'X', number: 99  }, { id: 2, name: 'B', city: 'X', number: 99 }]
// L'array originale e i suoi elementi non devono essere modificati
export function addExtraProperties(array, properties) {   
    return array.map(element => Object.assign({}, element, properties))
}

// Dato un array di oggetti rimuovere da ciascuno di essi le proprietà specificate
// Es.: [{ id: 1, name: 'A', city: 'X', state: 'Y' }] con properties ['city', 'state']
// deve restituire [{ id: 1, name: 'A' }]
// L'array originale e i suoi elementi non devono essere modificati
export function removeProperties(array, properties) {
    const newObj = {}
    for(const key of properties){
        newObj[key] = undefined
    }
    return addExtraProperties(array,newObj)
}

// Dato un array di oggetti con una chiave id e un array di id selezionati,
// restituire un nuovo array in cui gli elementi selezionati hanno la proprietà `selected`= true
// Es.: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }] e selectedIds = [2, 3]
// deve restituire [{ id: 1, name: 'A' }, { id: 2, name: 'B', selected: true }, { id: 3, name: 'C', selected: true }]
// L'array originale e i suoi elementi non devono essere modificati
export function setSelected(array, selectedIds) {
    return array.map(element => {
        let newElement = Object.assign({}, element)
        if(selectedIds.includes(newElement["id"])){
            newElement["selected"] = true
        }
        return newElement;
    })
}

// Dato un array di oggetti, rimapparlo estraendo la chiave specificata
// Es.: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }] con chiave 'name'
// deve restituire ['A', 'B', 'C']
// Se la chiave non esiste, restituire l'array originale
export function mapTo(array, key) {
    return (array.every((object) => object.hasOwnProperty(key))) ? array.map((element) => element[key]) : array
}

// Dato un array di oggetti e una funzione `predicate`, eseguire la funzione per ogni elemento
// e restituire true se per TUTTI è valida, altrimenti restituire false
// Es.: [{ id: 1, age: 32 }, { id: 2, age: 29 }] con predicate = (item) => item.age > 30,
// `areItemsValid` restituisce false perché non tutti gli elementi hanno `age` maggiore di 30
export function areItemsValid(array, predicate) {
    return array.every(predicate)
}

// Dato un array di stringhe, un array di oggetti e una chiave, restituire un nuovo array
// dove ogni elemento del primo è sostuito col corrispondente elemento del secondo in base al valore di `key`
// Es. array = ['11', '22', '33'], dataArray = [{ id: '33', name: 'A' }, { id: '11', name: 'B' }, { id: '22', name: 'C' }], key = 'id'
// `populate` reve restituire [{ id: '11', name: 'B' }, { id: '22', name: 'C' }, { id: '33', name: 'A' }]
// perché '11' nel primo array corrisponde con l'oggetto che ha id = '11' nel secondo array e così via
export function populate(array, dataArray, key) {

    return array.map((value) => dataArray.find((element) => value == element[key]))
}

// Dato un array products del tipo { product: 'A', price: 100, quantity: 1, special: true }
// e un oggetto discounts del tipo { default: 10, special: 20 } (dove sia default sia special potrebbero non esserci),
// calcolare il prezzo finale dei prodotti con l'eventuale sconto applicato,
// considerando che ai prodotti con special = true si applica la percentuale specificata in discount.special,
// agli altri prodotti la percentuale specificata in discounts.default
export function getTotal(products, discounts) {
    function discountPrice(price,discount){
        return Math.round((((price)/100)*(100-discount))*10)/10 
    }
     return products.reduce((priceTotal, product) => {
        const initPrice = product.price*product.quantity;
        priceTotal += product.special 
        ? discountPrice(initPrice,('special' in discounts) ? discounts.special : 0)
        : discountPrice(initPrice,('default' in discounts) ? discounts.default : 0)
        return priceTotal
    }, 0) 
}

// Dati un array di post, di commenti e di utenti (vedere in mock.js), creare un nuovo array dove ogni post include:
// - un campo `user` con l'oggetto intero dell'utente che corrisponde a `userId` (che va poi rimosso)
// - un campo `comments` che è un array di tutti i commenti associati a quel post (in base a `postId`, che va poi rimosso)
// Dentro ogni commento deve esserci un campo `user` con l'oggetto intero dell'utente che ha scritto il commento (corrispondente a `userId`, che va poi rimosso)
// Se non ci sono commenti, comments deve essere un array vuoto
// Controllare il risultato del test per vedere come deve essere l'array finale
export function populatePosts(posts, comments, users) {
    return posts.map(post => ({
        user: users.find(user => user.id == post.userId),
        id:    post.id,
        title: post.title,
        body:  post.body,
        comments:   comments.filter(comment => comment.postId == post.id).map(comment => ({
            user: users.find(user => user.id == comment.userId),
            id: comment.id,
            name: comment.name,
            body: comment.body,
            }))
    }))
}

// Implementare il metodo nativo Array.map()
export function map(array, mapper) {
    let retArray = [];
    array.forEach((element,index,arrayy) => {
        retArray.push(mapper(element,index,arrayy));
    }); // hey
    return retArray
}

// Implementare il metodo nativo Array.filter()
export function filter(array, predicate) {
    let retArray = [];
    array.forEach((element,index,arrayy) => {
        if (predicate(element,index,arrayy)){
            retArray.push(element);
        }
    }); 
    return retArray
}

// Implementare il metodo nativo Array.some()
export function some(array, predicate) {
    let truthValue = false;
    array.forEach((element,index,arrayy) => {
        if (predicate(element,index,arrayy)){
            truthValue = true
        }
    }); 
    return truthValue
}

// Implementare il metodo nativo Array.every()
export function every(array, predicate) {
    let truthValue = true;
    array.forEach((element,index,arrayy) => {
        if (!(predicate(element,index,arrayy))){
            truthValue = false
        }
    }); 
    return truthValue
}

// Implementare il metodo nativo Array.reduce()
export function reduce(array, reducer, initialState) {
    let reducedValue = (initialState ?? array[0])

    array.forEach((element,index,arrayy) => {
        if(!(initialState === undefined && index == 0)){
            reducedValue = reducer(reducedValue,element,index,arrayy)
        }
    }); 

    return reducedValue;
}

// Dato un array e una funzione, spostare alla fine dell'array l'elemento per il quale la funzione restituisce true
// Nota: soltanto uno degli elementi soddisfa la funzione shouldMove
export function moveToEnd(array, shouldMove) {
    let newArray = cloneArray(array);
    newArray.push(newArray.splice(newArray.findIndex(shouldMove),1)[0])
    return newArray;
}
