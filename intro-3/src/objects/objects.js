import booleanIntersects from '@turf/boolean-intersects'

// Clonare l'oggetto
export function cloneObject(object) {
    let newObject = Object.assign({}, object)
    return newObject;
}

// Unire i due oggetti in un unico, senza modificare gli oggetti originali
export function mergeObjects(object1, object2) {
    let newObject = {};
    Object.assign(newObject,object1);
    Object.assign(newObject,object2);
    return newObject;
}

// Dato un oggetto e un array con chiave-valore, aggiungere chiave-valore all'oggetto
// senza modificare l'originale, ma restituendo una copia
export function setProperty(object, [key, value]) {
    let newObject = {};
    Object.assign(newObject,object);
    newObject[key] = value;
    return newObject;
}

// Convertire un oggetto contentene altri oggetti in array
// La chiave di ciascun oggetto va inserita nell'oggetto stesso come `key`
// Es.: { a: { name: 'X' }, b: { name: 'Y' } } diventa [{ key: 'a', name: 'X' }, b: { key: 'b', name: 'Y' }]
export function toArray(object) {
    let newArray = [];
    let objectHolder = {};
    for(let key in object){
        objectHolder = {};
        Object.assign(objectHolder,object[key]);
        objectHolder.key = key;
        newArray.push(objectHolder);
    }
    return newArray;
}

// Dato un oggetto, restituire un nuovo oggetto mantenendo
// soltanto le chiavi i cui valori soddisfano la funzione `predicate` (a cui bisogna passare sia la chiave, sia il valore)
// Es.: { name: 'Kate', number1: 100, number2: 40, number3: 77 } con predicate = (key, value) => key === 'name' || value > 50
// restituisce  { name: 'Kate', number1: 100, number3: 77 }
export function filterObject(object, predicate) {
    let newObject = {};
    Object.assign(newObject,object);
    for(let key in newObject){
        if(!(predicate(key,newObject[key]))){
            delete newObject[key];
        }
    }
    return newObject;
}

// Data una chiave `key`, una funzione `getValue` per ottenere il valore associato a quella chiave e un oggetto `cache`,
// `getCachedValue` deve chiamare una sola volta `getValue` e conservare il valore ottenuto, in modo che se
// la funzione viene richiamata successivamente con la stessa chiave, venga restituito il valore senza richiamare `getValue`
export function getCachedValue(key, getValue, cache) {
    if(key in cache){
        return cache[key];
    }
    else{
        cache[key] = getValue()
        return cache[key];
    }
}

// Dato un array bidimensionale, dove ogni array interno è una coppia chiave-valore, convertirlo in un oggetto
// Es.: [['name', 'John'], ['age', 22]] diventa { name: 'John', age: 22 }
export function arrayToObject(array) {
    let newObject = {};
    array.forEach(element => {
        newObject[element[0]] = element[1];
    });
    return newObject;
}

// Come `arrayToObject`, ma tutti i valori di tipo array devono a loro volta essere trasformati in oggetti
// Controllare il test per vedere dato iniziale e risultato finale
export function arrayToObjectDeep(array) {
    let newObject = {};
    array.forEach(element => {
        if(Array.isArray(element[1])){
            newObject[element[0]] = arrayToObjectDeep(element[1])
        }else{
            newObject[element[0]] = element[1];
        }
       
    });
    return newObject;
}

// Dato un oggetto e una funzione `predicate` da chiamare con la coppia chiave-valore,
// restituire true se almeno una delle proprietà dell'oggetto soddisfa la funzione `predicate`.
// Es.: { name: 'Mary', age: 99, children: 4 } con predicate = (key, value) => value > 10
// restituisce true perché è presente una proprietà maggiore di 10 (age)
export function hasValidProperty(object, predicate) {
    for(let key in object){
        if(predicate(key,object[key])){
            return true;
        }
    }
    return false;
}

// Dato un oggetto, estrarre tutti i valori che sono a loro volta oggetti in un oggetto separato, usando come chiave il loro id;
// rimuovere la chiave nell'oggetto di partenza e sostituirla con `{nome_chiave}Id` e usare come valore l'id dell'oggetto estratto.
// Es.: { id: 1, name: 'John', car: { id: 33, manufacturer: 'Ford' } } restituisce due oggetti:
// { id: 1, name: 'John', carId: 33 } e l'altro { 33: { id: 33, manufacturer: 'Ford' } }
// Restituire un array con i due oggetti (vedere il test per altri esempi)
// Idealmente dovrebbe funzionare per ogni oggetto trovato dentro l'oggetto di partenza, anche quelli annidati
export function normalizeObject(object) {
    /*
    object potenzialmente composto da oggetti, object[key]
    questi possono a loro volta essere composti da oggetti, object[key][keyRec]
    */
    let newObjectArray = [{},{}];
    for(let key in object){ //Itera le proprietà dell'oggetto "padre"
        if(typeof object[key] === 'object'){ //Se questa proprietà è un oggetto
            newObjectArray[0][key+"Id"] = object[key]["id"]; //Nel primo array crea la proprietà id
            for(let keyRec in object[key]){//Itera le proprietà dell'oggetto (a sua volta una proprietà)
                if(typeof object[key][keyRec] === 'object'){ //Se a loro volta sono oggetti 
                
                newObjectArray[1][object[key][keyRec]["id"]] = 
                Object.assign({},normalizeObject(object[key][keyRec])[1])
                newObjectArray[1][object[key]["id"]] = 
                Object.assign({},normalizeObject(object[key][keyRec])[0])
                //console.log("AAAAAAAAAAAAAA")
                //console.log( newObjectArray[1][object[key][keyRec]["id"]])
                //console.log("AAAAAAAAAAAAAA")
                //console.log(newObjectArray[1][object[keyRec]["id"]])
                
                }
                else{
                    newObjectArray[1][object[key]["id"]] = (object[key][keyRec])
                    console.log(object[key])
                }
            }
        }
        else{//Se questa proprietà non è un oggetto
            newObjectArray[0][key] = object[key];
        }

    }
    //console.log(newObjectArray)
    return newObjectArray;
}

// Dato un tree del tipo
// 1.       A
//        / | \
// 2.    B  C  D
//      / \
// 3.  E   F
// restituire la profondità (in questo caso 3)
// Il tree ha la seguente struttura: { value: 'A', children: [{ value: 'B', children: [...] }, { value: 'C' }] }
export function getTreeDepth(tree) {
    let depth = 1;
    let newDepth = 0;
    if("children" in tree){
        tree["children"].forEach(element => { 
            newDepth = 1 + getTreeDepth(element);
            depth = (newDepth > depth) ? newDepth : depth; // prende la profondità maggiore tra tutti i rami figli
        });
    }
    return depth;
}

// Dato un tree come sopra, contare il numero di nodi "leaf", cioè quelli senza ulteriori figli (0 children)
// Considerando l'esempio sopra, i nodi "leaf" sono 4 (C, D, E, F)
export function countTreeLeafNodes(tree) {
    let leaves = 0;
    if("children" in tree){ //Se ha figli somma le foglie di quei figli
            tree["children"].forEach(branch => { 
                leaves += countTreeLeafNodes(branch)
            });
    }
    else{ //Altrimenti è lui stesso una foglia
            leaves = 1//
    }
    return leaves;
}

// Dati un oggetto e un path di tipo stringa, `get` deve restituire la proprietà al path specificato.
// Se path contiene punti, si tratta di proprietà annidate. `get` deve funzionare anche con gli array,
// specificando un numero come indice. Se la proprietà non esiste restituire fallback o undefined.
// Es. 1: { address: { city: 'New York' } } e 'address.city' restituisce 'New York'
// Es. 2: { movies: ['Shrek', 'Shrek 2'] } e 'movies.1' restituisce 'Shrek 2'
export function get(object, path, fallback) {
    let retProperty;
    let pathArray = []
    if(!Array.isArray(path)){ // Nel primo loop splitta il path in un array così si può parsare meglio
        pathArray = path.split(".");
    }else{
        pathArray = path;
    }
    let childObject = {};
    if(pathArray.length > 1){ // Se il path ha oggetti figli (e quindi non dobbiamo cercare qui)
        if(pathArray[0] in object){ // Se abbiamo un path in cui entrare
                childObject = object[pathArray[0]]; // Allora prendi l'oggetto figlio, leva la prima parte dell'indirizzo, e ricerca ricorsivamente
                pathArray.splice(0,1);
                retProperty = get(childObject,pathArray,fallback)
            }
        else{ // Se non c'è path restituisci fallback
            return fallback;
        }
    }
    else{ // Se il path NON ha oggetti figli e dobbiamo cercare qui
        if(pathArray[0] in object){ //Allora se c'è prendilo, altrimenti fallback
                retProperty = object[pathArray[0]]
            }
        else{
            return fallback;
        }
        }
    return retProperty;
}

// Dato un oggetto con una struttura non uniforme contentente informazioni geografiche
// su strade e punti di interesse, generare un oggetto GeoJSON (RFC 7946) valido.
// NOTA: per avere un'idea dell'input vedere il test corrispondente,
// per il GeoJSON finale da generare vedere il file `mock.js`.
export function createGeoJSON(data) { //Orribile ma...
    let poiToBuild = {};
    let streetToBuild = {};
    let geoJSON = {
        type: 'FeatureCollection',
        features: [],
    }
    data["pointsOfInterest"].forEach(poi =>{ //Per ogni punto di interesse: tutta quella roba hardcodata
        poiToBuild = {};
        poiToBuild["type"] = 'Feature';
        poiToBuild["geometry"] = {};
        poiToBuild["geometry"]["type"] = 'Point';
        poiToBuild["geometry"]["coordinates"] = [];
        poiToBuild["geometry"]["coordinates"][0] = poi["coordinates"]["lng"]
        poiToBuild["geometry"]["coordinates"][1] = poi["coordinates"]["lat"]
        poiToBuild["properties"] = {};
        poiToBuild["properties"]["name"] = poi["name"];
        geoJSON["features"].push(poiToBuild)
    })
    data["streets"].forEach(street =>{ //Per ogni strada: tutta quella roba più o meno hardcodata
        streetToBuild = {};
        streetToBuild["type"] = 'Feature';
        streetToBuild["geometry"] = {};
        streetToBuild["geometry"]["type"] = 'LineString';
        streetToBuild["geometry"]["coordinates"] = [];
        let matches = (street["polyline"].match(/\d+.\d+/g)).map(Number);  //Parsa solo i numeri col punto dalla stringa polyline
        let coordinatesArray = []
        const chunkSize = 2;
        for (let i = 0; i < matches.length; i += chunkSize) { //Sostanzialmente raggruppa i numeri a gruppi di due ed escludi i gruppi dispari tranne il primo
            const chunk = matches.slice(i, i + chunkSize);
            if(i == 0 || (i%4) == 2){
                coordinatesArray.push(chunk)
            }
        }
        streetToBuild["geometry"]["coordinates"] = [...coordinatesArray];
        streetToBuild["properties"] = {};
        streetToBuild["properties"]["name"] = street["name"];
        streetToBuild["properties"]["lanes"] = street["extraProps"]["lane"];
        geoJSON["features"].push(streetToBuild)
    })
    return geoJSON;
}

// Dati un array contentente le coordinate [lng, lat] di alcune geometrie (linee e punti),
// e un punto con coordinate [lng, lat], stabilire se il punto interseca una o più geometrie del primo array.
// Se sì, convertire l'array in un oggetto GeoJSON valido, dove la/le feature intersecate
// hanno `highlighted: true` all'interno dell'oggetto `properties`. Se il punto non interseca nulla, restituire null.
// Per vedere i dati in input e il risultato finale, fare riferimento ai test.
// NOTA: usare booleanIntersects (https://turfjs.org/docs/api/booleanIntersects) per controllare se una geometria ne interseca un'altra.
export function highlightActiveFeatures(geoJSON, point) {

     let geomPoint = {
            type: 'Point',
            coordinates: point  
        }
    let featureCollection = {
        type: "FeatureCollection",
        features: []
    }
    let anyIntersection = false;
    geoJSON.forEach(geometry => {
        let geomHolder = {}
        let feature = {}
        if(geometry[0] === 'point'){
            geomHolder["type"] = 'Point';
            geomHolder["coordinates"] = geometry[1];
        }else if(geometry[0] === 'line'){
            geomHolder["type"] = 'LineString';
            geomHolder["coordinates"] = geometry[1];
        }
        feature = {
            type: 'Feature',
            geometry: {},
            
        }
        feature["geometry"] = Object.assign({}, geomHolder)
        if(booleanIntersects(geomHolder,geomPoint)){
            anyIntersection = true;
            feature["properties"] = {}
            feature["properties"]["highlighted"] = true;
        }
        featureCollection["features"].push(feature)
        
    });
    if(anyIntersection){
        return featureCollection;
    }else{
        return null;
    }
}

// Data una stringa in formato VTT contentente una lista di sottotitoli associati a un istante temporale (inizio --> fine), es.:
//
// WEBVTT
//
// 00:01.000 --> 00:04.000
// Never drink liquid nitrogen.
//
// 00:05.000 --> 00:09.000
// It will perforate your stomach. You could die.
//
// restituire la riga corretta in base a `time`.
// Ad esempio, quando time è '00:07.988' la funzione deve restituire 'It will perforate your stomach. You could die.'
// Restituire null se non ci sono sottotitoli per il time specificato. Tornando all'esempio di sopra, '00:37.430' restituisce null.
export function getLineFromVTT(vtt, time) {
    let timeConversion = function(stringTimeToConvert){
       return parseFloat((stringTimeToConvert.split(":")[1])) + (parseFloat((stringTimeToConvert.split(":")[0])) * 60)

    }
    let subtitleFound = false;
    let subtitles = vtt.split("\n\n");
    let retString;
    subtitles.splice(0,1);
    subtitles.forEach(subtitle => {
        let subtitleObject = {}
        let helperArray = subtitle.split("\n")
        let helperArrayTime = helperArray[0].split(" --> ")
        subtitleObject["startTime"] = helperArrayTime[0];
        subtitleObject["endTime"] = helperArrayTime [1];
        subtitleObject["subtitleText"] = helperArray[1]
        /*
        00:05.000, 00:09.000
        Come trovare un tempo tra due tempi (escludiamo i minuti per ora)
        se è strettamente maggiore dei primi secondi e strettamente minore dei secondi secondi, OK
        se non lo è, controlla se tutti e 3 sono uguali 
        */
       let startTimeTest = timeConversion(subtitleObject["startTime"])
       let endTimeTest = timeConversion(subtitleObject["endTime"])
       let currTimeTest = timeConversion(time)
       //console.log("startTime: " + startTimeTest + ", endTime: " + endTimeTest + ", currTime: " + currTimeTest)
       
       if(currTimeTest >= startTimeTest && currTimeTest <= endTimeTest){

            retString = subtitleObject["subtitleText"];
            subtitleFound = true
            
       }
        
    });
    if(subtitleFound){
        return retString;
    }else{
        return null;
    }
    
    //console.log(subtitles)
    
}
