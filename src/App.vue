<template>





    <div id="app">

            <el-header style="text-align: right;height:15px;">
                <div class="grid-content ">
                    <template >
                        <el-button style="margin-right: 5px;"  @click="onTapLogin" v-show="showLogin" size="small" round
                                   type="primary" >Login</el-button>
                        <el-button style="margin-right: 5px;" size="small" type="success" v-show="!showLogin" round>{{username}}</el-button>
                        <el-button  @click="logout" size="small" v-show="!showLogin" round>Logout</el-button>
                    </template>
                </div>
            </el-header>

        <!--<el-divider direction="horizontal" content-position="center"/>-->

        <el-container>

            <!--<el-row class="tac">-->
                <el-aside width="175px">
                    <h1 style="margin-left: 25px">SustainKG</h1>
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
                                <el-menu-item index="1-1" :disabled="disable_submit" @click="submitData()">Submit Data</el-menu-item>
                                <el-menu-item index="1-2"  @click="getWikipedia()">get Articles</el-menu-item>
                                <el-menu-item index="1-3" @click="reload()">Reload Data</el-menu-item>
                                <el-menu-item index="1-4" :disabled='disable_initGraph' @click="showInitGraph()">Init Graph</el-menu-item>

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

                        <el-button style="margin-top: 80px; margin-left: 15px;"
                                   :disabled='disable_viewGraph'  @click="getCollectiveGraph" size="small" round
                                   type="primary">{{viewGraph_btn_status?'View Collective Graph':'View Personal Graph'}} </el-button>

                </el-aside>




            <!--</el-row>-->



            <el-main >
                <el-row id="graph"></el-row>
                <!--<div id="graph"></div>-->
            </el-main>


        </el-container>


                <!--下面是对话框集合 与界面无关-->
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
            <span>Password<el-input type="password" v-model="newPassword" onkeyup="value=value.replace(/[^A-Za-z0-9_]/g,'');" placeholder="Please Input Password"></el-input></span>
            <span slot="footer" class="dialog-footer">
            <el-button @click.native="dialog_createUser=false">Cancel</el-button>
            <el-button type="primary" @click="createUser" >Yes</el-button>
          </span>
        </el-dialog>


        <el-dialog :visible.sync="dialogFormVisible_initGraph"
                   title="Create Start Node" center

        >

            Node Name
            <el-select ref="init"

                       @keyup.native = "showOption_init_nodes"
                       label-position="right"
                       label-width="86px"
                       style="width: 300px; margin-left:50px;"

                       v-model="init_node_value"
                       placeholder="Please select"
                       clearable
                       filterable
                       @blur="showOption_init_nodes"
                       @clear="selectClear"
                       @change="selectChange"
            >
                <div  v-show="optionVisible_init_nodes">
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
                <el-button type="primary" :disabled="btnChangeEnable" @click="InitGraph">
                    Yes
                </el-button>
            </div>
        </el-dialog>




        <el-dialog :visible.sync="dialogFormVisible"
                   title="Create Node" center
        >

            Node Name
            <el-select
                    ref="addNode"
                    @keyup.native = "showOption_add_nodes"
                    label-position="right"
                    label-width="86px"
                    style="width: 300px; margin-left:50px;"

                    v-model="node_value"
                    placeholder="Please select"
                    clearable
                    filterable
                    @blur="showOption_add_nodes"
                    @clear="selectClear"
                    @change="selectChange"
            >
                <div  v-show="optionVisible_add_nodes">
                    <el-option
                            class="bar"
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
                    ref="changeNodeName"
                    @keyup.native = "showOption_change_nodes"
                    label-position="right"
                    label-width="86px"
                    style="width: 300px; margin-left:30px;"

                    v-model="new_node_name"
                    placeholder="Please select"
                    clearable
                    filterable
                    @blur="showOption_change_nodes"
                    @clear="selectClear"
                    @change="selectChange"
            >
                <div  v-show="optionVisible_change_nodes">
                    <el-option
                            v-for="(item,index) in node_list"
                            :key="index"
                            :label="item.label"
                            :value="item.value" ></el-option></div>
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
                   :show-close="false"
                   title="Create Link" center>

            Link Name

            <el-select
                    ref="addLink"
                    @keyup.native = "showOption_add_link"
                    label-position="right"
                    label-width="86px"
                    style="width: 300px; margin-left:50px;"

                    v-model="link_value"
                    placeholder="Please select"
                    clearable
                    filterable
                    @blur="showOption_add_link"
                    @clear="selectClear"
                    @change="selectChange"
            >
                <div  v-show="optionVisible_add_link">
                    <el-option
                            v-for="(item,index) in link_list"
                            :key="index"
                            :label="item.label"
                            :value="item.value" ></el-option></div>

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
                    ref="changeLinkName"
                    @keyup.native = "showOption_change_link"
                    label-position="right"
                    label-width="86px"
                    style="width: 300px; margin-left:30px;"

                    v-model="new_link_name"
                    placeholder="Please select"
                    clearable
                    filterable
                    @blur="showOption_change_link"
                    @clear="selectClear"
                    @change="selectChange"
            >
                <div  v-show="optionVisible_change_link">
                    <el-option
                            v-for="(item,index) in link_list"
                            :key="index"
                            :label="item.label"
                            :value="item.value" ></el-option></div>
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




            <div id="node_info" v-show="showdetail_node" >
                <el-card
                        :style="{ backgroundColor: 'rgb(253, 216, 186)' }"
                        class="node-card"
                >
                    <h2 :style="{ color: '#ca635f' }">Node Detail</h2>
                    <div>

                        <h4 :style="{ color: '#aaaaff' }">ID: {{ detailValue.id }}</h4>
                        <h4 :style="{ color: '#aaaaff' }">Index: {{ detailValue.index }}</h4>
                        <h4 :style="{ color: '#aaaaff' }">Name: {{ detailname }}</h4>
                        <h4 :style="{ color: '#aaaaff' }">Type: {{ detailValue.type }}</h4>
                        <h4 :style="{ color: '#aaaaff' }">Label: {{ detailValue.label }}</h4>
                    </div>
                </el-card>
            </div>


            <div id="link_info" v-show="showdetail_link" >
                <el-card
                        :style="{ backgroundColor: 'rgb(253, 216, 186)' }"
                        class="link-card"
                >
                    <h2 :style="{ color: '#ca635f' }">Link Detail</h2>
                    <div>

                        <h4 :style="{ color: '#aaaaff' }">ID: {{ detailValue.id }}</h4>
                        <h4 :style="{ color: '#aaaaff' }">Name: {{ detailname }}</h4>
                        <h4 :style="{ color: '#aaaaff' }">Type: {{ detailValue.type }}</h4>
                        <h4 :style="{ color: '#aaaaff' }">Label: {{ detailValue.label }}</h4>
                    </div>
                </el-card>
            </div>







    </div>

</template>

<script>
    import * as d3 from "d3";
    import Seven from 'node-7z'
    import sevenBin from '7zip-bin'
    import { list } from 'node-7z'

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
                        "label" : "Device",
                        "properties":{"name":"hello"}
                    },
                    {
                        "id": 1,
                        "type" : "node",
                        "label": "Device",
                        "properties":{"name":"will"}
                    },
                    {
                        "id": 2,
                        "type" : "node",
                        "label": "Device",
                        "properties":{"name":"lala"}
                    },

                ]
            };



            return {

                //////////////////////////////////////
                readOnly : false,
                // log function parameters
                current_user:'',
                username:'',
                password:'',
                newUsername:'',
                newPassword:'',
                showLogin:true,
                centerDialogVisible:false,
                dialog_createUser:false,

                optionVisible_init_nodes:false,
                optionVisible_add_nodes:false,
                optionVisible_change_nodes:false,
                optionVisible_add_link:false,
                optionVisible_change_link:false,


                upload_nodes:'',
                upload_links:'',

                disable_initGraph:true,
                disable_submit:true,
                disable_viewGraph: true,
                viewGraph_btn_status:true,
                // disable_getArticles:true,
                dialogFormVisible_initGraph:false,

                //////////////////////////////////////
                showdetail_node:false, // show the info in the right corner
                showdetail_link:false,

                detailValue:'',
                detailname:'',
                node_value: '',
                link_value:'',
                init_node_value:'',
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

                info: {
                    nodes:[],
                    links:[]
                },

                // info: info,

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

                                console.log('after delete', this.info);
                                for(let i = 0; i < this.info.nodes.length;i++)
                                {
                                    console.log(i);
                                    console.log(this.info.nodes[i].id,this.info.nodes[i].index);
                                    this.info.nodes[i].id = i;
                                }
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
            getCollectiveGraph:function(){
                this.disable_initGraph = true;
                this.disable_submit = true;
                this.viewGraph_btn_status = !this.viewGraph_btn_status;

                if (this.viewGraph_btn_status === false) {
                    this.readOnly = true;
                    this.$axios({
                        url: '/getCollectiveGraph',
                        method: 'get',
                    }).then(response => {
                        console.log(response)
                        let user_nodes = response.data.nodes;
                        let user_links = response.data.links;
                        let change_node_type = user_nodes.map(function (element) {
                            element.id = Number(element.id);
                            return element
                        });
                        let change_link_type = user_links.map(function (element) {
                            element.id = Number(element.id);
                            element.source = Number(element.source);
                            element.target = Number(element.target);
                            return element
                        });

                        this.info.nodes = change_node_type;
                        this.info.links = change_link_type;
                        this.renderGraph(this.info)
                        // this.renderGraph()

                    })
                }
                else{

                    this.readOnly = false;
                    this.handleShow();
                }
            },
            ////////////////////////////////////////////////////////////
            // login functions


            createUser:function(){

                this.dialog_createUser  = false;
                console.log('create user function',this.newUsername, this.newPassword)

                this.$axios({
                    url : '/createNewUser',
                    method : 'post',
                    data :
                        {
                            "user" : this.newUsername,
                            "password" : this.newPassword
                        }
                }).then(response=>{
                    this.username = this.newUsername;
                    this.password = this.newPassword;
                    this.newPassword = '';
                    this.newUsername = '';
                    console.log(response);
                    if(response.status === 204)
                    {

                        this.$message(

                            {
                                type: 'warning',
                                message: 'The username is existed !'
                            });
                        this.showLogin = true;
                        this.dialog_createUser  = true;
                        this.username = '';
                        this.password = '';
                    }
                    else {

                        this.$axios({
                            url: '/getUserGraph',
                            method: 'post',
                            data:
                                {
                                    user: this.username,
                                    password: this.password

                                }
                        }).then(response => {

                            this.showLogin = false; // control the login status
                            let user_nodes = response.data.nodes;
                            let user_links = response.data.links;
                            let change_node_type = user_nodes.map(function (element) {
                                element.id = Number(element.id);
                                return element
                            });
                            let change_link_type = user_links.map(function (element) {
                                element.id = Number(element.id);
                                element.source = Number(element.source);
                                element.target = Number(element.target);
                                return element
                            });

                            this.info.nodes = change_node_type;
                            this.info.links = change_link_type;
                            this.current_user = response.data.user;

                            this.renderGraph(this.info)


                        })
                    }
                })

            },

            getWikipedia:function(){





                // this.$axios({
                //
                //     method : 'get',
                //     url : '/getAllWikipediaArticles',
                //     data: {}
                // }).then(response=>{
                //     console.log(response)
                // })
            },


            handleShow:function(){


                    this.$axios({
                        url:'/getUserGraph',
                        method:'post',
                        data:{
                            // user : "some_user",
                            // password: "my_password"
                            user : this.username,
                            password: this.password
                        }

                    }).then(response=>{
                            if (response.status === 204){
                                alert('Wrong username or password !')
                                this.centerDialogVisible=true;
                            }
                            else {
                                this.centerDialogVisible=false;
                                console.log(response);
                                this.showLogin = false;
                                let user_nodes = response.data.nodes;
                                let user_links = response.data.links;
                                // let test = response.data;

                                let change_node_type = user_nodes.map(function (element) {
                                    element.id = Number(element.id);
                                    return element
                                });

                                let change_link_type = user_links.map(function (element) {
                                    element.id = Number(element.id);
                                    element.source = Number(element.source);
                                    element.target = Number(element.target);
                                    return element
                                });


                                this.info.nodes = change_node_type;
                                this.info.links = change_link_type;
                                this.current_user = response.data.user;
                                this.renderGraph(this.info)
                            }

                    }).catch(error=>{
                        this.showLogin = true;
                        this.username = '';
                        this.password = '';
                    })


            },

            onTapLogin:function () {
                this.centerDialogVisible=true
            },

            logout:function () {
                this.showLogin = true;
                this.disable_initGraph = true;
                this.disable_submit = true;
                this.disable_viewGraph  =true;
                this.viewGraph_btn_status = true;
                this.username = '';
                this.password = '';
                this.info= {
                    nodes:[],
                        links:[]
                };
                this.renderGraph(this.info)
            },

            ////////////////////////////////////////////////////////////
            // optionVisible_init_nodes:false,
            // optionVisible_add_nodes:false,
            // optionVisible_change_nodes:false,
            // optionVisible_add_link:false,
            // optionVisible_change_link:false,

            showOption_add_nodes()
            {


                let inputContent = this.$refs.addNode.$children[0].value;
                this.optionVisible_add_nodes = inputContent.length >=2;

                this.$forceUpdate()
            },

            showOption_init_nodes()
            {
                console.log(this.$refs.init.$children);
                let inputContent = this.$refs.init.$children[0].value;

                this.optionVisible_init_nodes = inputContent.length >=2;

                this.$forceUpdate()
            },

            showOption_change_nodes()
            {
                let inputContent = this.$refs.changeNodeName.$children[0].value;
                this.optionVisible_change_nodes = inputContent.length >=2;

                this.$forceUpdate()
            },


            showOption_add_link()
            {
                let inputContent = this.$refs.addLink.$children[0].value;

                this.optionVisible_add_link = inputContent.length >=2;
                this.$forceUpdate()
            },

            showOption_change_link()
            {

                let inputContent = this.$refs.changeLinkName.$children[0].value;
                this.optionVisible_change_link = inputContent.length >=2;

                this.$forceUpdate()
            },


            selectBlur(e) {
                // 意见类型
                this.btnChangeEnable = true;
                if (e.target.value !== '') {
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
                this.init_node_value = '',
                this.optionVisible_init_nodes=false;
                this.optionVisible_add_nodes=false;
                this.optionVisible_change_nodes=false;
                this.optionVisible_add_link=false;
                this.optionVisible_change_link=false;



                // let elements = document.getElementsByClassName('el-input__inner');
                // elements[0].parentNode.removeChild(elements[0]);
                // while(elements.length > 0){
                //     elements[0].parentNode.removeChild(elements[0]);
                // }

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
                else if(this.dialogFormVisible_initGraph === true){
                    this.init_node_value = val;
                }
                this.$forceUpdate()
            },


            cancel()
            {
                this.dialogFormVisible = false;
                this.dialogFormVisible_link = false;
                this.dialogFormVisible_change_node_name = false;
                this.dialogFormVisible_change_link_name = false;

                this.temp.length = 0;
                this.newPassword = '';
                this.newUsername = '';
                this.btnChangeEnable = true;
                this.dialogFormVisible_initGraph = false;

                this.selectClear();

            },
            showInitGraph:function(){
                this.dialogFormVisible_initGraph = true;
            },
            InitGraph:function()
            {
                console.log(this.info);
                console.log(document.getElementById('init'));
                this.btnChangeEnable = true;
                console.log('add a start node');
                let init_node= {
                    "id": 0,
                    "type" : "node",
                    "label" : "Device",
                    "properties":{"name":this.init_node_value}
                };

                this.dialogFormVisible_initGraph  = false;


                this.info.nodes.push(init_node);


                this.renderGraph(this.info);
                this.selectClear();
            },


            addNodes(){



                    let flag = this.doubleClick(this.info, this.info.nodes, this.node_value);
                    this.btnChangeEnable = true;
                    console.log('flag', flag)
                    if (flag === true) {
                        this.dialogFormVisible = false;
                        this.selectClear();
                    }
                    else {
                        this.dialogFormVisible = true;
                        this.selectClear();

                    }



            },

            change_node_name(){

                this.info.nodes[this.node_id].properties.name = this.new_node_name;
                this.dialogFormVisible_change_node_name = false;

                // this.optionVisible = false;
                // this.optionVisible_link = false;
                this.btnChangeEnable = true;


                this.renderGraph(this.info);
                this.selectClear();

            },


            change_link_name()
            {

                this.info.links[this.link_id].label = this.new_link_name;
                this.dialogFormVisible_change_link_name = false;

                this.btnChangeEnable = true;

                this.renderGraph(this.info);
                this.selectClear();
            },

            addLinks()
            {
                console.log('add link',this.optionVisible,this.optionVisible_link);

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
                // this.optionVisible = false;
                // this.optionVisible_link = false;


                this.selectClear()

            },


            renderGraph(info) {
                // let temp = [];


                console.log('render data', info);
                if(this.showLogin === false)
                {
                this.disable_submit = false;
                this.disable_viewGraph = false;
                }

                if(this.showLogin === false && this.info.nodes.length === 0 )
                {
                    this.disable_initGraph = false;
                }
                else{
                    this.disable_initGraph = true;
                }
                // this.disable_initGraph = this.info.nodes.length !== 0;

                let {links, nodes} = info;

                //关系分组
                setLinkGroup(links);


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
                    .attr("viewBox", "-460 -220 2000 2000")
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


                        clearTimeout(this.clickTimeId);

                        this.clickTimeId = setTimeout( ()=> {
                                if(this.readOnly === true){
                                    this.$message(
                                        {
                                            type: 'Warning',
                                            message: 'Read Only Mode'
                                        });
                                }
                                else {


                                    this.temp.push(node.index);
                                    console.log('liuliu', this.temp);
                                    if (this.temp.length === 2 && this.temp[0] !== this.temp[1]) {
                                        this.dialogFormVisible_link = true;

                                    }
                                    else if (this.temp.length === 2 && this.temp[0] === this.temp[1]) {
                                        this.temp.length = 0
                                    }
                                    // this.singleClick(info, node, temp, this.state2);
                                    clickStyle(node, i, this);
                                }
                            }
                            , 250);
                    })

                    .on('mouseover', (node) => {
                        if (d3.event.defaultPrevented) return;
                        this.showdetail_node = true;
                        // console.log(node);
                        this.detailValue = node;
                        this.detailname = node.properties.name
                        // showNodeInfo(node, this);
                        // showCircleBorderOuterArc(node, i);
                    })
                    .on('mouseout',(node)=>{
                        this.showdetail_node = false;
                    })
                    .on("dblclick", (node, )=>{


                        if (d3.event.defaultPrevented) return;
                        clearTimeout(this.clickTimeId);
                        if(this.readOnly === true){
                            this.$message(
                                {
                                    type: 'Warning',
                                    message: 'Read Only Mode'
                                });
                        }
                        else {
                            this.dialogFormVisible = true;
                        }
                    })
                    .on('contextmenu',(d,node)=>{
                        if (d3.event.defaultPrevented) return;
                        if(this.readOnly === true){
                            this.$message(
                                {
                                    type: 'Warning',
                                    message: 'Read Only Mode'
                                });
                        }
                        else {
                            Menu(this.menu)(d, d3.event, node)
                        }

                    });




                svg.on("dblclick.zoom", null);//取消svg和圆圈的双击放大事件（d3中默认开启7个事件，关闭防止与上面的双击事件冲突）
                circle_g.on("dblclick.zoom", null);



                //单击改变节点颜色 表明选中
                function clickStyle(node, i, _this){

                    console.log(_this.ifClicked);
                    // _this.ifClicked = true;


                    circle_g.attr('node', function(n) {



                        if(n.index === node.index && _this.ifClicked===false ) {
                            d3.select('.g_circle_'+ n.index).select('circle').style('fill','red');
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
                    .style("fill", function (node) { return getCircleColor(node); })

                ;

                let text = circle_g.append("text")
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")//在圆圈中加上数据
                    .style('fill', "#FFFFFF")
                    .attr('x',function(d){ appendCircleText(d, this); });

                //圆圈的提示文字
                circle.append("svg:title").text(function(node) {
                    switch (node.type) {
                        case 'node': return node.properties.name;

                    }
                });
                text.append("svg:title").text(function(node) {
                    switch (node.type) {
                        case 'node': return node.properties.name;

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
                    .style("stroke", 'black')
                    .style("stroke-width", 2)//线条粗细
                    .style("fill-opacity",0)
                    .style("cursor","pointer")
                    .attr("id", function (d, i) { return 'edgepath' + i; })
                    // .on("mouseover", function(d){ return getStrokeWidth(d); })
                    // .on("mouseout", function() { edges_line.style("stroke-width", 3) })
                    // .on('click', (link) => { this.deleteLine(this.info,link); })
                    .on('contextmenu',(d,link)=>{
                        if (d3.event.defaultPrevented) return;
                        if(this.readOnly === true){
                            this.$message(
                                {
                                    type: 'Warning',
                                    message: 'Read Only Mode'
                                });
                        }else {
                            Menu(this.menu_edge)(d, d3.event, link)
                        }

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
                    return "#FF9D00";
                    // return color[node.label] || '#C477E9';
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
                    edges_line
                        .attr('d', function (d) {

                        return getNodesLine(d,edges_line,defs);//曲线路径

                    });
                    edges_line.attr('marker-end', function(d,i) {
                            if (d.x_start < d.x_end) {
                                return  "url(#end)";
                            }
                            return ''
                        }).attr('marker-start', function(d,i) {
                        if (d.x_start >= d.x_end) {
                            return "url(#start)";
                        }
                        return ''

                    })
                    ;

                }

                //设置圆圈和文字的坐标
                function transform1(d) {
                    if (d.x <=-430)
                    {
                        d.x = -430
                    }
                    else if (d.x >=1150){
                        d.x = 1150
                    }

                    if(d.y <= -168){
                        d.y = -168
                    }
                    else if (d.y >=700){
                        d.y = 700
                    }

                    return "translate(" + d.x + "," + d.y + ")";
                }

                function transform2(d) {
                    if (d.x <=-430)
                    {
                        d.x = -430
                    }
                    else if (d.x >=1150){
                        d.x = 1150
                    }

                    if(d.y <= -168){
                        d.y = -168
                    }
                    else if (d.y >=700){
                        d.y = 700
                    }
                    return "translate(" + (d.x) + "," + d.y + ")";
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
//
            doubleClick(info,nodes, input){

                let containSame = false;

                for (let i = 0; i < this.info.nodes.length; i++) {

                    if (this.info.nodes[i].properties.name === input) {
                        containSame =  true;
                    }
                }

                if (containSame === false) {

                    let new_node = {
                        'id': nodes.length,
                        "type": "node",
                        'properties': {'name': input},
                        'label': 'Concept'
                    };

                    info.nodes.push(new_node);
                    this.renderGraph(info);
                    return true
                }

                else{
                    alert('Same node already exits!')
                    return false
                }


            },

            singleClick(info, node,input){
                // let temp = [];

                // let source = node.id;


                if(this.temp.length ===2 && this.temp[0] !== this.temp[1] )
                {


                    let new_link = {
                        "source": this.temp[0],
                        "target": this.temp[1],
                        "id": this.info.links.length,
                        "type": 'link',
                        "properties": {},
                        "label": input

                    };

                    info.links.push(new_link);
                    console.log('new link added', info.links);
                    this.temp.length = 0;
                    this.renderGraph(info)

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


            submitData() {
                console.log('submit data', this.info);

                this.upload_nodes = this.info.nodes.map(function (element) {
                    return {
                        "id": String(element.id), "type": element.type, "label": element.label, "properties": {
                            "name": element.properties.name
                        }
                    }

                });
                this.upload_links = this.info.links.map(function (element) {

                    return {
                        "type": element.type, "id": String(element.id), "label": element.label,
                        "source": String(element.source.index), "target": String(element.target.index),
                        "properties": element.properties
                    }
                });
                //
                console.log('nn', JSON.stringify(this.upload_nodes));
                console.log('nn', JSON.stringify(this.upload_links));
                let flag = true;
                for (let i = 0; i < this.info.nodes.length; i++) {
                    if (this.info.nodes[i].weight === 0) {
                        flag = false;
                    }
                }

                if (flag === false) {
                    this.$message({
                        'type': 'warning',
                        'message': 'The node should have a least one link, please check it.'
                    })
                }
                else{

                this.$axios({

                    headers: {
                        'Content-Type': 'application/json;'
                    },
                    url: '/postUserGraph',
                    method: 'post',
                    data: {
                        user: this.current_user,
                        nodes: this.upload_nodes,
                        // nodes:[
                        //     {
                        //         "type": "node",
                        //         "id": "0",
                        //         "label": "Concept",
                        //         "properties": {
                        //             "name": "Innovation"
                        //         }
                        //     },
                        //     {
                        //         "type": "node",
                        //         "id": "1",
                        //         "label": "Concept",
                        //         "properties": {
                        //             "name": "Globalization"
                        //         }
                        //     }],
                        links: this.upload_links
                        // links:  [
                        //     {
                        //         "type": "link",
                        //         "id": "0",
                        //         "label": "benefits",
                        //         "source": "0",
                        //         "target": "1",
                        //         "properties": {}
                        //     }
                        // ]
                    }


                }).then(response => {
                    console.log('pp', JSON.stringify(this.upload_nodes));
                    console.log('pp', JSON.stringify(this.upload_links));
                    console.log('success', response)
                    this.$message({
                        'type':'success',
                        'message':'Submit Successfully!'
                    })
                    this.renderGraph(this.info)
                })
            }
            },

            reload(){
                this.renderGraph(this.info)
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

    #node_info {
        position: absolute;
        bottom: 40px;
        right: 30px;
        width: 270px;
    }
    #link_info {
        position: absolute;
        bottom: 40px;
        right: 30px;
        width: 270px;
    }
    .node-card {
        border: 1px solid #9faecf;
        background-color: #00aeff6b;
        color: #fff;
        text-align: left;

    }
    .link-card {
        border: 1px solid #9faecf;
        background-color: #00aeff6b;
        color: #fff;
        text-align: left;

    }
    .el-card__header {
        border-bottom: 1px solid #50596d;
    }


</style>

