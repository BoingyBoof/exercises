// run tests by going in intro-3 and running npm test 
// Advice: NO else, avoid nested fors, use more methods, avoid returning the initial array


// Duplicare l'array
export function cloneArray(array) {
    // let newArray = [...array] probs
    return [...array];
}

// Inserire l'elemento alla fine
export function addToArrayEnd(array, newElement) {
   // array.push(newElement);
    return [...array, newElement];
}

// Inserire l'elemento all'inizio
export function addToArrayBeginning(array, newElement) {
    //array.unshift(newElement);
    //return array;
    return [newElement, ...array]
}

// Inserire l'elemento all'indice specificato
// Se l'indice è negativo, inserirlo all'inizio dell'array
// Se l'indice è superiore alla lunghezza dell'array, inserirlo alla fine
export function insertIntoArray(array, newElement, index) {
    /*if (index < 0){
       //array.unshift(newElement);
        return addToArrayBeginning(array)
    }

   if(index > (array.length)){
        array.push(newElement);
    }
   
    array.splice(index,0,newElement)
        
    return array;*/
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
    //find
    //Object.entries/Object.keys/Object.values
    
    // Nullish coalescing operator for fun
    // Otherwise: === undefined return null
    return array.find(object => object[Object.keys(condition)[0]] == Object.values(condition)[0]) ?? null
    
    //for(const element of array){
    //    console.log(Object.entries(element))
    //    element.find((property) => )
    //}
    //console.log(find(Object.entries(array)))
    /*for(const element of array){
        for(const arrKey of Object.keys(element)){
            for(const conKey of Object.keys(condition)){
                if(arrKey == conKey){
                    if(element[arrKey] == condition[conKey]){
                        return element
                    }
                }
            }
        }
    }
    return null;*/
}

// Come `findBy`, ma restituisce tutti gli elementi per i quali `condition` risulta vera
// Se per nessun elemento risulta vera, restituire un array vuoto
export function filterBy(array, condition) {
    
    //filter
   
    //Very similar to above but nullish operator is not even necessary
    return array.filter(object => object[Object.keys(condition)[0]] == Object.values(condition)[0])
    /*
    var returnArray = [];
    for(const element of array){
        for(const arrKey of Object.keys(element)){
            for(const conKey of Object.keys(condition)){
                if(arrKey == conKey){
                    if(element[arrKey] == condition[conKey]){
                        returnArray.push(element)
                    }
                }
            }
        }
    }
    return returnArray*/
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
    /*var foundIndex = array.findIndex((item => item == element))
    if (foundIndex != -1){
        array.splice(foundIndex,1)
    }
    else{
        array.push(element)
    }
    return array*/
}

// Rimuove dall'array l'elemento all'indice specificato
// Se l'indice è superiore o inferiore alla lunghezza dell'array, restituire l'array originale
export function removeFromArray(array, index) {
    if(index < 0 || index >= array.length){
        return array
    };
    let retArray = cloneArray(array);
    retArray.splice(index,1);
    return retArray;
    /*if (index < 0 || index >= array.length)
        return array
    else 
        array.splice(index,1)
        return array*/
}

// Dati 2 o più array, unirli in un unico array
export function mergeArrays(...arrays) {
    let mergedArray = [];
    for(const array of arrays){
        mergedArray = mergedArray.concat(array);
    }
    return mergedArray;
    /*var baseArray = []
    for(const array of arrays){
        for(const element of array){
            baseArray.push(element)
        }
    }
    return baseArray*/
}

// Dati 2 o più array, unirli in un unico array, ma rimuovere eventuali duplicati
export function mergeArraysUnique(...arrays) {
    return [...new Set (mergeArrays(...arrays))]


    /*var baseArray = []
    for(const array of arrays){
        for(const element of array){
            if(baseArray.find((item => item == element))){

            }
            else{
                baseArray.push(element)
            }
            
        }
    }
    return baseArray*/
}

// Dato un array di oggetti, una chiave e una direzione (ASC | DESC), ordinare l'array in base ai valori della chiave specificata
// Se `direction` è ASC l'ordine deve essere ascendente, se è DESC discendente
// Es.: [{ age: 44, name: 'Mary' }, { age: 22, name: 'John' }, { age: 31, name: 'Mark' }] con chiave age e direction DESC
// restituisce [{ age: 44, name: 'Mary' }, { age: 31, name: 'Mark' }, { age: 22, name: 'John' }]
// Nota: `key` farà sempre riferimento a valori numerici

export function sortBy(array, key, direction) {
    if(direction == 'ASC') {
     array.sort(function(a,b){return a[key]-b[key]})
     }
     else if(direction =='DESC'){
        array.sort(function(a,b){return b[key]-a[key]})
     }
     return array
}

// Dato un array di oggetti, convertirlo in oggetto e usare come chiave il valore di `key`
// Es.: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] con key = 'name' deve restituire
// { A: { id: 1, name: 'A' }, B: { id: 2, name: 'B' } }
export function keyBy(array, key) {
    let obj = {}
    for(const element of array){
        console.log(element[key])
        obj[element[key]] = element
    }
    return obj
}

// Dato un array, inserire il nuovo elemento all'indice specificato, sostituendo quello che c'è già
export function replaceItemAtIndex(array, newItem, index) {
    let newArray = [...array]
    newArray.splice(index,1,newItem)
    return newArray
}

// Dato un array di oggetti, aggiungere a ogni oggetto le proprietà specificate
// Es.: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }] con properties { city: 'X', number: 99 }
// deve restituire [{ id: 1, name: 'A', city: 'X', number: 99  }, { id: 2, name: 'B', city: 'X', number: 99 }]
// L'array originale e i suoi elementi non devono essere modificati
export function addExtraProperties(array, properties) {
    var newArray = []
    
    for(const element of array){
        var newElement = {}
        for(const propertyKey of Object.keys(element)){
            newElement[propertyKey] = element[propertyKey]
        }
        for(const propertyKey of Object.keys(properties)){
            newElement[propertyKey] = properties[propertyKey]
        }
        console.log(newElement)
        newArray.push(newElement)
    }

    return newArray
}

// Dato un array di oggetti rimuovere da ciascuno di essi le proprietà specificate
// Es.: [{ id: 1, name: 'A', city: 'X', state: 'Y' }] con properties ['city', 'state']
// deve restituire [{ id: 1, name: 'A' }]
// L'array originale e i suoi elementi non devono essere modificati
export function removeProperties(array, properties) {
    var newArray = []
    
    for(const element of array){
        var newElement = {}
        for(const propertyKey of Object.keys(element)){
            newElement[propertyKey] = element[propertyKey]
        }
        for(const propertyKey of properties){
            delete newElement[propertyKey]
        }

        newArray.push(newElement)
    }
    return newArray
}

// Dato un array di oggetti con una chiave id e un array di id selezionati,
// restituire un nuovo array in cui gli elementi selezionati hanno la proprietà `selected`= true
// Es.: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }] e selectedIds = [2, 3]
// deve restituire [{ id: 1, name: 'A' }, { id: 2, name: 'B', selected: true }, { id: 3, name: 'C', selected: true }]
// L'array originale e i suoi elementi non devono essere modificati
export function setSelected(array, selectedIds) {
    var newArray = []
    
    for(const element of array){
        var newElement = {}
        for(const propertyKey of Object.keys(element)){
            newElement[propertyKey] = element[propertyKey]
        }
        for(const selectedId of selectedIds){
            if(newElement.id == selectedId) newElement.selected = true
        }

        newArray.push(newElement)
    }
    return newArray
}

// Dato un array di oggetti, rimapparlo estraendo la chiave specificata
// Es.: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }] con chiave 'name'
// deve restituire ['A', 'B', 'C']
// Se la chiave non esiste, restituire l'array originale
export function mapTo(array, key) {
    var newArray = []
    if(array[0].hasOwnProperty(key)){
    for(const element of array){
        newArray.push(element[key])
    }

    return newArray
    }
    else return array
}

// Dato un array di oggetti e una funzione `predicate`, eseguire la funzione per ogni elemento
// e restituire true se per TUTTI è valida, altrimenti restituire false
// Es.: [{ id: 1, age: 32 }, { id: 2, age: 29 }] con predicate = (item) => item.age > 30,
// `areItemsValid` restituisce false perché non tutti gli elementi hanno `age` maggiore di 30
export function areItemsValid(array, predicate) {
    var flag = true;
    array.forEach((ele) => {
        if (predicate(ele) == false){
            flag = false
        }
    })
    return flag
}

// Dato un array di stringhe, un array di oggetti e una chiave, restituire un nuovo array
// dove ogni elemento del primo è sostuito col corrispondente elemento del secondo in base al valore di `key`
// Es. array = ['11', '22', '33'], dataArray = [{ id: '33', name: 'A' }, { id: '11', name: 'B' }, { id: '22', name: 'C' }], key = 'id'
// `populate` reve restituire [{ id: '11', name: 'B' }, { id: '22', name: 'C' }, { id: '33', name: 'A' }]
// perché '11' nel primo array corrisponde con l'oggetto che ha id = '11' nel secondo array e così via
export function populate(array, dataArray, key) {
    var newArray = []//
    array.forEach((value)=>{
        dataArray.forEach((element)=>{
            if (value == element[key]) {
                newArray.push(element)
            }
        })     
    })
    return newArray
}

// Dato un array products del tipo { product: 'A', price: 100, quantity: 1, special: true }
// e un oggetto discounts del tipo { default: 10, special: 20 } (dove sia default sia special potrebbero non esserci),
// calcolare il prezzo finale dei prodotti con l'eventuale sconto applicato,
// considerando che ai prodotti con special = true si applica la percentuale specificata in discount.special,
// agli altri prodotti la percentuale specificata in discounts.default
export function getTotal(products, discounts) {
    var priceTotal = 0
    products.forEach(element => {
        if('special' in element){
            if(element.special == true){
                if('special' in discounts){
                    priceTotal += Math.round((((element.price * element.quantity)/100)*(100-discounts.special))*10)/10 
                }
                else{
                    priceTotal += element.price*element.quantity
                }
            }
            else{
                if('default' in discounts){
                    priceTotal += Math.round((((element.price * element.quantity)/100)*(100-discounts.default))*10)/10 
                }
                else{
                    priceTotal += element.price*element.quantity
                }
            }
        }
        else{
            if('default' in discounts){
                    priceTotal += Math.round((((element.price * element.quantity)/100)*(100-discounts.default))*10)/10 
                }
                else{
                    priceTotal += element.price*element.quantity
                }
        }
    });
    return priceTotal
}

// Dati un array di post, di commenti e di utenti (vedere in mock.js), creare un nuovo array dove ogni post include:
// - un campo `user` con l'oggetto intero dell'utente che corrisponde a `userId` (che va poi rimosso)
// - un campo `comments` che è un array di tutti i commenti associati a quel post (in base a `postId`, che va poi rimosso)
// Dentro ogni commento deve esserci un campo `user` con l'oggetto intero dell'utente che ha scritto il commento (corrispondente a `userId`, che va poi rimosso)
// Se non ci sono commenti, comments deve essere un array vuoto
// Controllare il risultato del test per vedere come deve essere l'array finale
export function populatePosts(posts, comments, users) {
    var newArray = []
    
    posts.forEach(post => {
        var tempCommentArray = []
        newArray.push({
            user: users.find((user) => user.id == post.userId),
            id: post.id,
            title: post.title,
            body:post.body,
            comments: []
        })
        tempCommentArray = comments.filter((comment)=>comment.postId == post.id)
        //console.log(tempCommentArray)
        tempCommentArray.forEach(comment => {
            newArray[newArray.length-1].comments.push({
                id: comment.id,
                name: comment.name,
                user:users.find((user) => user.id == comment.userId),
                body: comment.body,
            })
        });

    });
    //console.log(newArray)
    return newArray
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
    let reducedValue;
    if(initialState !== undefined){
        reducedValue = initialState;
    }else{
        reducedValue = array[0]
    }
    array.forEach((element,index,arrayy) => {
        if(initialState === undefined && index == 0){
            
        }else{
        reducedValue = reducer(reducedValue,element,index,arrayy)
        }
    }); 
    return reducedValue
}

// Dato un array e una funzione, spostare alla fine dell'array l'elemento per il quale la funzione restituisce true
// Nota: soltanto uno degli elementi soddisfa la funzione shouldMove
export function moveToEnd(array, shouldMove) {
    let newArray = []
    let savedValue;
    array.forEach((element,index) =>{
        if(shouldMove(element)){
            savedValue = element
        }else{
            newArray.push(element)
        }
    })
    newArray.push(savedValue) //
    return newArray;
}
