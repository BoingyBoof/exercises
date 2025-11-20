import booleanIntersects from '@turf/boolean-intersects'

// Clonare l'oggetto
export function cloneObject(object) {
    return {...object}
}

// Unire i due oggetti in un unico, senza modificare gli oggetti originali
export function mergeObjects(object1, object2) {
    return {...object1, ...object2}
}

// Dato un oggetto e un array con chiave-valore, aggiungere chiave-valore all'oggetto
// senza modificare l'originale, ma restituendo una copia
export function setProperty(object, [key, value]) {
    return {...object, ...{[key]: value}}
   // return Object.assign({}, object, {[key]: value});
}

// Convertire un oggetto contentene altri oggetti in array
// La chiave di ciascun oggetto va inserita nell'oggetto stesso come `key`
// Es.: { a: { name: 'X' }, b: { name: 'Y' } } diventa [{ key: 'a', name: 'X' }, b: { key: 'b', name: 'Y' }]
export function toArray(object) {
    return Object.entries(object).map(pair => Object.assign({}, {["key"]: pair[0]}, pair[1]))  
}

// Dato un oggetto, restituire un nuovo oggetto mantenendo
// soltanto le chiavi i cui valori soddisfano la funzione `predicate` (a cui bisogna passare sia la chiave, sia il valore)
// Es.: { name: 'Kate', number1: 100, number2: 40, number3: 77 } con predicate = (key, value) => key === 'name' || value > 50
// restituisce  { name: 'Kate', number1: 100, number3: 77 }
export function filterObject(object, predicate) {
    return Object.fromEntries(Object.entries(object).filter(pair => predicate(pair[0],pair[1])))
}

// Data una chiave `key`, una funzione `getValue` per ottenere il valore associato a quella chiave e un oggetto `cache`,
// `getCachedValue` deve chiamare una sola volta `getValue` e conservare il valore ottenuto, in modo che se
// la funzione viene richiamata successivamente con la stessa chiave, venga restituito il valore senza richiamare `getValue`
export function getCachedValue(key, getValue, cache) {
    return (key in cache) ? cache[key] : cache[key] = getValue()
}

// Dato un array bidimensionale, dove ogni array interno è una coppia chiave-valore, convertirlo in un oggetto
// Es.: [['name', 'John'], ['age', 22]] diventa { name: 'John', age: 22 }
export function arrayToObject(array) {
    return Object.fromEntries(array)
}

// Come `arrayToObject`, ma tutti i valori di tipo array devono a loro volta essere trasformati in oggetti
// Controllare il test per vedere dato iniziale e risultato finale
export function arrayToObjectDeep(array) {
    return array.reduce((accumulator,currentValue) => 
         Array.isArray(currentValue[1])
        ? {...accumulator, [currentValue[0]] : arrayToObjectDeep(currentValue[1])} 
        : {...accumulator, [currentValue[0]] : currentValue[1]}, {})
}   

// Dato un oggetto e una funzione `predicate` da chiamare con la coppia chiave-valore,
// restituire true se almeno una delle proprietà dell'oggetto soddisfa la funzione `predicate`.
// Es.: { name: 'Mary', age: 99, children: 4 } con predicate = (key, value) => value > 10
// restituisce true perché è presente una proprietà maggiore di 10 (age)
export function hasValidProperty(object, predicate) {
    return Object.entries(object).some((pair) => predicate(pair[0], pair[1]))
}

// Dato un oggetto, estrarre tutti i valori che sono a loro volta oggetti in un oggetto separato, usando come chiave il loro id;
// rimuovere la chiave nell'oggetto di partenza e sostituirla con `{nome_chiave}Id` e usare come valore l'id dell'oggetto estratto.
// Es.: { id: 1, name: 'John', car: { id: 33, manufacturer: 'Ford' } } restituisce due oggetti:
// { id: 1, name: 'John', carId: 33 } e l'altro { 33: { id: 33, manufacturer: 'Ford' } }
// Restituire un array con i due oggetti (vedere il test per altri esempi)
// Idealmente dovrebbe funzionare per ogni oggetto trovato dentro l'oggetto di partenza, anche quelli annidati

export function normalizeObject(object) { // aaaahhhh!!!! aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!!! AAAAAAAAAAAAAAAAAAAAAAAAAAA
    /*
    object potenzialmente composto da oggetti, object[key]
    questi possono a loro volta essere composti da oggetti
    */
    let newObjectArray = [{},{}];
    for(let key in object){ //carName, carDescription, etc.
        if(typeof object[key] === 'object'){ //Object tipo engine, owner...
            newObjectArray[0][key+"Id"] = object[key]["id"]; //Aggiungi l'id al primo oggetto
            let normResult = normalizeObject(object[key])
            newObjectArray[1][object[key]["id"]] = normResult[0]
            for(let keyRec in normResult[1]){
                newObjectArray[1][normResult[1][keyRec]["id"]] = normResult[1][keyRec]
            }
        }
        else{
             newObjectArray[0][key] = object[key]; // Altrimenti aggiungilo al primo e basta
        }
    }  
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
    // Se non ha figli la profondità è 1, se ha figli la profondità è 1 + la profondità massima tra i figli
    return ("children" in tree) ? 1 + (Math.max(...tree["children"].map(getTreeDepth))) : 1
}

// Dato un tree come sopra, contare il numero di nodi "leaf", cioè quelli senza ulteriori figli (0 children)
// Considerando l'esempio sopra, i nodi "leaf" sono 4 (C, D, E, F)
export function countTreeLeafNodes(tree) {
    // Se non ha figli è esso stesso una foglia, se ha figli le foglie sono la somma delle foglie dei figli
    return ("children" in tree) 
    ? tree["children"].reduce(((leavesNum,branch) => leavesNum += countTreeLeafNodes(branch)), 0) 
    : 1
}

// Dati un oggetto e un path di tipo stringa, `get` deve restituire la proprietà al path specificato.
// Se path contiene punti, si tratta di proprietà annidate. `get` deve funzionare anche con gli array,
// specificando un numero come indice. Se la proprietà non esiste restituire fallback o undefined.
// Es. 1: { address: { city: 'New York' } } e 'address.city' restituisce 'New York'
// Es. 2: { movies: ['Shrek', 'Shrek 2'] } e 'movies.1' restituisce 'Shrek 2'
export function get(object, path, fallback) {
    const pathArray = path.split("."); // split per convenienza
    return (pathArray[0] in object) // Se esiste il path corrente nell'oggetto procedi, altrimenti fallback
        ? (pathArray.length > 1) // Se non è la fine del path procedi con la get nel sotto-oggetto, altrimenti restituisci la proprietà finale
            ? get(object[pathArray[0]],pathArray.slice(1,).join("."),fallback)
            : object[pathArray[0]]
        : fallback
}

// Dato un oggetto con una struttura non uniforme contentente informazioni geografiche
// su strade e punti di interesse, generare un oggetto GeoJSON (RFC 7946) valido.
// NOTA: per avere un'idea dell'input vedere il test corrispondente,
// per il GeoJSON finale da generare vedere il file `mock.js`.
export function createGeoJSON(data) { //less horrible
    function parseCoordinates(coordString){
        let matches = (coordString.match(/\d+.\d+/g)).map(Number);  //Parsa solo i numeri col punto dalla stringa polyline (e li trasforma in numero)
        let coordinatesArray = []
        const chunkSize = 2;
        //Sostanzialmente raggruppa i numeri a gruppi di due ed esclude i gruppi "dispari" (gli start) tranne il primo
        for (let i = 0; i < matches.length; i += chunkSize) { 
            if(i == 0 || (i%4) == 2){
                const chunk = matches.slice(i, i + chunkSize);//
                coordinatesArray.push(chunk)
            }
        }
        return coordinatesArray;
    }
    const geoJSON = {
        type: 'FeatureCollection',
        features: [],
        
    }
    geoJSON["features"] = [
       ...data["pointsOfInterest"].map(poi =>
            Object.assign({},{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [poi["coordinates"]["lng"], poi["coordinates"]["lat"]],
                },
                properties: {
                    name: poi["name"],
                }
            },)),
        
        ...data["streets"].map(street =>
            Object.assign({},{
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: parseCoordinates(street["polyline"]),
                },
                properties: {
                    name: street["name"],
                    lanes: street["extraProps"]["lane"]
                }
            },))]
    return geoJSON;
}

// Dati un array contentente le coordinate [lng, lat] di alcune geometrie (linee e punti),
// e un punto con coordinate [lng, lat], stabilire se il punto interseca una o più geometrie del primo array.
// Se sì, convertire l'array in un oggetto GeoJSON valido, dove la/le feature intersecate
// hanno `highlighted: true` all'interno dell'oggetto `properties`. Se il punto non interseca nulla, restituire null.
// Per vedere i dati in input e il risultato finale, fare riferimento ai test.
// NOTA: usare booleanIntersects (https://turfjs.org/docs/api/booleanIntersects) per controllare se una geometria ne interseca un'altra.
export function highlightActiveFeatures(geoJSON, point) {
    
    const geomPoint = {
            type: 'Point',
            coordinates: point  
    }
    const featureCollection = {
        type: "FeatureCollection",
        features: []
    }
    let anyIntersection = false;

    featureCollection["features"] = geoJSON.map(geometry => {

        const feature = {
            type: 'Feature',
            geometry: {
                type: geometry[0] === 'point' ? 'Point' : 'LineString',
                coordinates: geometry[1],
            },
        }
        if(booleanIntersects(feature["geometry"],geomPoint)){
            anyIntersection = true;
            feature["properties"] = {
                highlighted: true
            }
        }
        return feature;
        
    });
    // fancy return if we were to not use anyIntersection
    /* return (featureCollection["features"].some(feature => 
      feature.hasOwnProperty("properties") 
      && feature["properties"].hasOwnProperty("highlighted") 
      && feature.properties.highlighted === true))
      ? featureCollection : null */
    return anyIntersection ? featureCollection : null

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
    let subtitles = vtt.split("\n\n").slice(1,); // Doppio \n separa i sottotitoli, escluso il primo perchè non è un sottotitolo vero
    let foundSubtitle;
    subtitles.forEach(subtitle => {
        const subtitleLine = subtitle.split("\n",2) // limite di 2 perchè c'è un \n aggiuntivo alla fine di un sottotitolo
        const subtitleTime = subtitleLine[0].split(" --> ")
        const subtitleText = subtitleLine[1]

        const startTimeFloat = timeConversion(subtitleTime[0])
        const endTimeFloat = timeConversion(subtitleTime[1])
        const currTimeFloat = timeConversion(time)  
        
        /*
        00:05.000, 00:09.000
        Trovare un tempo tra due tempi: confronto tra float, convertendo i minuti a 60 secondi
        */
       if(currTimeFloat >= startTimeFloat && currTimeFloat <= endTimeFloat){
            foundSubtitle = subtitleText;
            subtitleFound = true
       }
        
    });
    return (subtitleFound) ? foundSubtitle : null

    
}
