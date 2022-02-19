

let config = {

    API_URL : 'http//localhost:8089',
    admin_users : ['hfreedma', 'qingys1', 'wmt'],
    relationships : ["causes", "reduces", "controls", "has part", "part of", "opposes", "contributing factor of", "instance of", "described by source", "replaces", "location", "opposite of", "subclass of", "objective of property of action", "has quality", "facet of"],
    // relationships : ["causes"],
        //relationships = 'relations.txt',
    concepts : 'Wikipedia',
    //concepts = {"Motion", "Momentum", "Impulse", "Torque", "Power"}
    //concepts = concepts.txt
    Voting : true,
    Citations : false,
    Collaborative : true

};

export { config }
