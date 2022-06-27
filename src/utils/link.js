export const addLinks = (that)  =>{

    that.relationship_name = that.relationship;
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator


    if ((pattern.test(that.reference) && that.config.Citations === true) || (that.config.Citations === false )) {

        that.dialogFormVisible_link = false;
        that.dialogFormVisible_relationship = false;
        let new_link = {};

        if (that.relationship !== ''){
            if (that.config.Citations === false) {
                new_link = {
                    "source": that.start,
                    "target": that.end,
                    "id": that.info.links.length,
                    "type": 'link',
                    "citation": {},
                    "label": that.relationship,
                    'posVote':'0',
                    'negVote':'0'

                };
            }
            else {
                new_link = {
                    "source": that.start,
                    "target": that.end,
                    "id": that.info.links.length,
                    "type": 'link',
                    "citation": that.reference,
                    "label": that.relationship,
                    'posVote':'0',
                    'negVote':'0'

                };
            }


            let link_name_set = [];
            for (let i = 0; i < that.info.links.length; i++) {
                if (that.info.links[i].source.properties.name === that.start.properties.name
                    && that.info.links[i].target.properties.name === that.end.properties.name) {

                    link_name_set.push(that.info.links[i].label);
                }
            }

            if (link_name_set.indexOf(new_link.label) > -1) {
                that.$message({
                    'type': 'warning',
                    'message': 'There is already a relationship with that URL!'
                })
            }
            else {

                that.info.links.push(new_link);

            }

            let node_to_string = that.info.nodes.map(function (element) {
                return {
                    'id': element.id, 'type': element.type, 'properties': {'name': element.properties.name},
                    'label': element.label, 'snippet': element.snippet, 'if_expanded': element.if_expanded,
                    'x':element.x, 'y':element.y,'fixed':true
                };
            });
            let link_to_string;
            if (that.config.Citations === false) {
                link_to_string = that.info.links.map(function (element) {
                    return {
                        "source": element.source.id,
                        "target": element.target.id,
                        "id": element.id,
                        "type": element.type,
                        "citation": {},
                        "label": element.label,
                        'posVote':element.posVote,
                        'negVote':element.negVote


                    }

                });
            } else {
                link_to_string = that.info.links.map(function (element) {
                    return {
                        "source": element.source.id,
                        "target": element.target.id,
                        "id": element.id,
                        "type": element.type,
                        "citation": element.citation,
                        "label": element.label,
                        'posVote':element.posVote,
                        'negVote':element.negVote


                    }

                });
            }

            let new_info = [];
            new_info.nodes = node_to_string;
            new_info.links = link_to_string;
            that.info = new_info;
            that.renderGraph(that.info);


            if (that.config.Citations === false) {
                let addLink = `{"method":"addLink","data":{"user": \"${that.username}\","origin":\"${that.start.properties.name}\",
                        "target": \"${that.end.properties.name}\","label":\"${that.relationship}\" }}`;
                that.websocketsend(addLink);
            }else{
                let addLink = `{"method":"addLink","data":{"user": \"${that.username}\","origin":\"${that.start.properties.name}\",
                        "target": \"${that.end.properties.name}\","label":\"${that.relationship}\","citation": \"${that.reference}\" }}`;
                that.websocketsend(addLink);
            }
            that.ifClicked = false;
            that.selectClear();
            that.reference = '';

        }
        else{
            that.dialogFormVisible_link = true;
            that.$message(
                {
                    type: 'warning',
                    message: 'Labels can not be empty!'
                });
            that.reference = '';

        }


    } else {
        that.dialogFormVisible_link = true;
        that.$message(
            {
                type: 'warning',
                message: 'Invalid URL!'
            });
        that.reference = '';

    }



};

export const changeLinkName = (that) =>{
    let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    if(pattern.test(that.new_reference)) {

        let oldLabel =  that.info.links[that.link_id].label;
        let oldCitation = that.info.links[that.link_id].citation

        that.info.links[that.link_id].label = that.new_relationship;
        that.info.links[that.link_id].citation = that.new_reference;
        that.dialogFormVisible_change_link_name = false;

        that.btnChangeEnable = true;




        let node_to_string = that.info.nodes.map(function (element) {
            return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
                'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
                'x': element.x, 'y':element.y, 'fixed': true
            };
        });


        let link_to_string = that.info.links.map(function (element) {
            return {
                "source": element.source.id,
                "target": element.target.id,
                "id": element.id,
                "type": element.type,
                "citation": {},
                "label": element.label,

            }

        });

        let new_info = [];
        new_info.nodes = node_to_string;
        new_info.links = link_to_string;

        that.renderGraph(new_info);

        if (that.config.Citations === false) {
            let changeLink = `{"method":"changeLink", "data":{"user":\"${that.username}\",
                    "origin":\"${that.info.links[that.link_id].source.properties.name}\",
                     "target":\"${that.info.links[that.link_id].target.properties.name}\",
                    "oldLabel":\"${oldLabel}\", "newLabel":\"${that.new_relationship}\"}}`;
            that.websocketsend(changeLink);

        }else{
            let changeLink = `{"method":"changeLink", "data":{"user":\"${that.username}\",
                    "origin":\"${that.info.links[that.link_id].source.properties.name}\",
                     "target":\"${that.info.links[that.link_id].target.properties.name}\",
                    "oldLabel":\"${oldLabel}\", "newLabel":\"${that.new_relationship}\",
                    "citation":\"${that.new_reference}\"}}`;
            that.websocketsend(changeLink);

        }

        that.new_reference = '';
        that.new_relationship = '';


        // this.submitData();
        that.selectClear();

    }else{

        that.dialogFormVisible_change_link_name = true;
        that.$message(

            {
                type: 'warning',
                message: 'Invalid URL!'
            });
        that.new_reference = '';


    }

};

export const changeRelationName = (that) =>{

    let oldLabel = that.info.links[that.link_id].label;
    that.info.links[that.link_id].label = that.new_relationship;
    that.dialogFormVisible_new_relationship = false;


    let node_to_string = that.info.nodes.map(function (element) {
        return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
            'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
            'x': element.x, 'y':element.y, 'fixed': true
        };
    });


    let link_to_string = that.info.links.map(function (element) {
        return {
            "source": element.source.id,
            "target": element.target.id,
            "id": element.id,
            "type": element.type,
            "citation": element.citation,
            "label": element.label,

        }

    });


    let new_info = [];
    new_info.nodes = node_to_string;
    new_info.links = link_to_string;

    that.renderGraph(new_info);

    if (that.config.Citations === false) {
        let changeLink = `{"method":"changeLink", "data":{"user":\"${that.username}\",
                    "origin":\"${that.info.links[that.link_id].source.properties.name}\",
                     "target":\"${that.info.links[that.link_id].target.properties.name}\",
                    "oldLabel":\"${oldLabel}\", "newLabel":\"${that.new_relationship}\"}}`;
        that.websocketsend(changeLink);

    }else{
        let changeLink = `{"method":"changeLink", "data":{"user":\"${that.username}\",
                    "origin":\"${that.info.links[that.link_id].source.properties.name}\",
                     "target":\"${that.info.links[that.link_id].target.properties.name}\",
                    "oldLabel":\"${oldLabel}\", "newLabel":\"${that.new_relationship}\",
                    "citation":\"${that.new_reference}\"}}`;
        that.websocketsend(changeLink);

    }
    that.new_relationship = '';
    that.selectClear();
};

export const deleteLink = (that,link,selected_link) =>{
    that.info.links.splice(link,1);
    let removeLink = `{"method":"removeLink",
                                 "data":{"user":\"${that.username}\", "origin":\"${selected_link.source.properties.name}\",
                                 "target":\"${selected_link.target.properties.name}\",
                                 "label":\"${selected_link.label}\"}}`;
    that.websocketsend(removeLink);

    // this.submitData();
    let node_to_string = that.info.nodes.map(function (element) {
        return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
            'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
            'x':element.x, 'y':element.y,'fx':element.x, 'fy':element.y, 'fixed': true
        };
    });


    let link_to_string = that.info.links.map(function (element) {
        return {
            "source": element.source.id,
            "target": element.target.id,
            "id": element.id,
            "type": element.type,
            "properties": {},
            "label": element.label,
            "citation":element.citation,
            'fixed': true
        }

    });


    let new_info = [];
    new_info.nodes = node_to_string;
    new_info.links = link_to_string;
    that.info = new_info;
    that.renderGraph(that.info);
};

