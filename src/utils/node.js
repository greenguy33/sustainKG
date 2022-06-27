
export const addNodes_by_dbclick = (username, info,nodes, input,snippet,scale,mx,my,that) => {
    let containSame = false;
    for (let i = 0; i < info.nodes.length; i++) {

        if (info.nodes[i].properties.name === input) {
            containSame =  true;
        }
    }
    if (containSame === false) {
        let new_node = {
            'id': nodes.length,
            "type": "node",
            'properties': {'name': input},
            'label': 'Concept',
            'snippet':snippet,
            'if_expanded':false,
            "x":mx/scale,
            "y":my/scale,
            'fixed':true
        };
        info.nodes.push(new_node);
        let node_to_string = info.nodes.map(function (element) {
            return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
                'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
                'x': element.x, 'y':element.y, 'fixed':true
            };
        });
        let link_to_string = info.links.map(function (element) {
            return {
                "source": element.source.id,
                "target": element.target.id,
                "id": element.id,
                "type": element.type,
                "citation": element.citation,
                "label": element.label


            }

        });
        let new_info = [];
        new_info.nodes = node_to_string;
        new_info.links = link_to_string;
        info = new_info;
        let addNode =`{"method":"addNode","data":{"user": \"${username}\",
        "node":\"${input}\","xpos": \"${mx/ scale}\","ypos":\"${my / scale}\" }}`;
        console.log('add node request',addNode)
        that.websocketsend(addNode);
        that.renderGraph(info);
        return true
    }
    else{
        that.$message({
            'type': 'warning',
            'message': 'There is already a concept with that name!'
        })
        return false
    }

};

export const deleteNode = (that, node, select_node) =>{
    // console.log('test !!!',select_node,node);
    that.info.nodes.splice(node,1);
    for(let i =that.info.links.length-1; i>=0; i-- )
    {
        console.log('link index',i,node);
        if(that.info.links[i].source.id === node
            || that.info.links[i].target.id === node)
        {
            that.info.links.splice(i,1);
        }

    }

    // console.log('after delete', this.info);
    for(let i = 0; i < that.info.nodes.length;i++)
    {
        // console.log(i);
        // console.log(this.info.nodes[i].id,this.info.nodes[i].index);
        that.info.nodes[i].id = i;
        for(let j =0; j<that.info.links.length; j++){
            if(that.info.links[j].source.properties.name === that.info.nodes[i].properties.name){
                that.info.links[j].source.id = that.info.nodes[i].id
            }
            if(that.info.links[j].target.properties.name === that.info.nodes[i].properties.name){
                that.info.links[j].target.id = that.info.nodes[i].id
            }
        }
    }




    let node_to_string = that.info.nodes.map(function (element) {
        return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
            'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
            'x':element.x, 'y':element.y,  'fixed': true
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
            'x_end':element.x_end,
            'x_start':element.x_start,
            'y_end': element.y_end,
            'y_start': element.y_start,
            'fixed': true,
        }

    });


    let new_info = [];
    new_info.nodes = node_to_string;
    new_info.links = link_to_string;

    // this.renderGraph(new_info);

    that.renderGraph(new_info);
    let removeNode = `{"method":"removeNode",
                                "data":{"user":\"${that.username}\","node":\"${select_node.properties.name}\"}}`;
    that.websocketsend(removeNode);
};

export const changeConceptName =(that)=>{
    let old_name = that.info.nodes[that.node_id].properties.name;

    that.info.nodes[that.node_id].properties.name = that.new_node_name;
    that.info.nodes[that.node_id].snippet = that.select_snippet;
    that.dialogFormVisible_change_node_name = false;

    // this.optionVisible = false;
    // this.optionVisible_link = false;
    that.btnChangeEnable = true;

    let node_to_string = that.info.nodes.map(function (element) {
        return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
            'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
            'x': element.x, 'y':element.y,'fixed': true
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
    let changeNode = `{"method":"changeNode",
                "data":{"user":\"${that.username}\",
                "oldNode":\"${old_name}\","newNode":\"${that.new_node_name}\"}}`;

    that.websocketsend(changeNode);
    // this.submitData();
    // this.renderGraph(this.info);
    that.selectClear();
};