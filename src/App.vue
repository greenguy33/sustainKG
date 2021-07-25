<template>





    <div id="app">
        <el-row>
            <el-header style="text-align: right;height: 40px;">
                <div class="grid-content ">
                    <template >
                        <el-button style="margin-right: 5px;"  @click="onTapLogin" v-show="showLogin" size="small" round>Login</el-button>
                        <el-button style="margin-right: 5px;" size="small" type="success" v-show="!showLogin" round>{{username}}</el-button>
                        <el-button  @click="logout" size="small" v-show="!showLogin" round>Logout</el-button>
                    </template>
                </div>
            </el-header>

            <el-dialog
                    title="Login"
                    :visible.sync="centerDialogVisible"
                    width="30%"
                    center>
                <span>Username<el-input v-model="username" placeholder="Please Input Username"></el-input></span>
                <br><br>
                <span>Password<el-input type="password" v-model="password" placeholder="Please Input Password"></el-input></span>
                <el-button type="text" style="margin-top: 15px;" @click.native="dialog_createUser=true; centerDialogVisible=false">No account?</el-button>
                <span slot="footer" class="dialog-footer">
            <el-button @click.native="centerDialogVisible=false">Cancel</el-button>
            <el-button type="primary" @click.native="handleShow" >Yes</el-button>
          </span>
            </el-dialog>


            <el-dialog
                    title="Create New Account"
                    :visible.sync="dialog_createUser"
                    width="30%"
                    center>
                <span>Username<el-input v-model="newUsername" placeholder="Please Input Username"></el-input></span>
                <br><br>
                <span>Password<el-input type="password" v-model="newPassword" placeholder="Please Input Password"></el-input></span>
                <span slot="footer" class="dialog-footer">
            <el-button @click.native="dialog_createUser=false">Cancel</el-button>
            <el-button type="primary" @click="createUser" >Yes</el-button>
          </span>
            </el-dialog>





        </el-row>

        <el-container>

            <el-row class="tac">
                <el-col >
                    <h5>SustainKG</h5>
                    <el-menu

                            default-active="2"
                            class="el-menu-vertical-demo"

                    >
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>Operation</span>
                            </template>
                            <el-menu-item-group>
                                <!--<template slot="title">分组一</template>-->
                                <el-menu-item index="1-1" @click="submitData()">Submit Data</el-menu-item>
                                <el-menu-item index="1-2">Upload Data</el-menu-item>
                                <el-menu-item index="1-3" @click="reload()">Reload Data</el-menu-item>
                            </el-menu-item-group>


                        </el-submenu>
                        <el-menu-item >
                            <i class="el-icon-menu"></i>
                            <span slot="title">Node Number：{{ info.nodes.length }}</span>
                        </el-menu-item>
                        <el-menu-item >
                            <i class="el-icon-setting"></i>
                            <span slot="title">Link Number：{{ info.links.length }}</span>
                        </el-menu-item>
                    </el-menu>
                </el-col>


                <router-view></router-view>

            </el-row>



            <el-dialog :visible.sync="dialogFormVisible"
                       title="Create Node" center
            >

                Node Name
                <el-select

                        @keyup.native = "showOption"
                        label-position="right"
                        label-width="86px"
                        style="width: 300px; margin-left:50px;"

                        v-model="node_value"
                        placeholder="Please select"
                        clearable
                        filterable
                        @blur="showOption"
                        @clear="selectClear"
                        @change="selectChange"
                >
                    <div  v-show="optionVisible">
                    <el-option

                        v-for="(item,index) in node_list"
                        :key="index"
                        :label="item.label"
                        :value="item.value" ></el-option>
                    </div>
                </el-select>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">
                        No
                    </el-button>
                    <el-button type="primary" :disabled="btnChangeEnable" @click="addNodes">
                        Yes
                    </el-button>
                </div>
            </el-dialog>


            <el-dialog :visible.sync="dialogFormVisible_change_node_name"
                       title="Change Node Name" center
            >

                    Node Name
                <el-select
                        label-position="right"
                        label-width="86px"
                        style="width: 300px; margin-left:30px;"

                        v-model="new_node_name"
                        placeholder="Please select"
                        clearable
                        filterable
                        @blur="selectBlur"
                        @clear="selectClear"
                        @change="selectChange"
                ><el-option
                        v-for="(item,index) in node_list"
                        :key="index"
                        :label="item.label"
                        :value="item.value" ></el-option>
                </el-select>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">
                        No
                    </el-button>
                    <el-button type="primary" :disabled="btnChangeEnable" @click="change_node_name">
                        Yes
                    </el-button>
                </div>
            </el-dialog>



            <el-dialog :visible.sync="dialogFormVisible_link"

                       title="Create Link" center>

                Link Name

                <el-select
                        label-position="right"
                        label-width="86px"
                        style="width: 300px; margin-left:50px;"

                        v-model="link_value"
                        placeholder="Please select"
                        clearable
                        filterable
                        @blur="selectBlur"
                        @clear="selectClear"
                        @change="selectChange"
                ><el-option
                        v-for="(item,index) in link_list"
                        :key="index"
                        :label="item.label"
                        :value="item.value" ></el-option>
                </el-select>


                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">
                        No
                    </el-button>
                    <el-button type="primary" :disabled="btnChangeEnable"  @click="addLinks">
                        Yes
                    </el-button>
                </div>
            </el-dialog>

            <el-dialog :visible.sync="dialogFormVisible_change_link_name"
                       title="Change Link Name" center>

                Link Name
                <el-select
                        label-position="right"
                        label-width="86px"
                        style="width: 300px; margin-left:30px;"

                        v-model="new_link_name"
                        placeholder="Please select"
                        clearable
                        filterable
                        @blur="selectBlur"
                        @clear="selectClear"
                        @change="selectChange"
                ><el-option
                        v-for="(item,index) in link_list"
                        :key="index"
                        :label="item.label"
                        :value="item.value" ></el-option>
                </el-select>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel">
                        No
                    </el-button>
                    <el-button type="primary" :disabled="btnChangeEnable" @click="change_link_name">
                        Yes
                    </el-button>
                </div>
            </el-dialog>


            <el-main id="graph">
                <!--<div id="graph"></div>-->
            </el-main>




        </el-container>




    </div>

</template>

<script>
    import * as d3 from "d3";

    import $ from 'jquery'
    import {
        getNodeSelfPath,
        setLinkGroup,
        getNodesLine,} from './utils/deviceRelation'




    export default {


        data(){



            let info = {
                "links": [
                    {
                        "source" : 0,
                        "target" : 1,
                        "type" : "link",
                        'label': 'Link TEST',
                        "properties":{}

                    },

                ],
                "nodes": [
                    {
                        "id": 0,
                        "type" : "node",
                        // "factoryCode" : "hello",
                        "label" : "Device",
                        "properties":{"name":"hello"}
                        // "linkId": 1
                    },
                    {
                        "id": 1,
                        "type" : "node",
                        // "factoryCode": "Will",
                        "label": "Device",
                        "properties":{"name":"will"}
                        // "linkId": 0
                    },
                    {
                        "id": 2,
                        "type" : "node",
                        // "factoryCode": "lala",
                        "label": "Device",
                        "properties":{"name":"lala"}
                        // "linkId": 1
                    },

                ]
            };



            return {

                //////////////////////////////////////

                // log function parameters
                username:'',
                password:'',
                newUsername:'',
                newPassword:'',
                showLogin:true,
                centerDialogVisible:false,
                dialog_createUser:false,
                optionVisible:false,


                //////////////////////////////////////

                node_value: '',
                link_value:'',
                btnChangeEnable: true,
                node_list: [
                    {
                        value: 'node1',
                        label: 'node1'
                    },

                    {
                        value: 'node2',
                        label: 'node2'
                    },

                    {
                        value: 'test3',
                        label: 'test3'
                    },
                    {
                        value: 'bbb',
                        label: 'bbb'
                    }
                ],

                link_list: [
                    {
                        value: 'link1',
                        label: 'link1'
                    },
                    {
                        value: 'link2',
                        label: 'link2'
                    },
                    {
                        value: 'test_3',
                        label: 'test_3'
                    }
                ],

                // info: {
                //     nodes:[],
                //     links:[]
                // },

                info: info,

                ifClicked:false,

                selected_Node: '',

                dialogFormVisible:false,
                dialogFormVisible_link:false,
                dialogFormVisible_change_node_name:false,
                dialogFormVisible_change_link_name:false,
                temp : [],
                clickTimeId : 0,

                node_id: '',
                link_id: '',
                new_link_name:'',
                new_node_name:'',

                menu: [
                    {
                        title: 'Delete Nodes',
                        action: (node,select_node) => {

                            this.$confirm("Delete this node?", "Tips", {
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                                type: "warning",
                            }).then(() => {
                                this.$message(

                                    {
                                        type: 'success',
                                        message: 'The node is deleted!'
                                    });
                                console.log('test !!!',select_node,node);
                                this.info.nodes.splice(node,1);
                                for(let i =this.info.links.length-1; i>=0; i-- )
                                {
                                    console.log('link index',i,node);
                                    if(this.info.links[i].source === select_node
                                        || this.info.links[i].target === select_node)
                                    {
                                        this.info.links.splice(i,1);
                                    }

                                }

                                console.log('after delete', this.info)
                                this.renderGraph(this.info);

                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: 'Cancel Delete!'
                                })

                            });

                        },


                    },
                    {
                        title: 'Change Node Name',
                        action:(node_id)=>{
                            this.dialogFormVisible_change_node_name = true;
                            this.node_id = node_id;

                        },

                    },

                ],

                menu_edge:[
                    {
                        title: 'Delete Links',
                        action: (link,selected_link) => {
                            console.log('ll',link,selected_link);
                            this.$confirm("Delete this link?", "Tips", {
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                                type: "warning",
                            }).then(() => {
                                this.$message(

                                    {
                                        type: 'success',
                                        message: 'The link is deleted!'
                                    });
                                this.info.links.splice(link,1);
                                this.renderGraph(this.info);

                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: 'Cancel Delete!'
                                })

                            });

                        },

                    },
                    {
                        title: 'Change link Name',
                        action:(link_id)=>
                        {
                            this.dialogFormVisible_change_link_name = true;
                            this.link_id = link_id;

                        }

                    }
                ],



            }
        },

        mounted() {

            this.renderGraph(this.info);

        },

        methods: {
            ////////////////////////////////////////////////////////////
            // login functions

            createUser:function(){

                this.dialog_createUser  = false;
                console.log('create user function',this.newUsername, this.newPassword)


            },

            handleShow:function(){
                let that = this;
                let user = 'sqy';
                let pass = '123';
                if(user === this.username && pass === this.password)
                {
                    this.showLogin=false;
                    this.centerDialogVisible=false;
                    // this.$router.push({ path: '/home' })
                    this.$axios({
                        url:'/getUserGraph',
                        method:'post',
                        data:{
                            user : "some_user"
                        }

                    }).then(response=>{
                        console.log(response.data);
                        let user_nodes = response.data.nodes;
                        let user_links = response.data.links;
                        // let test = response.data;

                        let change_node_type = user_nodes.map(function (element) {
                             element.id  = Number(element.id);
                             return element
                        });

                        let change_link_type = user_links.map(function (element) {
                            element.id  = Number(element.id);
                            element.source  = Number(element.source);
                            element.target  = Number(element.target);
                            return element
                        });

                        console.log(change_node_type);
                        console.log(change_link_type);
                        this.info.nodes = change_node_type;
                        this.info.links = change_link_type;
                        // this.info = response.data;

                        this.renderGraph(this.info)
                    })

                }
                else{
                    alert('Wrong username or password')
                }
                console.log(this.username,this.password)

            },

            onTapLogin:function () {
                this.centerDialogVisible=true
            },

            logout:function () {
                this.showLogin = true;
                this.username = '';
                this.password = '';
                this.info= {
                    nodes:[],
                        links:[]
                };

                this.renderGraph(this.info)

                // this.$router.push({ path: '/' })
            },

            ////////////////////////////////////////////////////////////



            showOption()
            {
                let inputContent = document.getElementsByClassName('el-input__inner')[0].value;
                console.log(inputContent.length);

                this.optionVisible = inputContent.length !== 0;
                console.log('option',this.optionVisible);
                this.$forceUpdate()
            },


            selectBlur(e) {
                // 意见类型
                this.btnChangeEnable = true;
                if (e.target.value !== '') {
                    console.log('No selection',e.target.value);
                    // this.$forceUpdate()   // 强制更新
                }
                this.$forceUpdate()
                this.selectClear()
            },

            selectClear() {
                this.node_value = '';
                this.link_value = '';
                this.new_node_name = '';
                this.new_link_name = '';
                this.optionVisible = false;
                this.$forceUpdate()
            },

            selectChange(val) {

                if(val !== '')
                {
                    this.btnChangeEnable = false
                }
                if(this.dialogFormVisible_link===true){
                    this.link_value = val
                }
                else if (this.dialogFormVisible_change_link_name === true){
                    this.new_link_name = val
                }
                else if (this.dialogFormVisible_change_node_name === true){
                    this.new_node_name = val
                }
                else if(this.dialogFormVisible === true){
                    this.node_value = val;
                }
                this.$forceUpdate()
            },


            cancel()
            {
                this.dialogFormVisible = false;
                this.dialogFormVisible_link = false;
                this.dialogFormVisible_change_node_name = false;
                this.dialogFormVisible_change_link_name = false;
                this.selectClear();
                this.temp.length = 0;
                this.btnChangeEnable = true;
            },

            addNodes(){
                this.dialogFormVisible = false;
                this.doubleClick(this.info, this.info.nodes, this.node_value);
                this.selectClear();
                this.optionVisible = false;
                this.btnChangeEnable = true;

            },

            change_node_name(){

                this.info.nodes[this.node_id].properties.name = this.new_node_name;
                this.dialogFormVisible_change_node_name = false;
                this.selectClear();
                this.btnChangeEnable = true;
                this.renderGraph(this.info);
            },


            change_link_name()
            {

                this.info.links[this.link_id].label = this.new_link_name;
                this.dialogFormVisible_change_link_name = false;
                this.selectClear();
                this.btnChangeEnable = true;
                this.renderGraph(this.info)
            },

            addLinks()
            {

                this.dialogFormVisible_link = false;

                if (this.temp.length === 2) {
                    this.singleClick(this.info, this.selected_Node, this.link_value);
                }

                this.$message(

                    {
                        type: 'success',
                        message: 'Add Links!'
                    });
                this.btnChangeEnable = true;
                this.selectClear()

            },


            renderGraph(info) {
                // let temp = [];


                console.log('render data',info);
                let {links, nodes} = info;

                //关系分组
                setLinkGroup(links);

                //点击节点后弹出的灰色圆圈以及图标的定义，分为三组【1.删除、2.联系、3.解除位置锁定】
                let [removePath,remove_rect1,remove_rect2,remove_line1,remove_line2,remove_line3] = [null];
                let [unlockPath,unlock_path1,unlock_rect1,unlock_line1] = [null];
                let [hidePath,hide_path1,hide_path2,hide_path3,hide_path4,hide_circle1,hide_line1] = [null];
                let rightArc = d3.svg.arc().outerRadius(60).innerRadius(30).startAngle(0).endAngle(1.85);
                let leftArc = d3.svg.arc().outerRadius(60).innerRadius(30).startAngle(4.5).endAngle(6.23);
                let bottomArc = d3.svg.arc().outerRadius(60).innerRadius(30).startAngle(1.9).endAngle(4.45);

                d3.select("#graph").html('');


                let force = d3.layout.force()//layout将json格式转化为力学图可用的格式
                    .nodes(nodes)//设定节点数组
                    .links(links)//设定连线数组
                    .linkDistance(500)//连接线长度
                    .charge(-1500)//顶点的电荷数。该参数决定是排斥还是吸引，数值越小越互相排斥
                    .on("tick", function (){
                            tick()
                        },
                    )//指时间间隔，隔一段时间刷新一次画面
                    .start();//开始转换



                let zoom = d3.behavior.zoom()
                    .scaleExtent([.4, 2])
                    .on("zoom", zoomed);

                let svg = d3.select("#graph").append("svg")
                    .attr("pointer-event", "all")
                    .attr("preserveAspectRatio", "xMidYMid meet")//自适应容器大小
                    .attr("viewBox", "-460 -220 1200 1200")
                    // .on("dblclick", doubleClick)
                    .call(zoom);




                // old_nodes = nodes;
                let circle_g = svg.selectAll("circle")
                    .data(force.nodes())//表示使用force.nodes数据
                    .enter()
                    .append("g")
                    .attr("class",function(node,i){
                        return "g_circle_" + i; })//标记circle的父节点
                    .style("cursor","pointer")
                    .call(drag()) //将当前选中的元素传到drag函数中，使顶点可以被拖动
                    .on("click", (node, i,) => {
                        if (d3.event.defaultPrevented) return;

                        // console.log('鼠标单击',this.clickTimeId);
                        // console.log(d3.select(this))
                        clearTimeout(this.clickTimeId);

                        this.clickTimeId = setTimeout( ()=> {

                                // console.log("鼠标单击");

                                // this.selected_Node = node;
                                // this.addLinks()
                                // console.log('selected_Node',this.selected_Node)
                                this.temp.push(node.index);
                                console.log('liuliu',this.temp);
                                if(this.temp.length === 2 && this.temp[0] !== this.temp[1]){
                                    this.dialogFormVisible_link = true;

                                }
                                else if(this.temp.length === 2 && this.temp[0] === this.temp[1])
                                {
                                    this.temp.length = 0
                                }
                                // this.singleClick(info, node, temp, this.state2);
                                clickStyle(node, i, this);
                            }
                            , 250);
                    })

                    // .on('mouseover', (node) => {
                    //     if (d3.event.defaultPrevented) return;
                    //     // showNodeInfo(node, this);
                    //     // showCircleBorderOuterArc(node, i);
                    // })
                    .on("dblclick", (node, )=>{


                        if (d3.event.defaultPrevented) return;
                        console.log('double click',nodes);
                        clearTimeout(this.clickTimeId);
                        console.log('双击',this.clickTimeId);
                        this.dialogFormVisible = true;
                        // this.doubleClick(info, node, nodes, links)


                    })
                    .on('contextmenu',(d,node)=>{
                        console.log('node!!!!!',d,node);
                        Menu(this.menu)(d, d3.event, node)

                    });




                svg.on("dblclick.zoom", null);//取消svg和圆圈的双击放大事件（d3中默认开启7个事件，关闭防止与上面的双击事件冲突）
                circle_g.on("dblclick.zoom", null);



                //单击改变节点颜色 表明选中
                function clickStyle(node, i, _this){

                    console.log(_this.ifClicked);
                    // _this.ifClicked = true;


                    circle_g.attr('node', function(n) {

                        console.log('click change color',n.id,node.id);
                        console.log('selected node',n.index,node.index);

                        if(n.index === node.index && _this.ifClicked===false ) {
                            d3.select('.g_circle_'+ n.index).select('circle').style('fill','red');
                            // 有问题！！！！！！！
                            console.log('haha',d3.select('.g_circle_'+ n.index).select('circle'));
                            _this.ifClicked = true;
                            console.log('新选的 true',_this.ifClicked);

                        }
                        else if(n.index === node.index && _this.ifClicked===true )
                        {
                            d3.select('.g_circle_'+ n.index).select('circle')
                                .style('fill', function (node) { return getCircleColor(node);});
                            _this.ifClicked = false;
                            console.log('重复选的颜色变回去 false',_this.ifClicked);

                        }
                        else if(n.index !== node.index) {
                            console.log('node are different');
                            d3.select('.g_circle_'+ n.index)
                                .select('circle')
                                .style('fill', function (node) { return getCircleColor(node);})

                        }
                    });
                }




                //圆圈
                let circle = circle_g.append("circle")
                    .style("stroke-width", "2px")
                    .attr("r", 30)//设置圆圈半径
                    .style("fill", function (node) { return getCircleColor(node); });

                let text = circle_g.append("text")
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")//在圆圈中加上数据
                    .style('fill', "#FFFFFF")
                    .attr('x',function(d){ appendCircleText(d, this); });

                //圆圈的提示文字
                circle.append("svg:title").text(function(node) {
                    switch (node.type) {
                        case 'node': return node.properties.name;
                        // case 'Device': return node.factoryCode;
                        // case 'Application': return node.applicationName;
                        // case 'Position': return node.positionCode;
                        // case 'Manufacturer': return node.manufacturerName;
                        // case 'IotInfrastructure': return node.iotInfrastructureName;
                        // case 'DeviceAdmin': return node.name;
                    }
                });
                text.append("svg:title").text(function(node) {
                    switch (node.type) {
                        case 'node': return node.properties.name;
                        // case 'Device': return node.factoryCode;
                        // case 'Application': return node.applicationName;
                        // case 'Position': return node.positionCode;
                        // case 'Manufacturer': return node.manufacturerName;
                        // case 'IotInfrastructure': return node.iotInfrastructureName;
                        // case 'DeviceAdmin': return node.name;
                    }
                });
                //设置连接线
                let defs = svg.append("defs");

                defs.append("marker")
                    .attr("id", "end")
                    .attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
                    .attr("markerUnits", "userSpaceOnUse")
                    .attr("markerWidth", 20)//标识的大小
                    .attr("markerHeight", 20)
                    .attr("viewBox", "0 -4 12 15")//坐标系的区域
                    .attr("refX", 0)//箭头坐标
                    .attr("refY", 0)
                    .attr("orient", 'auto')//绘制方向，可设定为：auto（自动确认方向）和 角度值
                    .append("svg:path")
                    .attr("stroke-width",5)//箭头宽度
                    .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                    .attr('fill', 'rgba(0,0,0, 0.4)');//箭头颜色

                defs.append("marker")
                    .attr("id", "start")
                    .attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
                    .attr("markerUnits", "userSpaceOnUse")
                    .attr("markerWidth", 20)//标识的大小
                    .attr("markerHeight", 20)
                    .attr("viewBox", "0 -4 12 15")//坐标系的区域
                    .attr("refX", 0)//箭头坐标
                    .attr("refY", 0)
                    .attr("orient", 'auto')//绘制方向，可设定为：auto（自动确认方向）和 角度值
                    .append("svg:path")
                    .attr("stroke-width",5)//箭头宽度
                    .attr("d", "M0,0L10,-5L10,5")//箭头的路径
                    .attr('fill', 'rgba(0,0,0, 2)');//箭头颜色

                const edges_line = svg.append("g").selectAll(".edgepath")
                    .data(force.links())
                    .enter()
                    .append("path")

                    // .attr('marker-end', function(d,i) {
                    //     console.log('lala',d.label,d.x_start)
                    //     if (d.x_start < d.x_end) {
                    //         console.log('source < end')
                    //         return  "url(#end)";
                    //     }
                    //     return ''
                    // })
                    // .attr('marker-start', function(d,i) {
                    //     if (d.x_start >= d.x_end) {
                    //         console.log('source > end')
                    //         return "url(#start)";
                    //     }
                    //     return ''
                    //
                    // })
                    // .attr("marker-start", "url(#start)")
                    // .attr("marker-end",  function (d, i) { return getMarkerArrow(i); })//根据箭头标记的id号标记箭头
                    // .attr("marker-end",  )//根据箭头标记的id号标记箭头
                    .style("stroke", 'black')
                    .style("stroke-width", 3)//线条粗细
                    .style("fill-opacity",0)
                    .style("cursor","pointer")
                    .attr("id", function (d, i) { return 'edgepath' + i; })
                    .on("mouseover", function(d){ return getStrokeWidth(d); })
                    .on("mouseout", function() { edges_line.style("stroke-width", 3) })
                    // .on('click', (link) => { this.deleteLine(this.info,link); })
                    .on('contextmenu',(d,link)=>{
                        console.log(d);
                        console.log('link!!!',link)
                        Menu(this.menu_edge)(d,d3.event,link)

                    });

                const edges_text = svg.append("g").selectAll(".edgetext")
                    .data(links)
                    .enter()
                    .append("text")
                    .style("pointer-events", "none")
                    .attr("class","linetext")
                    .attr('text-anchor', "middle")
                    .attr("fill-opacity", 0.5)
                    .style("cursor","pointer")

                    .attr({'class': 'edgelabel',
                        'id': function (d, i) { return 'edgepath' + i; },
                        'dx': 190, 'dy': 20,
                        'fill':'black',
                        // 'transform': edge_text_Position()
                    });



                function edge_text_Position(){

                    return 'rotate(180,40,5)'
                }



                //设置线条上的文字
                edges_text.append('textPath')
                    .attr('xlink:href', function (d, i) { return '#edgepath' + i })
                    .attr("pointer-events", "none")
                    .attr("font-size", 20)
                    .text(function (d) { return d.label; });



                // force.on("tick", tick)//指时间间隔，隔一段时间刷新一次画面
                //     .start();//开始转换
                function zoomed() {//svg下的g标签移动大小
                    svg.selectAll("g").attr("transform", "translate("  +d3.event.translate + ")scale(" +d3.event.scale + ")");
                }

                function getMarkerArrow(i) {
                    svg.append("defs").append("marker")   //箭头
                        .attr("id", "arrow"+i)
                        .attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
                        .attr("markerUnits", "userSpaceOnUse")
                        .attr("markerWidth", 20)//标识的大小
                        .attr("markerHeight", 20)
                        .attr("viewBox", "0 -4 12 15")//坐标系的区域
                        .attr("refX", 0)//箭头坐标
                        .attr("refY", 0)
                        .attr("orient", 'auto')//绘制方向，可设定为：auto（自动确认方向）和 角度值
                        .append("svg:path")
                        .attr("stroke-width",5)//箭头宽度
                        .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                        .attr('fill', 'rgba(0,0,0, 0.4)');//箭头颜色
                    return "url(#arrow_end" + i + ")";
                }



                function getStrokeWidth(d) {
                    edges_line.style("stroke-width", function (edge) {
                        // return edge.relation.relationshipId === d.relation.relationshipId ? 3 : 1;
                        return 6
                    });
                }

                function drag(){//拖拽函数
                    return force.drag().on("dragstart",function(d){
                        d3.event.sourceEvent.stopPropagation(); //取消默认事件
                        d.fixed = true;//拖拽开始后设定被拖拽对象为固定
                    });
                }

                function circleClick(node, i, _this) {
                    //获取当前节点是否包含圆环
                    let existedRing = svg.select('.g_circle_' + i).selectAll('.g_circle_path');
                    //清除上个节点的圆圈以及图标
                    svg.selectAll('.g_circle_path').remove();
                    svg.selectAll('.remove_a').remove();
                    svg.selectAll('.hide_a').remove();
                    svg.selectAll('.unlock_a').remove();
                    if(existedRing && existedRing[0].length === 0) {
                        //showCircleBorderOuterArc(node, i);
                        //绘制灰色可点击圆圈，分为三部分分别绘制
                        showRemove(node, i, _this);
                        showUnlock(node, i, _this);
                        showHide(node,i, _this);
                    }
                }

                function getCircleColor(node) {
                    let color = {
                        'Device': "#FF9D00",
                        'Position': "#C477E9",
                        'Work': '#67CAF4',
                        'Install': '#BCDD73',
                        'Application': '#DD1E9E',
                        'Manufacturer': '#DDBA9E',
                        'IotInfrastructure': '#6ca5dd',
                        'DeviceAdmin': '#50DD87',
                    };//圆圈背景色
                    return color[node.label] || '#C477E9';
                }

                function appendCircleText(d, _this) {
                    let circleText = '';
                    if(d.type === 'node' && d.properties.name) {
                        circleText = d.properties.name;
                    } else if(d.label === 'Position') {
                        circleText = d.positionCode;
                    } else if (d.label === 'Application') {
                        circleText = d.applicationName;
                    } else if (d.label === 'Manufacturer') {
                        circleText = d.manufacturerName;
                    } else if (d.label === 'IotInfrastructure') {
                        circleText = d.iotInfrastructureName;
                    } else if (d.label === 'DeviceAdmin') {
                        circleText = d.name;
                    }
                    //如果小于四个字符，不换行
                    if(circleText && circleText.length > 14){
                        circleText = circleText.substring(0,14) + "...";
                        d3.select(_this).text(function(){return '';});
                    }
                    d3.select(_this).append('tspan').attr('x',0).attr('y',0).attr("font-size", 10)
                        .text(function(){ return circleText; });
                }






                function tick() {

                    circle.attr("transform", transform1);//圆圈
                    text.attr("transform", transform2);//顶点文字
                    //link奇数有问题
                    edges_line
                        .attr('d', function (d) {

                        return getNodesLine(d,edges_line,defs);//曲线路径

                    });
                    edges_line.attr('marker-end', function(d,i) {
                            if (d.x_start < d.x_end) {
                                // console.log('source < end')
                                return  "url(#end)";
                            }
                            return ''
                        }).attr('marker-start', function(d,i) {
                        if (d.x_start >= d.x_end) {
                            // console.log('source > end')
                            return "url(#start)";
                        }
                        return ''

                    })
                    ;

                    // if(circleBorderOuterArcObj !== null) {
                    //   circleBorderOuterArcObj.attr("transform", function (d){ return "translate("+d.x+","+d.y+")" });
                    // }

                    //绘制节点删除功能半圆环
                    // if(removePath !== null) {
                    //     removePath.attr("transform", function (d){ return "translate("+d.x+","+d.y+")" });
                    //
                    //     let r1 = null;
                    //     remove_rect1.attr('d',function(d) { r1 = d; })
                    //         .attr("x",r1.x + 33 + 6.75).attr("y",r1.y  - 36 + 9.75).attr("width",5).attr("height",3).attr("rx",1.5).attr("ry",1.5);
                    //
                    //     let r2 = null;
                    //     remove_rect2.attr('d',function(d) { r2 = d; })
                    //         .attr("x",r2.x + 30 + 6.75).attr("y",r2.y  - 33 + 9.75).attr("width",12).attr("height",14).attr("rx",1.5).attr("ry",1.5);
                    //
                    //     let l1 = null;
                    //     remove_line1.attr('d',function(d) { l1 = d; })
                    //         .attr("x1",l1.x + 28 + 6.75).attr("y1",l1.y - 33 + 9.75).attr("x2",l1.x + 45 + 6.75).attr("y2",l1.y - 33 + 9.75);
                    //
                    //     let l2 = null;
                    //     remove_line2.attr('d',function(d) { l2 = d; })
                    //         .attr("x1",l2.x + 34 + 6.75).attr("y1",l2.y - 30 + 9.75).attr("x2",l2.x + 34 + 6.75).attr("y2",l2.y - 23 + 9.75);
                    //
                    //     let l3 = null;
                    //     remove_line3.attr('d',function(d) { l3 = d; })
                    //         .attr("x1",l3.x + 38 + 6.75).attr("y1",l3.y - 30 + 9.75).attr("x2",l3.x + 38 + 6.75).attr("y2",l3.y - 23 + 9.75);
                    // }

                    //绘制解除节点位置锁定半圆环
                    // if(unlockPath !== null) {
                    //     unlockPath.attr("transform", function (d){ return "translate("+d.x+","+d.y+")" });
                    //     unlock_path1.attr("transform", function (d){ return "translate("+ (d.x - 45) +","+ (d.y - 23) +")" });
                    //
                    //     let r1 = null;
                    //     unlock_rect1.attr('d',function(d) { r1 = d; })
                    //         .attr("x",r1.x  - 52 + 6.75).attr("y",r1.y - 30 + 9.75).attr("width",15).attr("height",12).attr("rx",1.5).attr("ry",1.5);
                    //
                    //     let l1 = null;
                    //     unlock_line1.attr('d',function(d) { l1 = d; })
                    //         .attr("x1",l1.x  - 52 + 15).attr("y1",l1.y  - 30 + 15).attr("x2",l1.x  - 52 +15).attr("y2",l1.y  - 30 + 18);
                    // }

                    // //绘制隐藏节点和关系半圆环
                    // if(hidePath !== null) {
                    //     hidePath.attr("transform", function (d){ return "translate("+d.x+","+d.y+")" });
                    //
                    //     hide_path1
                    //         .attr("d", function(d) {
                    //             return "M" + (d.x - 13) + "," + (d.y + 42) + "A15,15,0,0,1" + (d.x + 13) + "," + (d.y + 42)
                    //         });
                    //     hide_path2
                    //         .attr("d", function(d) {
                    //             return "M"+ (d.x - 12 + 10.4) + "," + (d.y + 34 + 10.937) + "A" + 3.749 + "," + 3.749 + ",0,1,1," + (d.x - 12 + 15.338) + "," + (d.y + 33 + 9)
                    //         });
                    //     hide_path3
                    //         .attr("d", function(d) {
                    //             return "M" + (d.x - 12) + "," + (d.y + 42) + "A20,20,0,0,0" + (d.x - 4) + "," + (d.y + 47)
                    //         });
                    //     hide_path4
                    //         .attr("d", function(d) {
                    //             return "M" + (d.x + 11) + "," + (d.y + 44) + "A20,20,0,0,0" + (d.x + 13) + "," + (d.y + 42)
                    //         });
                    //
                    //     let c1 = null;
                    //     hide_circle1.attr('d',function(d) { c1 = d; })
                    //         .attr("cx",c1.x - 12 + 17.15).attr("cy",c1.y + 33 + 17.25).attr("r",6);
                    //
                    //     let l1 = null;
                    //     hide_line1.attr('d',function(d) { l1 = d; })
                    //         .attr("x1",l1.x - 12 + 14.15).attr("y1",l1.y + 33 + 17.25).attr("x2",l1.x - 12 + 20.15).attr("y2",l1.y + 33 + 17.25);
                    //
                    // }

                }

                //设置圆圈和文字的坐标
                function transform1(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                }

                function transform2(d) {
                    return "translate(" + (d.x) + "," + d.y + ")";
                }
                function showRemove(node, i, _this) {
                    removePath = d3.select('.g_circle_'+ i).append("path").attr('class', 'g_circle_path')
                        .attr("transform", "translate(" + node.x + "," + node.y + ")").attr("d", rightArc)
                        .attr("fill", "rgb(210, 213, 218)")
                        .style("cursor","pointer")
                        // .on("click", () => { removeNodeAndPath(node, _this); })
                        .on("mouseover", function(){ removePath.attr("fill", "rgb(185, 185, 185)") })
                        .on("mouseout", function() { removePath.attr("fill", "rgb(210, 213, 218)") });

                    d3.select('.g_circle_'+ i).append("g").attr("class","remove_a")
                        .attr("transform", "translate(" + (node.x + 33) + "," + (node.y - 24) + ") scale(0.7)")
                        .append("defs").append("style")
                        .text(".remove_a{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}");

                    removePath.append("title").attr("class","remove_a").text("Remove");
                    remove_rect1 = d3.select('.g_circle_'+ i).append("rect").attr("class","remove_a").attr("x",node.x + 33 + 6.75).attr("y",node.y  - 36 + 9.75)
                        .attr("width",5).attr("height",3).attr("rx",1.5).attr("ry",1.5);
                    remove_rect2 = d3.select('.g_circle_'+ i).append("rect").attr("class","remove_a").attr("x",node.x + 30 + 6.75).attr("y",node.y  - 33 + 9.75)
                        .attr("width",12).attr("height",14).attr("rx",1.5).attr("ry",1.5);
                    remove_line1 = d3.select('.g_circle_'+ i).append("line").attr("class","remove_a").attr("x1",node.x + 28 + 6.75).attr("y1",node.y - 33 + 9.75).attr("x2",node.x + 45 + 6.75).attr("y2",node.y - 33 + 9.75);
                    remove_line2 = d3.select('.g_circle_'+ i).append("line").attr("class","remove_a").attr("x1",node.x + 34 + 6.75).attr("y1",node.y - 30 + 9.75).attr("x2",node.x + 34 + 6.75).attr("y2",node.y - 23 + 9.75);
                    remove_line3 = d3.select('.g_circle_'+ i).append("line").attr("class","remove_a").attr("x1",node.x + 38 + 6.75).attr("y1",node.y - 30 + 9.75).attr("x2",node.x + 38 + 6.75).attr("y2",node.y - 23 + 9.75);

                    // d3.selectAll(".remove_a").on("click", () => { removeNodeAndPath(node, _this); })
                }

                function showHide(node,i) {
                    hidePath = d3.select('.g_circle_'+ i).append("path").attr('class', 'g_circle_path')
                        .attr("transform", "translate(" + node.x + "," + node.y + ")").attr("d", bottomArc)
                        .attr("fill", "rgb(210, 213, 218)")
                        .style("cursor","pointer")
                        // .on("click", function(){ hideNodeAndLinks(node) })
                        .on("mouseover", function(){ hidePath.attr("fill", "rgb(185, 185, 185)") })
                        .on("mouseout", function() { hidePath.attr("fill", "rgb(210, 213, 218)") });

                    d3.select('.g_circle_'+ i).append("g").attr("class","hide_a")
                        .attr("transform", "translate(" + (node.x - 8) + "," + (node.y + 38) + ") scale(0.7)")
                        .append("defs").append("style")
                        .text(".hide_a{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}");

                    hidePath.append("title").attr("class","hide_a").text("Hide");

                    hide_path1 = d3.select('.g_circle_'+ i).append("path").attr("class","hide_a")
                        .attr("d", function(d) {
                            return "M" + (d.x - 13) + "," + (d.y + 42) + "A15,15,0,0,1" + (d.x + 13) + "," + (d.y + 42)
                        });
                    hide_path2 = d3.select('.g_circle_'+ i).append("path").attr("class","hide_a")
                        .attr("d", function(d) {
                            return "M"+ (d.x - 12 + 10.4) + "," + (d.y + 34 + 10.937) + "A" + 3.749 + "," +  3.749 + ",0,1,1," + (d.x - 12 + 15.338) + "," + (d.y + 33 + 9)
                        });
                    hide_path3 = d3.select('.g_circle_'+ i).append("path").attr("class","hide_a")
                        .attr("d", function(d) {
                            return "M" + (d.x - 12) + "," + (d.y + 42) + "A20,20,0,0,0" + (d.x - 4) + "," + (d.y + 47)
                        });
                    hide_path4 = d3.select('.g_circle_'+ i).append("path").attr("class","hide_a")
                        .attr("d", function(d) {
                            return "M" + (d.x + 11) + "," + (d.y + 44) + "A20,20,0,0,0" + (d.x + 13) + "," + (d.y + 42)
                        });
                    hide_circle1 = d3.select('.g_circle_'+ i).append("circle").attr("class","hide_a").attr("cx",node.x - 12 + 17.15).attr("cy",node.y + 33 + 17.25).attr("r",6);
                    hide_line1 = d3.select('.g_circle_'+ i).append("line").attr("class","hide_a").attr("x1",node.x - 12 + 14.15).attr("y1",node.y + 33 + 17.25).attr("x2",node.x - 12 + 20.15).attr("y2",node.y + 33 + 17.25);

                    // d3.selectAll(".hide_a").on("click", (d) => { hideNodeAndLinks(d); })
                }
                function showUnlock(node, i) {
                    unlockPath = d3.select('.g_circle_'+ i).append("path").attr('class', 'g_circle_path')
                        .attr("transform", "translate(" + node.x + "," + node.y + ")").attr("d", leftArc)
                        .attr("fill", "rgb(210, 213, 218)").style("cursor","pointer")
                        // .on("click", function(d){ unlockNodeFixed(d); })
                        .on("mouseover", function(){ unlockPath.attr("fill", "rgb(185, 185, 185)") })
                        .on("mouseout", function() { unlockPath.attr("fill", "rgb(210, 213, 218)") });

                    d3.select('.g_circle_'+ i).append("g").attr("class","unlock_a")
                        .attr("transform", "translate(" + (node.x - 52) + "," + (node.y - 30) + ") scale(0.7)")
                        .append("defs").append("style")
                        .text(".unlock_a{fill:none;stroke:#FFFFFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px;}");

                    unlockPath.append("title").attr("class","unlock_a").text("Unlock");
                    unlock_path1 = d3.select('.g_circle_'+ i).append("path").attr("class","unlock_a")
                        .attr("transform", "translate(" + (node.x - 45) + "," + (node.y - 23) + ")")
                        .attr("d", d3.svg.arc().outerRadius(5.3).innerRadius(5).startAngle(-1.8).endAngle(1.8))
                        .attr("fill", "#FFFFFF");

                    unlock_rect1 = d3.select('.g_circle_'+ i).append("rect").attr("class","unlock_a").attr("x",node.x - 52 + 6.75).attr("y",node.y  - 30 + 9.75)
                        .attr("width",15).attr("height",12).attr("rx",1.5).attr("ry",1.5);
                    unlock_line1 = d3.select('.g_circle_'+ i).append("line").attr("class","unlock_a").attr("x1",node.x  - 52 + 15).attr("y1",node.y - 30 + 15).attr("x2",node.x  - 52 + 15).attr("y2",node.y - 30 + 18);

                    // d3.selectAll(".unlock_a").on("click", (d) => { unlockNodeFixed(d); })

                }
                function hideNodeAndLinks(node) {
                    d3.event.stopPropagation();
                    circle_g.attr('node', function(n) {
                        if(n.id === node.id) {
                            d3.select(this).remove();
                        }
                    });
                    edges_line.attr('d', function(d) {
                        if(d.source.id === node.id || d.target.id === node.id) {
                            d3.select(this).remove();
                        }
                    });
                }
                function removeNodeAndPath(node, _this){
                    d3.event.stopPropagation();
                    alert('delete this '+ node + ',' + _this );
                }
                // function showNodeInfo(node, _this) {
                //     window.console.log(node);
                //     window.console.log(_this);
                //
                // }
                function unlockNodeFixed(d) {
                    d3.event.stopPropagation();
                    d3.select(this).classed("fixed", d.fixed = false);//解除节点位置锁定
                    //清除上个节点的圆圈以及图标
                    svg.selectAll('.g_circle_path').remove();
                    svg.selectAll('.remove_a').remove();
                    svg.selectAll('.hide_a').remove();
                    svg.selectAll('.unlock_a').remove();
                }

                function Menu (menu, openCallback) {

                    d3.event.preventDefault();

                    d3.selectAll('.d3-context-menu').data([1])
                        .enter()
                        .append('div')
                        .attr('class', 'd3-context-menu')

                    // close menu
                    d3.select('body').on('click.d3-context-menu', function () {
                        d3.select('.d3-context-menu').style('display', 'none')
                    });

                    return (select, event, data)=> {


                        console.log(select.type);
                        console.log('select',data);
                        let elm = this;


                        d3.selectAll('.d3-context-menu').html('');
                        let list = d3.selectAll('.d3-context-menu').append('ul');

                        list.selectAll('li').data(menu).enter()
                            .append('li')
                            .html(function (d) {
                                return d.title
                            })
                            .on('click', function (d) {


                                d.action(data, select);

                                d3.select('.d3-context-menu').style('display', 'none')
                            });

                        // the openCallback allows an action to fire before the menu is displayed
                        // an example usage would be closing a tooltip
                        if (openCallback) openCallback(data);

                        // display context menu

                        d3.select('.d3-context-menu')
                            .style('left', (event.pageX - 2) + 'px')
                            .style('top', (event.pageY - 2) + 'px')
                            .style('display', 'block');
                        d3.event.preventDefault();
                        // return false
                    }

                }


            },

            doubleClick(info,nodes, input){


                let new_node = {
                    'id': nodes.length,
                    "type": "node",
                    'properties': {'name': input}
                };

                console.log('6. add node');
                info.nodes.push(new_node);
                this.renderGraph(info);

                // this.$prompt(
                //     'Please input node name：',
                //     'Tips',
                //     {
                //         confirmButtonText: 'Yes',
                //         cancelButtonText: 'No',
                //         inputValue: 'New Node',
                //         inputErrorMessage: 'Input cannot be none',
                //         inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
                //             if(!value) {
                //                 return 'Input cannot be none';
                //             }
                //         },
                //
                //     }).then(({value}) => {
                //
                //         let new_node = {
                //             'id': nodes.length,
                //             "type": "node",
                //             'properties': {'name': value}
                //         };
                //
                //         console.log('6. add node');
                //         info.nodes.push(new_node);
                //         this.renderGraph(info);
                //
                // }).catch((err) => {
                //     console.log(err);
                // });

            },

            singleClick(info, node,input){
                // let temp = [];
                console.log('single click!');
                console.log('node id', node);
                // let source = node.id;


                if(this.temp.length ===2 && this.temp[0] !== this.temp[1] )
                {

                    // this.$prompt("Add links?", "Tips", {
                    //     confirmButtonText: "Yes",
                    //     cancelButtonText: "No",
                    //     inputValue: 'New Link',
                    //     inputErrorMessage: 'Input cannot be none',
                    //     inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
                    //         if(!value) {
                    //             return 'Input cannot be none';
                    //         }
                    //     },
                    //
                    // }).then(({value}) => {
                    //     this.$message(
                    //
                    //         {
                    //         type: 'success',
                    //         message: 'Add Links!'
                    //     });
                    //     console.log('new link added',info.links);

                    let new_link = {
                        "source": this.temp[0],
                        "target": this.temp[1],
                        "type": 'link',
                        "properties": {},
                        "label": input

                    };

                    info.links.push(new_link);
                    console.log('new link added', info.links);
                    this.temp.length = 0;
                    this.renderGraph(info)

                    // }).catch(() => {
                    //     temp.length = 0;
                    //     this.$message({
                    //         type: 'info',
                    //         message: 'Cancel!'
                    //     })
                    // });
                }
                else if(this.temp.length ===2 && this.temp[0] === this.temp[1] )
                {
                    this.temp.length = 0;
                }

                if (this.temp.length ===0){
                    this.renderGraph(info)
                }

                console.log('current select node id',this.temp)


            },


            submitData(){
                console.log('submit data',this.info);
                alert('Submit Successfully!')
            },

            reload(){
                this.renderGraph(this.info)
            },

            deleteNodes(node,info){
                console.log('select delete node',node)
            },




            removeNodeClick(){

                console.log('remove node')

            },








        }


    }
</script>

<style>
    #graph {
        width: 100vw;
        height: 100vh;
    }

    .d3-context-menu {
        position: absolute;
        display: none;
        background-color: #f2f2f2;
        border-radius: 4px;

        font-family: Arial, sans-serif;
        font-size: 14px;
        min-width: 150px;
        border: 1px solid #d4d4d4;

        z-index:1200;
    }

    .d3-context-menu ul {
        list-style-type: none;
        margin: 4px 0px;
        padding: 0px;
        cursor: default;
    }

    .d3-context-menu ul li {
        padding: 4px 16px;
    }

    .d3-context-menu ul li:hover {
        background-color: #4677f8;
        color: #fefefe;
    }


</style>

