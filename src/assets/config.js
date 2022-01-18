

let config = {

    API_URL : 'http//localhost:8089',
    admin_users : ['hfreedma', 'qingys1', 'wmt'],
    // relationships : ["causes", "inhibits", "produces", "has part", "part of"],
    relationships : ["causes"],
        //relationships = 'relations.txt',
    concepts : 'Wikipedia',
    //concepts = {"Motion", "Momentum", "Impulse", "Torque", "Power"}
    //concepts = concepts.txt
    Voting : true,
    Citations : false,
    Collaborative : true

};

export { config }
