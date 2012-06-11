var FSApi = require('../lib/fsapi');

var fsapi = new FSApi({
  developerKey: 'NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN-NNNN'
});

buster.testCase("FSApi module public horizon tests", {
  "calculates public horizon": function () {
    var data = require("./pedigree-data.json");
    // console.log("data: ", data);
    assert.equals(fsapi.calculatePublicHorizon(data), "KW7D-W2M(4)!KW7D-W2C(10)!KW7D-W2Z(11)!KW7D-W2H(12)!KW7D-W2W(14)!KW7D-W24(15)", "incorrect public horizon");
  },
  "calculates public horizon for dead person": function () {
  	var data = {"searches":null,"matches":null,"pedigrees":[{"id":"KW7D-W2C","requestedId":"KW7D-W2C","persons":[{"properties":{"living":false,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":"31 Dec 1990","year":1990,"astro":2448257},"birth":{"text":"01 Jan 1930","year":1930,"astro":2425978}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Momma's Poppa","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Male","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"personas":null,"relationships":null,"changes":null,"id":"KW7D-W2C","version":"12884967427","requestedId":null,"personId":null,"tempId":null}]}],"status":null,"version":"2.7.20120124.1651","statusCode":200,"statusMessage":"OK","deprecated":null};
    // console.dir(data);
    assert.equals(fsapi.calculatePublicHorizon(data), "KW7D-W2C", "incorrect public horizon");
  },
  "calculates public horizon for null data": function () {
    assert.equals(fsapi.calculatePublicHorizon(null), "", "incorrect public horizon");
  },
  "calculates public horizon for empty data": function () {
    assert.equals(fsapi.calculatePublicHorizon({}), "", "incorrect public horizon");
  },
  "calculates public horizon for dead parents": function () {
  	var data = {"searches":null,"matches":null,"pedigrees":[{"id":"KW7D-W2Q","requestedId":"KW7D-W2Q","persons":[{"properties":{"living":true,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":null,"year":null,"astro":null},"birth":{"text":"01 Jan 1955","year":1955,"astro":2435109}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Ice Cream","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Female","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"parents":[{"parent":[{"gender":"Male","id":"KW7D-W2W","version":null,"current":null,"tempId":null},{"gender":"Female","id":"KW7D-W24","version":null,"current":null,"tempId":null}],"action":null}],"personas":null,"relationships":null,"changes":null,"id":"KW7D-W2Q","version":"12884967428","requestedId":null,"personId":null,"tempId":null},{"properties":{"living":false,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":"31 Dec 1980","year":1980,"astro":2444605},"birth":{"text":"01 Jan 1900","year":1900,"astro":2415021}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Sweet Cream","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Male","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"personas":null,"relationships":null,"changes":null,"id":"KW7D-W2W","version":"12884967427","requestedId":null,"personId":null,"tempId":null},{"properties":{"living":false,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":"31 Dec 1990","year":1990,"astro":2448257},"birth":{"text":"01 Jan 1901","year":1901,"astro":2415386}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Block Ice","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Female","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"personas":null,"relationships":null,"changes":null,"id":"KW7D-W24","version":"12884967426","requestedId":null,"personId":null,"tempId":null}]}],"status":null,"version":"2.7.20120124.1651","statusCode":200,"statusMessage":"OK","deprecated":null};
    assert.equals(fsapi.calculatePublicHorizon(data), "KW7D-W2W(2)!KW7D-W24(3)", "incorrect public horizon");
  },
  "calculates public horizon for living with no parents": function () {
  	var data = {"searches":null,"matches":null,"pedigrees":[{"id":"KW7D-W27","requestedId":"KW7D-W27","persons":[{"properties":{"living":true,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":null,"year":null,"astro":null},"birth":{"text":"01 Jan 1920","year":1920,"astro":2422325}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Strawberry Shortcake","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Female","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"personas":null,"relationships":null,"changes":null,"id":"KW7D-W27","version":"12884967426","requestedId":null,"personId":null,"tempId":null}]}],"status":null,"version":"2.7.20120124.1651","statusCode":200,"statusMessage":"OK","deprecated":null};
    assert.equals(fsapi.calculatePublicHorizon(data), "", "incorrect public horizon");
  },
  "calculates public horizon for 1 living parent": function () {
  	var data = {"searches":null,"matches":null,"pedigrees":[{"id":"KW3B-FJR","requestedId":"KW3B-FJR","persons":[{"properties":{"living":true,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":null,"year":null,"astro":null},"birth":{"text":"08 Jan 1955","year":1955,"astro":2435116}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Logan Allred","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Male","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"parents":[{"parent":[{"gender":"Male","id":"KW7D-W2M","version":null,"current":null,"tempId":null},{"gender":"Female","id":"KW7D-W29","version":null,"current":null,"tempId":null}],"action":null}],"personas":null,"relationships":null,"changes":null,"id":"KW3B-FJR","version":"12885032968","requestedId":null,"personId":null,"tempId":null},{"properties":{"living":false,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":"31 Dec 2000","year":2000,"astro":2451910},"birth":{"text":"01 Jan 1950","year":1950,"astro":2433283}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Deceased Poppa","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Male","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"personas":null,"relationships":null,"changes":null,"id":"KW7D-W2M","version":"12884967427","requestedId":null,"personId":null,"tempId":null},{"properties":{"living":true,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":null,"year":null,"astro":null},"birth":{"text":"01 Jan 1951","year":1951,"astro":2433648}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Living Momma","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Female","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"parents":[{"parent":[{"gender":"Male","id":"KW7D-W2C","version":null,"current":null,"tempId":null},{"gender":"Female","id":"KW7D-W2Z","version":null,"current":null,"tempId":null}],"action":null}],"personas":null,"relationships":null,"changes":null,"id":"KW7D-W29","version":"12884967429","requestedId":null,"personId":null,"tempId":null},{"properties":{"living":false,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":"31 Dec 1990","year":1990,"astro":2448257},"birth":{"text":"01 Jan 1930","year":1930,"astro":2425978}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Momma's Poppa","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Male","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"personas":null,"relationships":null,"changes":null,"id":"KW7D-W2C","version":"12884967427","requestedId":null,"personId":null,"tempId":null},{"properties":{"living":false,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":"31 Dec 2005","year":2005,"astro":2453736},"birth":{"text":"01 Jan 1935","year":1935,"astro":2427804}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Momma's Momma","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Female","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"personas":null,"relationships":null,"changes":null,"id":"KW7D-W2Z","version":"12884967426","requestedId":null,"personId":null,"tempId":null}]}],"status":null,"version":"2.7.20120124.1651","statusCode":200,"statusMessage":"OK","deprecated":null};
    assert.equals(fsapi.calculatePublicHorizon(data), "KW7D-W2M(2)!KW7D-W2C(6)!KW7D-W2Z(7)", "incorrect public horizon");
  },
  "calculates public horizon slot": function () {
  	var horizon;
  	var data = {"pedigrees":[{"id":"KW3B-FJR","persons":[{"properties":{"living":true},"parents":[{"parent":[{"gender":"Male","id":"fatherId"},{"gender":"Female","id":"motherId"}]}],"id":"personId"},{"properties":{"living":false},"parents":[{"parent":[{"gender":"Male","id":"pgpaId"},{"gender":"Female","id":"pgmaId"}]}],"id":"fatherId"},{"properties":{"living":false},"parents":[{"parent":[{"gender":"Male","id":"mgpaId"},{"gender":"Female","id":"mgmaId"}]}],"id":"motherId"}]}]};
  	var map = fsapi.createPedigreeMap(data);
  	// console.log("map: ",map);
  	// null or empty data
    assert.equals(fsapi.calculatePublicHorizonSlot(), "", "incorrect public horizon slot");
    assert.equals(fsapi.calculatePublicHorizonSlot(1, null, {}), "", "incorrect public horizon slot");
    assert.equals(fsapi.calculatePublicHorizonSlot(1, {}, {}), "", "incorrect public horizon slot");
    
    // deceased persons are their own public horizon
    horizon = fsapi.calculatePublicHorizonSlot(1, {"id": "personId", "properties": {"living": false}}, {});
    assert.equals(horizon, "personId", "incorrect public horizon slot");
    
    horizon = fsapi.calculatePublicHorizonSlot(2, {"id": "personId", "properties": {"living": false}}, {});
    assert.equals(horizon, "personId(2)", "incorrect public horizon slot");
    
    // living persons
    horizon = fsapi.calculatePublicHorizonSlot(1, {"id": "personId", "properties": {"living": true}}, {});
    assert.equals(horizon, "", "incorrect public horizon slot");

    horizon = fsapi.calculatePublicHorizonSlot(1, {"id": "personId", "properties": {"living": true}}, {});
    assert.equals(horizon, "", "incorrect public horizon slot");

    horizon = fsapi.calculatePublicHorizonSlot(1, {"id": "personId", "properties": {"living": true}, "parents": [{"parent": [{gender:"Male",id: "fatherId"},{gender:"Female",id: "motherId"}]}]}, map);
    assert.equals(horizon, "fatherId(2)!motherId(3)", "incorrect public horizon slot");
    
    horizon = fsapi.calculatePublicHorizonSlot(2, {"id": "personId", "properties": {"living": true}, "parents": [{"parent": [{gender:"Male",id: "fatherId"},{gender:"Female",id: "motherId"}]}]}, map);
    assert.equals(horizon, "fatherId(4)!motherId(5)", "incorrect public horizon slot");

// console.log("**********************");
    data = require("./pedigree-data.json");
  	map = fsapi.createPedigreeMap(data);
  	// console.log("root: ",map["KW7D-W2Q"]);
    horizon = fsapi.calculatePublicHorizonSlot(2, map["KW7D-W2Q"], map);
    assert.equals(horizon, "KW7D-W2W(4)!KW7D-W24(5)", "incorrect public horizon slot");
  },
  "calculates parents from parent array": function () {
  	// null & empty data
  	var result = fsapi.calculateParents();
    assert.isNull(result.father, "incorrect father");
    assert.isNull(result.mother, "incorrect mother");
  	
  	var result = fsapi.calculateParents([]);
    assert.isNull(result.father, "incorrect father");
    assert.isNull(result.mother, "incorrect mother");
    
    // single parent
  	var result = fsapi.calculateParents([{gender:"Male",id: "fatherId"}]);
    assert.equals(result.father.id, "fatherId", "incorrect father");
    assert.isNull(result.mother, "incorrect mother");
  	
  	var result = fsapi.calculateParents([{gender:"Female",id: "motherId"}]);
    assert.isNull(result.father, "incorrect father");
    assert.equals(result.mother.id, "motherId", "incorrect mother");
  	
  	var result = fsapi.calculateParents([{gender:"Unknown",id: "unknownId"}]);
    assert.equals(result.father.id, "unknownId", "incorrect father");
    assert.isNull(result.mother, "incorrect mother");
    
    // both parents
  	var result = fsapi.calculateParents([{gender:"Male",id: "fatherId"},{gender:"Female",id: "motherId"}]);
    assert.equals(result.father.id, "fatherId", "incorrect father");
    assert.equals(result.mother.id, "motherId", "incorrect mother");
  	
  	var result = fsapi.calculateParents([{gender:"Male",id: "fatherId"},{gender:"Unknown",id: "motherId"}]);
    assert.equals(result.father.id, "fatherId", "incorrect father");
    assert.equals(result.mother.id, "motherId", "incorrect mother");
  	
  	var result = fsapi.calculateParents([{gender:"Female",id: "motherId"},{gender:"Male",id: "fatherId"}]);
    assert.equals(result.father.id, "fatherId", "incorrect father");
    assert.equals(result.mother.id, "motherId", "incorrect mother");
  	
  	var result = fsapi.calculateParents([{gender:"Female",id: "motherId"},{gender:"Unknown",id: "fatherId"}]);
    assert.equals(result.father.id, "fatherId", "incorrect father");
    assert.equals(result.mother.id, "motherId", "incorrect mother");  	

  	var result = fsapi.calculateParents([{gender:"Unknown",id: "motherId"},{gender:"Male",id: "fatherId"}]);
    assert.equals(result.father.id, "fatherId", "incorrect father");
    assert.equals(result.mother.id, "motherId", "incorrect mother");

  	var result = fsapi.calculateParents([{gender:"Unknown",id: "fatherId"},{gender:"Female",id: "motherId"}]);
    assert.equals(result.father.id, "fatherId", "incorrect father");
    assert.equals(result.mother.id, "motherId", "incorrect mother");
  	
  	var result = fsapi.calculateParents([{gender:"Unknown",id: "fatherId"},{gender:"Unknown",id: "motherId"}]);
    assert.equals(result.father.id, "fatherId", "incorrect father");
    assert.equals(result.mother.id, "motherId", "incorrect mother");  	

  	var data = {"searches":null,"matches":null,"pedigrees":[{"id":"KW3B-FJR","requestedId":"KW3B-FJR","persons":[{"properties":{"living":true,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":null,"year":null,"astro":null},"birth":{"text":"08 Jan 1955","year":1955,"astro":2435116}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Logan Allred","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Male","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"parents":[{"parent":[{"gender":"Male","id":"KW7D-W2M","version":null,"current":null,"tempId":null},{"gender":"Female","id":"KW7D-W29","version":null,"current":null,"tempId":null}],"action":null}],"personas":null,"relationships":null,"changes":null,"id":"KW3B-FJR","version":"12885032968","requestedId":null,"personId":null,"tempId":null},{"properties":{"living":false,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":"31 Dec 2000","year":2000,"astro":2451910},"birth":{"text":"01 Jan 1950","year":1950,"astro":2433283}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Deceased Poppa","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Male","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"personas":null,"relationships":null,"changes":null,"id":"KW7D-W2M","version":"12884967427","requestedId":null,"personId":null,"tempId":null},{"properties":{"living":true,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":null,"year":null,"astro":null},"birth":{"text":"01 Jan 1951","year":1951,"astro":2433648}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Living Momma","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Female","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"parents":[{"parent":[{"gender":"Male","id":"KW7D-W2C","version":null,"current":null,"tempId":null},{"gender":"Female","id":"KW7D-W2Z","version":null,"current":null,"tempId":null}],"action":null}],"personas":null,"relationships":null,"changes":null,"id":"KW7D-W29","version":"12884967429","requestedId":null,"personId":null,"tempId":null},{"properties":{"living":false,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":"31 Dec 1990","year":1990,"astro":2448257},"birth":{"text":"01 Jan 1930","year":1930,"astro":2425978}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Momma's Poppa","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Male","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"personas":null,"relationships":null,"changes":null,"id":"KW7D-W2C","version":"12884967427","requestedId":null,"personId":null,"tempId":null},{"properties":{"living":false,"modified":null,"modifiable":null,"selectable":null,"watchable":null,"lifespan":{"death":{"text":"31 Dec 2005","year":2005,"astro":2453736},"birth":{"text":"01 Jan 1935","year":1935,"astro":2427804}},"multipleFamiliesAsParent":false,"multipleFamiliesAsChild":false},"identifiers":null,"assertions":{"names":[{"value":{"type":null,"forms":[{"fullText":"Momma's Momma","script":null,"selected":null}],"id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}],"genders":[{"value":{"type":"Female","id":null,"title":null},"id":null,"version":null,"selected":null,"notes":null,"citations":null,"tempId":null,"action":null,"disposition":null,"modified":null,"modifiable":null}]},"personas":null,"relationships":null,"changes":null,"id":"KW7D-W2Z","version":"12884967426","requestedId":null,"personId":null,"tempId":null}]}],"status":null,"version":"2.7.20120124.1651","statusCode":200,"statusMessage":"OK","deprecated":null};  	
  	var result = fsapi.calculateParents(data.pedigrees[0].persons[0].parents[0].parent);
    assert.equals(result.father.id, "KW7D-W2M", "incorrect father");
    assert.equals(result.mother.id, "KW7D-W29", "incorrect mother");  	
  }
});
