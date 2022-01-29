

<template>

    <div id="app" v-title data-title="SustainKG"  >

        <el-header style="text-align: right;height:40px;">





            <div class="grid-content " >
                <template >
                    <!--<el-button size="medium" type="text" style="margin-right: 700px; color:red" v-show="!viewGraph_btn_status">The graph is a subset!</el-button>-->
                    <el-button style="margin-right: 10px;"  @click="onTapLogin" v-show="showLogin" size="small" round
                               :disabled="true" type="primary" >Login</el-button>

                    <el-button style="margin-right: 5px;" size="small" type="success" v-show="!showLogin" round @click="changeUser">{{username}}</el-button>
                    <el-button  @click="logout" size="small" v-show="!showLogin" round>Logout</el-button>

                </template>
            </div>

        </el-header>



        <!--<el-divider direction="horizontal" content-position="center"/>-->

        <el-container >

            <!--<el-row class="tac">-->
            <el-aside width="200px">
                <h1 style="margin-left: 25px">Sustainability</h1>
                <h1 style="margin-left: 25px">Knowledge</h1>
                <h1 style="margin-left: 25px">Mapper</h1>
                <el-menu

                        default-active="2"
                        class="el-menu-vertical-demo"

                >
                    <!--<el-menu-item index="1"  :disabled="disable_submit" @click="submitData()">-->
                        <!--<i class="el-icon-upload2"></i>-->
                        <!--<span slot="title">Save</span>-->
                        <!--<template slot="title">-->
                            <!--<i class="el-icon-menu"></i>-->
                            <!--<span>Operation</span>-->
                        <!--</template>-->
                        <!--<el-menu-item-group>-->
                            <!--&lt;!&ndash;<template slot="title">分组一</template>&ndash;&gt;-->
                            <!--<el-menu-item class="el-icon-upload2" index="1-1" :disabled="disable_submit" @click="submitData()"> Submit Data</el-menu-item>-->
                            <!--<el-menu-item class="el-icon-search" index="1-2" :disabled="disable_searchConcept"  @click="searchConcept_dialog" > Search Another Concept</el-menu-item>-->

                            <!--<el-menu-item index="1-3" @click="reload()">Reload Data</el-menu-item>-->
                            <!--<el-menu-item index="1-4" :disabled='disable_initGraph' @click="showInitGraph()">Init Graph</el-menu-item>-->

                        <!--</el-menu-item-group>-->


                    <!--</el-menu-item>-->
                    <el-menu-item v-show=false index="2"   :disabled="disable_searchConcept"  @click="searchConcept_dialog" >
                        <i class="el-icon-search"></i>
                        <span slot="title"> Search Another Concept</span>
                    </el-menu-item>
                    <!--<el-menu-item   @click="instruction">-->
                        <!--<i class="el-icon-info"></i>-->
                        <!--<span slot="title">Help</span>-->
                    <!--</el-menu-item>-->

                    <el-menu-item >
                        <i class="el-icon-star-off"></i>
                        <span slot="title">Concepts：{{ info.nodes.length }}</span>
                    </el-menu-item>

                    <el-menu-item >
                        <i class="el-icon-star-off"></i>
                        <span slot="title">Relationships：{{ info.links.length }}</span>
                    </el-menu-item>


                </el-menu>

                <el-button style="margin-top: 80px; margin-left: 15px;" v-show=false
                           :disabled='disable_viewGraph'  @click="getAllConcepts" size="small" round
                           type="primary">{{viewGraph_btn_status?'View Collective Graph':'View Personal Graph'}} </el-button>

                <el-button style="margin-top: 80px; margin-left: 15px;"
                           @click="submitData()" size="small" round
                           type="primary">
                    <i class="el-icon-info"></i>
                    Save</el-button>

                <el-button style="margin-top: 80px; margin-left: 15px;"
                            @click="instruction" size="small" round
                           type="primary">
                    <i class="el-icon-info"></i>
                    Instructions</el-button>


                <!--<el-button style="margin-top: 80px; margin-left: 15px;"-->
                           <!--@click="TeamLogin" size="small" round-->
                           <!--type="primary">-->
                    <!--<i class="el-icon-info"></i>-->
                    <!--Team Work</el-button>-->

                <!--<el-button style="margin-top: 80px; margin-left: 15px;"-->
                            <!--@click="submit2" size="small" round-->
                           <!--type="primary">test</el-button>-->

                <el-button style="margin-top: 80px; margin-left: 15px;"
                v-show="dashboard_show"   @click="getGraphStatistics" size="small" round
                type="primary">Dashboard</el-button>





            </el-aside>


            <!--</el-row>-->



            <el-main ref="graph_main" @click="getMouseXY($event)" id="graph"  >
                <!--<el-row id="graph"></el-row>-->
                <!--<div id="graph"></div>-->
            </el-main>






        </el-container>


        <el-dialog
                :close-on-click-modal="false"
                title="Login"
                :visible.sync="changeUserVisible"
                width="30%"
                center>
            <span>Username<el-input v-model="change_username" placeholder="Please Input Username" ></el-input></span>
            <span>Password<el-input v-model="password" placeholder="Please Input Password" @keyup.native.enter='login'></el-input></span>

            <br><br>
            <!--<span>Password<el-input type="password" v-model="password" placeholder="Please Input Password" @keyup.native.enter='login'></el-input></span>-->
            <el-button type="text" style="margin-top: 15px;" @click.native="dialog_createUser=true; centerDialogVisible=false">No account?</el-button>
            <span slot="footer" class="dialog-footer">
            <el-button @click.native="changeUserVisible=false">No</el-button>
            <el-button type="primary" @click.native="login" >Yes</el-button>
          </span>
        </el-dialog>


        <el-dialog
                :close-on-click-modal="false"
                title="Create New Account"
                :visible.sync="dialog_createUser"
                width="30%"
                center>
            <span>Username<el-input v-model="newUsername" placeholder="Please Input Username"></el-input></span>
            <span>Password<el-input v-model="newPassword" placeholder="Please Input Password"></el-input></span>
            <br><br>
            <!--<span>Password<el-input type="password" v-model="newPassword" onkeyup="value=value.replace(/[^A-Za-z0-9_]/g,'');" placeholder="Please Input Password"></el-input></span>-->
            <span slot="footer" class="dialog-footer">
            <el-button @click.native="dialog_createUser=false; centerDialogVisible=true">No</el-button>
            <el-button type="primary" @click="createUser" >Yes</el-button>
          </span>
        </el-dialog>



        <!--下面是对话框集合 与界面无关-->
        <!--<el-dialog-->
                <!--:close-on-click-modal="false"-->
                <!--title="Login"-->
                <!--:visible.sync="centerDialogVisible"-->

                <!--width="30%"-->
                <!--center>-->
            <!--<span>Username<el-input v-model="username" placeholder="Please Input Username" @keyup.native.enter='handleShow'></el-input></span>-->

            <!--<br><br>-->
            <!--&lt;!&ndash;<span>Password<el-input type="password" v-model="password" placeholder="Please Input Password" @keyup.native.enter='handleShow'></el-input></span>&ndash;&gt;-->
            <!--<el-button type="text" style="margin-top: 15px;" @click.native="dialog_createUser=true; centerDialogVisible=false">No account?</el-button>-->
            <!--<span slot="footer" class="dialog-footer">-->
            <!--<el-button @click.native="centerDialogVisible=false">No</el-button>-->
            <!--<el-button type="primary" @click.native="handleShow" >Yes</el-button>-->
          <!--</span>-->
        <!--</el-dialog>-->

        <!--<el-dialog-->
                <!--:close-on-click-modal="false"-->
                <!--title="Create New Account"-->
                <!--:visible.sync="dialog_createUser"-->
                <!--width="30%"-->
                <!--center>-->
            <!--<span>Username<el-input v-model="newUsername" placeholder="Please Input Username"></el-input></span>-->
            <!--<br><br>-->
            <!--&lt;!&ndash;<span>Password<el-input type="password" v-model="newPassword" onkeyup="value=value.replace(/[^A-Za-z0-9_]/g,'');" placeholder="Please Input Password"></el-input></span>&ndash;&gt;-->
            <!--<span slot="footer" class="dialog-footer">-->
            <!--<el-button @click.native="dialog_createUser=false">Cancel</el-button>-->
            <!--<el-button type="primary" @click="createUser" >Submit</el-button>-->
          <!--</span>-->
        <!--</el-dialog>-->



        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="dialogFormVisible"
                   title="Create Concept" center
                 >



            <el-form :inline="true"  class="demo-form-inline" >
                <el-form-item label="Concept Name" >
                    <el-input v-model="input"

                              style='width: 200px'

                              @keyup.native.enter="search('select'); "

                              placeholder="Concept Name"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary"

                               @click="search('select'); ">Search</el-button>
                </el-form-item>

                <el-form-item label="Result">
                    <el-select  style='width: 200px; margin-left:30px;'
                                v-model="node_value" placeholder="Result"
                                @change="selectChange"
                                @blur="blur"
                                @focus="focus"
                                ref="select"
                                clearable
                                @keyup.native.enter="addNodes"
                                no-data-text="No Concept Name found"



                    >
                        <el-option

                                ref="option"
                                class="bar"
                                v-for="(item,index) in node_list"
                                :key="index"
                                :label="item.label"
                                :value="item.value" ></el-option>
                    </el-select>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">
                    Cancel
                </el-button>
                <el-button type="primary" :disabled="btnChangeEnable" @click="addNodes">
                    Submit
                </el-button>
            </div>
        </el-dialog>


        <el-dialog
                :close-on-click-modal="false"

                :visible.sync="dialogFormVisible_change_node_name"
                   title="Change Concept Name"
                    center
        >

            <el-form :inline="true"  class="demo-form-inline" center>
                <el-form-item label="Node Name">
                    <el-input v-model="input"

                              style='width: 200px'

                              @keyup.native.enter="search('select_changeNode'); "

                              placeholder="Concept Name"></el-input>

                </el-form-item>

                <el-form-item>
                    <el-button type="primary"

                               @click="search('select_changeNode'); ">Search</el-button>
                </el-form-item>

                <el-form-item label="Result">
                    <el-select  style='width: 200px; margin-left:30px;'
                                v-model="new_node_name" placeholder="Result"
                                @change="selectChange"
                                @blur="blur"
                                ref="select_changeNode"
                                clearable
                                no-data-text="No Concept Name found"
                                @keyup.native.enter="change_node_name"
                    >
                        <el-option
                                class="bar"
                                v-for="(item,index) in node_list"
                                :key="index"
                                :label="item.label"
                                :value="item.value" ></el-option>
                    </el-select>
                </el-form-item>

            </el-form>



            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">
                    No
                </el-button>
                <el-button type="primary" :disabled="btnChangeEnable" @click="change_node_name">
                    Yes
                </el-button>
            </div>

        </el-dialog>



        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="dialogFormVisible_link"
                   :show-close="false"
                   title="Add Reference URL" center>

            <el-select

                    v-model="relationship"
                       style='width: 300px;'
                       placeholder="Please select the relationship">
                <el-option
                        v-for="item in link_list"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <span><el-input v-model="reference" placeholder="Add Reference URL" @keyup.native.enter="drag_addLinks" ></el-input></span>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">
                    Cancel
                </el-button>
                <el-button type="primary"   @click="drag_addLinks">
                    Submit
                </el-button>
            </div>

        </el-dialog>






        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="dialogFormVisible_change_link_name"
                   title="Change Relationships Citation" center>

            <el-select v-model="new_relationship"
                       style='width: 300px;'
                       placeholder="Please select the relationship">
                <el-option
                        v-for="item in link_list"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>


            <span>{{new_relationship}}<el-input v-model="new_reference" placeholder="Change Reference URL" @keyup.native.enter="change_link_name" >

            </el-input></span>


            <div slot="footer" class="dialog-footer">

                <el-button @click="cancel">
                    No
                </el-button>
                <el-button type="primary"  @click="change_link_name">
                    Yes
                </el-button>
            </div>
        </el-dialog>

        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="dialogFormVisible_relationship"
                :show-close="false"
                title="Select Relationships" center>


            <el-select v-model="relationship"
                       style='width: 300px; margin-left:150px;'
                       placeholder="Please select the relationship">
                <el-option
                        v-for="item in link_list"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>





            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">
                    Cancel
                </el-button>
                <el-button type="primary"   @click="drag_addLinks">
                    Submit
                </el-button>
            </div>

        </el-dialog>


        <el-dialog
                :close-on-click-modal="false"
                :visible.sync="dialogFormVisible_new_relationship"
                :show-close="false"
                title="Select New Relationships" center>


            <el-select v-model="new_relationship"
                       style='width: 300px; margin-left:150px;'
                       placeholder="Please select the relationship">
                <el-option
                        v-for="item in link_list"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>





            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">
                    Cancel
                </el-button>
                <el-button type="primary"   @click="change_relationship_name">
                    Submit
                </el-button>
            </div>

        </el-dialog>





        <el-dialog :visible.sync="dialogFormVisible_viewCollective"
                   :show-close="false"
                   title="View Collective Graph" center
                   :close-on-click-modal="false"
        >

            Concept Name

            <el-select
                    ref="viewCollective"
                    @keyup.native = "showOption_view_graph"
                    label-position="right"
                    label-width="86px"
                    style="width: 300px; margin-left:50px;"

                    v-model="collective_node_value"
                    placeholder="Please select"
                    clearable

                    filterable
                    @blur="showOption_view_graph"
                    @clear="selectClear"
                    @change="selectChange"

                    no-match-text="No Concept Name found"
                    @keyup.native.enter='searchConcept'

            >
                <!--<div  v-show="optionVisible_viewGraph">-->
                <el-option
                        v-for="(item,index) in collective_node_list"
                        :key="index"
                        :label="item.label"
                        :value="item.value" ></el-option>
                <!--</div>-->

            </el-select>


            <div slot="footer" class="dialog-footer">
                <el-button @click="collectiveGraph_cancel">
                    No
                </el-button>
                <el-button type="primary" :disabled="btnChangeEnable" @click="searchConcept" >
                    Yes
                </el-button>
            </div>
        </el-dialog>





        <div id="node_info" v-show="showdetail_node"  style="z-index: -1">
            <el-card
                    :style="{ backgroundColor: 'rgb(253, 216, 186)' }"
                    class="node-card"
                    style="height: 250px"
            >
                <h2 :style="{ color: '#ca635f' }">{{ detailname }}</h2>
                <div>

                    <!--<h4 :style="{ color: '#aaaaff' }">ID: {{ detailValue.id }}</h4>-->
                    <!--<h4 :style="{ color: '#aaaaff' }">Index: {{ detailValue.index }}</h4>-->
                    <!--<h4 :style="{ color: '#aaaaff' }"></h4>-->
                    <h5 :style="{ color: '#aaaaff' }">{{ detailValue.snippet }}</h5>
                </div>
            </el-card>
        </div>


        <div id="link_info" v-show="showdetail_link" >
            <el-card
                    :style="{ backgroundColor: 'rgb(253, 216, 186)' }"
                    class="link-card"
            >
                <h2 :style="{ color: '#ca635f' }">Relationships Detail</h2>
                <div>

                    <h4 :style="{ color: '#aaaaff' }">ID: {{ detailValue.id }}</h4>
                    <h4 :style="{ color: '#aaaaff' }">Name: {{ detailname }}</h4>
                    <h4 :style="{ color: '#aaaaff' }">Type: {{ detailValue.type }}</h4>
                    <h4 :style="{ color: '#aaaaff' }">Label: {{ detailValue.label }}</h4>
                </div>
            </el-card>
        </div>



        <el-dialog :visible.sync="dialogFormVisible_instruction"

                   title="Instructions" center>
            <div>
                <h2 >Sustainability Knowledge Mapper</h2>
                <h1></h1>
                <h4>Welcome to Sustainability Knowledge Mapper.
                    On this site you can build your own knowledge graph.</h4>
                <h4>1.	To add a concept, double-click the screen.</h4>
                <h4>2.	To add a relationship, click a concept so it turns red, then drag from that concept to a different concept.</h4>
                <h4>3.	To edit a concept or relationship, right-click (Windows) or control-click (Mac) on it.</h4>
                <h4>4. You should save your work periodically by clicking the “Save” link.
                    Every concept must be connected to at least one other concept in order to be able to save that concept;
                    the system will not save any concepts that are not connected to at least one other concept.</h4>
                <h4>If you have any questions, please email the teaching staff.
                    We welcome any comments to help us improve this site. :)</h4>

                <!--<el-image-->
                        <!--class="table-td-thumb"-->
                        <!--:src="require('@/assets/img/help.png')"-->
                <!--&gt;</el-image>-->
            </div>

        </el-dialog>





    </div>


</template>

<script>
    import * as d3 from "d3";


    import { list } from 'node-7z'
    import linkfile from 'raw-loader!./../assets/temp_link.txt'

    import {config} from './../assets/config'
    // Vue.prototype.appConfig = config;

    import Vue from 'vue'
    import $ from 'jquery'
    import {
        getNodeSelfPath,
        setLinkGroup,
        getNodesLine,} from './../utils/deviceRelation'



    export default {

        name: 'App',
        data(){

            let info = {
                "links": [
                    {
                        "id":0,
                        "source" : 0,
                        "target" : 1,
                        "type" : "link",
                        'label': 'Link TEST',
                        "properties":{}

                    },

                    // {
                    //     "source" : 0,
                    //     "target" : 2,
                    //     "type" : "link",
                    //     'label': 'Link TEST',
                    //     "properties":{}
                    //
                    // },


                ],
                "nodes": [
                    {
                        "id": 0,
                        "type" : "node",
                        "label" : "Device",
                        "properties":{"name":"hello apple Inc "}
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
                has_weight:true,
                input:'',
                reference:'',
                new_reference:'',
                searchDialog:false,
                disableSelect: true,
                dashboard_show:false,
                //////////////////////////////////////
                readOnly : false,
                // log function parameters
                current_user:'',
                username:this.$route.params.username,
                // password:this.$route.params.password,
                password:'',
                newUsername:'',
                change_username:'',
                newPassword:'',
                showLogin:true,
                centerDialogVisible:false,
                dialog_createUser:false,

                // optionVisible_init_nodes:false,
                optionVisible_viewGraph:false,
                // optionVisible_change_nodes:false,
                optionVisible_add_link:false,
                optionVisible_change_link:false,

                inputNodeContent:'',
                upload_nodes:'',
                upload_links:'',

                // disable_initGraph:true,
                disable_submit:true,
                disable_viewGraph: true,
                disable_searchConcept: true,
                disable_dbclick : true,
                viewGraph_btn_status:true,
                // disable_getArticles:true,
                // dialogFormVisible_initGraph:false,

                //////////////////////////////////////
                showdetail_node:false, // show the info in the right corner
                showdetail_link:false,

                detailValue:'',
                detailname:'',
                node_value: '',
                link_value:'',
                init_node_value:'',

                btnChangeEnable: true,
                node_list: [],
                collective_node_value:'',
                collective_node_list : [],
                entire_collective_data:[],

                // node_list: [
                //     {
                //         value: 'node1',
                //         label: 'node1'
                //     },
                //
                //     {
                //         value: 'node2',
                //         label: 'node2'
                //     },
                //
                //     {
                //         value: 'test3',
                //         label: 'test3'
                //     },
                //     {
                //         value: 'bbb',
                //         label: 'bbb'
                //     }
                // ],

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
                searchNode: false,
                selected_Node: '',

                dialogFormVisible:false,
                dialogFormVisible_link:false,

                dialogFormVisible_relationship:false,
                dialogFormVisible_new_relationship:false,
                dialogFormVisible_viewCollective:false,
                dialogFormVisible_change_node_name:false,
                dialogFormVisible_change_link_name:false,
                dialogFormVisible_instruction:false,
                changeUserVisible:false,
                temp : [],
                clickTimeId : 0,

                node_id: '',
                link_id: '',
                new_link_name:'',
                new_node_name:'',

                menu: [
                    {
                        title: 'Delete Concept',
                        action: (node,select_node) => {

                            this.$confirm("Delete this concept?", "Tips", {
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                                type: "warning",
                            }).then(() => {
                                this.$message(

                                    {
                                        type: 'success',
                                        message: 'The concept is deleted!'
                                    });
                                console.log('test !!!',select_node,node);
                                this.info.nodes.splice(node,1);



                                for(let i =this.info.links.length-1; i>=0; i-- )
                                {
                                    console.log('link index',i,node);
                                    if(this.info.links[i].source.id === node
                                        || this.info.links[i].target.id === node)
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
                                    for(let j =0; j<this.info.links.length; j++){
                                        if(this.info.links[j].source.properties.name === this.info.nodes[i].properties.name){
                                            this.info.links[j].source.id = this.info.nodes[i].id
                                        }
                                        if(this.info.links[j].target.properties.name === this.info.nodes[i].properties.name){
                                            this.info.links[j].target.id = this.info.nodes[i].id
                                        }
                                    }
                                }




                                let node_to_string = this.info.nodes.map(function (element) {
                                    return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
                                        'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
                                        'x':element.x, 'y':element.y,  'fixed': true
                                    };
                                });


                                let link_to_string = this.info.links.map(function (element) {
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

                                console.log('stringfy node', node_to_string);
                                console.log('stringfy links', link_to_string);

                                let new_info = [];
                                new_info.nodes = node_to_string;
                                new_info.links = link_to_string;

                                // this.renderGraph(new_info);

                                this.renderGraph(new_info);

                            })

                        },


                    },
                    {
                        title: 'Change Concept Name',
                        action:(node_id)=>{
                            // if(this.config.Citations === true) {
                            this.dialogFormVisible_change_node_name = true;
                            // }

                            // this.dialogFormVisible_relationship = true;
                            this.node_id = node_id;

                        },

                    },

                ],

                menu_edge:[
                    {
                        title: 'Delete Relationship',
                        action: (link,selected_link) => {
                            console.log('ll',link,selected_link);
                            this.$confirm("Delete this Relationship?", "Tips", {
                                confirmButtonText: "Yes",
                                cancelButtonText: "No",
                                type: "warning",
                            }).then(() => {
                                this.$message(

                                    {
                                        type: 'success',
                                        message: 'The Relationship is deleted!'
                                    });

                                this.info.links.splice(link,1);

                                let node_to_string = this.info.nodes.map(function (element) {
                                    return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
                                        'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
                                        'x':element.x, 'y':element.y,'fx':element.x, 'fy':element.y, 'fixed': true
                                    };
                                });


                                let link_to_string = this.info.links.map(function (element) {
                                    return {
                                        "source": element.source.id,
                                        "target": element.target.id,
                                        "id": element.id,
                                        "type": element.type,
                                        "properties": {},
                                        "label": element.label,
                                        'x_end':element.x_end,
                                        'x_start':element.x_start,
                                        'y_end': element.y_end,
                                        'y_start': element.y_start,
                                        'fixed': true
                                    }

                                });

                                console.log('stringfy node', node_to_string);
                                console.log('stringfy links', link_to_string);

                                let new_info = [];
                                new_info.nodes = node_to_string;
                                new_info.links = link_to_string;

                                this.renderGraph(new_info);
                                // this.renderGraph(this.info);

                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: 'Cancel Delete!'
                                })

                            });

                        },

                    },
                    {
                        title: 'Change citation URL',
                        action:(link_id)=>
                        {
                            if(this.config.Citations === false){
                                this.dialogFormVisible_new_relationship = true;
                            }
                            else {
                                this.dialogFormVisible_change_link_name = true;
                            }

                            this.link_id = link_id;

                        }

                    }
                ],


                dragStartIndex:'',
                dragEndIndex:'',
                mouseLinkLineStartLoc:[],
                original_dx:0,
                original_dy:0,
                dragNode:null,
                start:null,
                end:null,
                target_node_index : '',
                initial_links_count :0,
                temp_linklist:[],
                temp_nodelist:[],
                snippet: [],
                select_snippet: '',
                uci_id:'',

                // config file
                config,
                relationship: '',
                new_relationship:'',
                relationship_name :'',
                // ifTeamWork:true,
            }
        },

        mounted() {

            this.$axios({
                url: "https://graphdb.ics.uci.edu/Shibboleth.sso/Session",
                method:'get'
            }).then(response =>{
                console.log(response);
                this.username = response.data.attributes[0].values[0];
                console.log('shibboleth username',this.username);
                this.handleShow();
            });




            console.log('route name',this.$route.name);
            console.log('config js',this.config, config.admin_users);

            // this.handleShow();
            this.renderGraph(this.info);
            this.readTxt();
            this.centerDialogVisible = false;
            this.initial_links_count = this.info.links.length;




            // window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
            // window.addEventListener('unload', e => this.unloadHandler(e))



        },

        // destroyed() {
        //
        //         window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
        //         window.addEventListener('unload', e => this.unloadHandler(e))
        //
        //
        // },

        methods: {

            // submit2() {
            //     let url = "http://graphdb.ics.uci.edu:8080/api/postUserGraph";
            //
            //     this.upload_nodes = this.info.nodes.map(function (element) {
            //         return {
            //             "id": String(element.id), "type": element.type, "label": element.label, "properties": {
            //                 "name": element.properties.name
            //             }
            //         }
            //
            //     });
            //     this.upload_links = this.info.links.map(function (element) {
            //
            //         return {
            //             "type": element.type, "id": String(element.id), "label": element.label,
            //             "source": String(element.source.index), "target": String(element.target.index),
            //             "properties": element.properties
            //         }
            //     });
            //
            //     console.log(this.info);
            //     console.log(this.current_user);
            //     console.log('nn', JSON.stringify(this.upload_nodes));
            //     console.log('nn', JSON.stringify(this.upload_links));
            //
            //
            //     const data =
            //         {
            //
            //             user: this.current_user,
            //             nodes: this.upload_nodes,
            //             links: this.upload_links
            //         }
            //
            //
            //     let a = window.navigator.sendBeacon("http://graphdb.ics.uci.edu:8080/postUserGraph",JSON.stringify(data));
            //
            // },

            getMouseXY(e){
                console.log('mouse position',e.x, e.y,
                    e.currentTarget.getBoundingClientRect().x,
                    e.currentTarget.getBoundingClientRect().y);


            },

            beforeunloadHandler(e) {



                if (this.$route.name === 'home' && this.viewGraph_btn_status===true) {
                    e = e || window.event;

                    if (e) {
                        console.log('hahaha',this.info)
                        e.returnValue = '关闭提示'
                    }

                    return '关闭提示'
                } else {
                    console.log('lalala');
                    window.onbeforeunload = null
                }
            },
            unloadHandler(e){

                // let flag = true;
                // let noWeight_node = []
                // for (let i = 0; i < this.info.nodes.length; i++) {
                //     if (this.info.nodes[i].weight === 0) {
                //         flag = false;
                //         noWeight_node.push(this.info.nodes[i].properties.name)
                //     }
                // }

                // let selected_nodes = [] // to find those nodes without links
                // for(let i =0; i < this.info.length; i++){
                //     if (this.info.nodes[i].weight === 0) {
                //
                //                 selected_nodes.push(this.info.nodes[i])
                //             }
                // }

                if (this.$route.name === 'home' && this.viewGraph_btn_status===true ) {



                    this.upload_nodes = this.info.nodes.map(function (element) {
                        if(element.weight > 0) {
                            return {
                                "id": String(element.id), "type": element.type, "label": element.label, "properties": {
                                    "name": element.properties.name
                                }
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

                    console.log(this.info);
                    console.log(this.current_user);
                    console.log('nn', JSON.stringify(this.upload_nodes));
                    console.log('nn', JSON.stringify(this.upload_links));

                    const data =
                        {

                            user: this.current_user,
                            nodes: this.upload_nodes,
                            links: this.upload_links
                        }


                        // navigator.sendBeacon("http://172.18.0.3:8080/api/postUserGraph", JSON.stringify(data));

                    navigator.sendBeacon("https://graphdb.ics.uci.edu/api/postUserGraph", JSON.stringify(data));
                }


            },

            changeUser(){
                this.changeUserVisible = true;
            },

            login() {

                if ( this.change_username === '') {
                    this.$message(
                        {
                            type: 'warning',
                            message: 'The username cannot be empty'
                        });
                }else {
                    console.log('hahahaha');
                    this.$axios({
                        url: '/checkUserCredentials',
                        method: 'post',
                        data: {
                            user: this.change_username,
                            password: this.password


                        }

                    }).then(response =>{

                        console.log('check the credential',response);
                        if(response.status === 204)
                        {

                            this.$message(

                                {
                                    type: 'warning',
                                    message: 'Password for '+ this.change_username +' is wrong!'
                                });
                            // this.showLogin = true;
                            this.changeUserVisible = true;
                            // this.username = '';
                            this.password = '';
                            this.change_username = '';

                        }
                        else{

                            this.$axios({
                                url: '/getUserGraph',
                                method: 'post',
                                data: {
                                    user: this.change_username,

                                }

                            }).then(response => {
                                if (response.status === 204) {
                                    this.$message(
                                        {
                                            type: 'warning',
                                            message: 'User username does not exist !'
                                        });

                                    this.changeUserVisible = true;
                                }
                                this.username = this.change_username;
                                this.change_username = '';
                                this.password = '';
                                this.changeUserVisible = false;
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
                                this.$message(

                                    {
                                        type: 'success',
                                        message: 'Welcome Back, ' + this.current_user
                                    });
                                this.renderGraph(this.info);

                                // else {
                                //     this.$router.push({
                                //         name: 'home',
                                //         params: {username: this.username}
                                //     })
                                // }
                            })

                        }

                    });


                }

            },



            getGraphStatistics(){

                console.log('haha');

                this.$router.push({
                    name: 'dashboard',
                    params:{
                        username: this.username,
                        // password: this.password
                    }
                });

                // let routeUrl =  this.$router.resolve({
                //     name: 'dashboard',
                //     query:{
                //         username: this.username,
                //         password: this.password
                //     }
                //
                // });
                // console.log(routeUrl.href);
                //
                // window.open(routeUrl.href, '_blank');
            },

            instruction(){
                this.dialogFormVisible_instruction = true;

            },
            TeamLogin(){
                this.$router.push({
                    name: 'login',
                    // params: {username: this.username, password: this.password}
                })
            },

            readTxt(){


                // console.log(linkfile.split('\n'));
                // let link_name = linkfile.split('\n').map(function (element) {
                //
                //     return {'value':element, 'label':element}
                // });
                console.log(this.config.relationships);

                let link_name = this.config.relationships.map(function (element) {
                    return {'value':element, 'label':element}
                });
                this.link_list = link_name;
                console.log(this.link_list.length);
                if(this.link_list.length === 1){

                    this.relationship = this.link_list[0].value;
                    this.new_relationship = this.link_list[0].value;

                }



            },


            search:function(nextRef){

                if(this.input !== '') {
                    this.$refs[nextRef].$el.click();
                    this.node_value = [];
                    this.new_node_name = [];
                    this.disableSelect = false;

                    // this.$axios({
                    //     url:'https://en.wikipedia.org/w/api.php?action=query&generator=prefixsearch&gpssearch='+this.input+'&gpslimit=10&prop=extracts&exsentences=1&format=json&exintro&origin=*&callback=',
                    //     method:'get'
                    // }).then(response=>{
                    //     response.data = response.data.slice(5);
                    //     response.data = response.data.slice(0,response.data.length-1);
                    //     let node_info = JSON.parse(response.data).query.pages;
                    //     console.log(node_info)
                    //
                    // });

                    this.$axios({
                        url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=intitle:+"+this.input+"+&srprop=snippet&format=json&origin=*&callback=",
                        method:'get'

                    }).then(response =>{
                        let term = [];
                        console.log(response.data);
                        response.data = response.data.slice(5);
                        response.data = response.data.slice(0,response.data.length-1);
                        let node_info = JSON.parse(response.data).query.search;

                        for(let i =0;i<node_info.length;i++){
                            if(node_info[i].title.search('(disambiguation)') !== -1 ||
                                node_info[i].title.search('List of') !== -1 ||
                                node_info[i].title.search('list of') !== -1 )
                                continue;
                            node_info[i].snippet = node_info[i].snippet.replace(/<[^>]*>|/g,"").replace(/\(.*?\)/g,'')
                            term.push(node_info[i]);
                            // console.log(node_info[i].snippet.replace(/<[^>]*>|/g,"").replace(/\(.*?\)/g,''));
                            this.snippet[node_info[i].title] = node_info[i].snippet;
                            // console.log(node_info[i].snippet)
                        }

                        this.node_list = term.map(function (element) {

                            return {'value': element.title, 'label': element.title,'snippet':element.snippet}
                        });
                        if(this.node_list.length === 0){
                            this.btnChangeEnable = true;
                        }else {
                            this.node_value = this.node_list[0].value;
                            this.new_node_name = this.node_list[0].value;
                            console.log('Current Node value', this.node_value);
                            this.select_snippet = this.node_list[0].snippet;

                            this.btnChangeEnable = false;
                        }

                    })
                }
                else{
                    alert('Input can not be empty');
                }
                this.$forceUpdate()
            },

            blur(){
                console.log('lose')
            },
            focus(){
                console.log('get');
                console.log( this.$refs);
                this.$refs['select'].focus()

            },

            searchConcept_dialog(){
                this.dialogFormVisible_viewCollective = true
            },

            getAllConcepts:function(){

                let flag = null;
                this.viewGraph_btn_status = !this.viewGraph_btn_status;
                if(this.viewGraph_btn_status === false ) {
                    this.temp_linklist = [];
                    this.temp_nodelist = [];
                    flag = this.submitData();

                }
                if(flag === false)
                {
                    this.viewGraph_btn_status = true;
                    console.log('o')
                }else {
                    this.disable_submit = true;


                    if (this.viewGraph_btn_status === false) {

                        this.readOnly = true;
                        this.$axios({
                            url: '/getAllConcepts',
                            method: 'get',
                        }).then(response => {
                            this.disable_searchConcept = false;
                            this.dialogFormVisible_viewCollective = true;

                            this.collective_node_list = response.data.nodes.map(function (element) {

                                return {'value': element, 'label': element}

                            });
                        })

                        this.renderGraph({nodes:[], links:[]});

                    }
                    else {

                        this.readOnly = false;
                        this.handleShow();
                    }
                }
            },
            collapseConcept(node){
                console.log('node collapsed', node);

                for(let i =0; i<this.info.nodes.length; i++){
                    if(this.info.nodes[i].properties.name === node.properties.name){
                        this.info.nodes[i].if_expanded = false;
                    }
                }

                let related_links = [];
                //找出与该node相连的所有links
                for(let i=0; i< this.info.links.length; i++){
                    if(this.info.links[i].source.properties.name === node.properties.name ||
                        this.info.links[i].target.properties.name === node.properties.name){
                        related_links.push(this.info.links[i])
                    }
                }



                //找出与该node之间有多个连线的nodes集合
                let related_nodes = [];
                let related_nodes_name = [];
                let multi_related_nodes = []; //选取相关node weight>1
                let multi_related_nodes_name = [];
                let multi_related_nodes_only = []; //选取只和目标node相关 且weight>1的nodes集合
                let multi_related_nodes_only_name = []; //选取只和目标node相关 且weight>1的nodes集合

                let collapse_nodes = []; //需要collapse的nodes集合
                let collapse_links = []; //需要collapse的links集合

                let collapse_nodes_name = []; //需要collapse的nodes集合
                let collapse_links_id = []; //需要collapse的links集合

                for(let i =0; i< related_links.length;i++){
                    if(related_links[i].source.properties.name === node.properties.name){
                        related_nodes.push(related_links[i].target);
                        related_nodes_name.push(related_links[i].target.properties.name);

                    }
                    else if(related_links[i].target.properties.name === node.properties.name){
                        related_nodes.push(related_links[i].source);
                        related_nodes_name.push(related_links[i].source.properties.name);

                    }

                }



                for(let i=0;i<related_nodes.length;i++){
                    if(related_nodes[i].weight > 1 ){
                        multi_related_nodes.push(related_nodes[i]);
                        multi_related_nodes_name.push(related_nodes[i].properties.name);
                    }

                }


                //筛选与只有和目标node存在多个关系的node（不连接其他node）
                let node_count = {};
                for(let i =0; i< multi_related_nodes_name.length; i++){
                    let name = multi_related_nodes_name[i];
                    node_count[name] = node_count[name] ? node_count[name] + 1 : 1;
                }

                for(let i=0; i< multi_related_nodes.length;i++){
                    if((multi_related_nodes[i].weight - node_count[multi_related_nodes_name[i]] === 0)
                    &&(multi_related_nodes_only_name.indexOf(multi_related_nodes_name[i])) ===-1)
                    {
                        multi_related_nodes_only.push(multi_related_nodes[i]);
                        multi_related_nodes_only_name.push(multi_related_nodes[i].properties.name);

                    }
                }


                // 找出所有需要collapse的nodes
                for(let i =0; i<related_nodes.length;i++){
                    if(related_nodes[i].weight === 1){
                        collapse_nodes.push(related_nodes[i]);
                        collapse_nodes_name.push(related_nodes[i].properties.name);
                    }
                }
                for(let i=0; i<multi_related_nodes_only.length;i++){
                    collapse_nodes.push(multi_related_nodes_only[i]);
                    collapse_nodes_name.push(multi_related_nodes_only[i].properties.name);
                }


                //找出所有需要collapse的links，需要在related links里面减去那些不需要collapse 的nodes的links
                let uncollapse_nodes = []; // 记录不需要被collapse的node集合
                let uncollapse_nodes_name = [];
                for(let i =0; i<related_nodes.length; i++){

                    if(collapse_nodes_name.indexOf(related_nodes_name[i]) === -1){
                        uncollapse_nodes.push(related_nodes[i]);
                        uncollapse_nodes_name.push(related_nodes_name[i]);
                    }
                }


                for(let i = 0; i<related_links.length;i++){
                    if(collapse_nodes_name.indexOf(related_links[i].source.properties.name) > -1 ||
                    collapse_nodes_name.indexOf(related_links[i].target.properties.name)>-1){
                        collapse_links.push(related_links[i]);
                        collapse_links_id.push(related_links[i].id);
                    }
                }




                console.log('所有与该node相连的links集合',related_links);
                console.log('所有与该node有关系的node集合',related_nodes);
                console.log('这个node集合的名字',related_nodes_name);
                console.log('2个node之间有多个link的情况',multi_related_nodes,multi_related_nodes_name,node_count);
                console.log('只有和目标node存在多个关系的node(不连接其他node)',multi_related_nodes_only, multi_related_nodes_only_name);
                console.log('所有不需要collapse的nodes集合',uncollapse_nodes,uncollapse_nodes_name);
                console.log('所有需要collapse的nodes集合',collapse_nodes,collapse_nodes_name);
                console.log('所有需要collapse的links集合',collapse_links,collapse_links_id);



                for(let i = this.info.nodes.length - 1; i > 0; i--){
                    //如果nodes集合中 该node属于要被collapse的集合里面，则collapse该node
                    if(collapse_nodes_name.indexOf(this.info.nodes[i].properties.name) > -1){
                        this.info.nodes.splice(i,1);
                    }
                }

                for(let i = this.info.links.length - 1; i > 0; i--){
                    //如果links集合中 该link属于要被collapse的集合里面，则collapse该link
                    if(collapse_links_id.indexOf(this.info.links[i].id) > -1){
                        this.info.links.splice(i,1);
                    }
                }


                for(let i = 0; i<this.info.nodes.length; i++){
                    this.info.nodes[i].id = i;
                    this.info.nodes[i].index = i;
                }

                for(let i = 0; i<this.info.links.length; i++){
                    this.info.links[i].id = i;
                }

                console.log('Nodes 最后的结果', this.info.nodes);
                console.log('Links 最后的结果', this.info.links);


                // let new_node = {
                //     'id': nodes.length,
                //     "type": "node",
                //     'properties': {'name': input},
                //     'label': 'Concept',
                //     'snippet':snippet,
                //     'if_expanded':false
                // };

                let node_to_string = this.info.nodes.map(function (element) {
                    return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
                    'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded};
                });


                let link_to_string = this.info.links.map(function (element) {
                    return {
                        "source": element.source.id,
                        "target": element.target.id,

                        "id": element.id,
                        "type": element.type,
                        "properties": {},
                        "label": element.label}

                });

                console.log('stringfy node', node_to_string);
                console.log('stringfy links', link_to_string);

                let new_info = [];
                new_info.nodes = node_to_string;
                new_info.links = link_to_string;

                this.renderGraph(new_info);



                // for(let i = this.info.nodes.length - 1; i>=0; i--){
                //         if(single_link_node_name.indexOf(this.info.nodes[i].properties.name) > -1){
                //             this.info.nodes.splice(i,1);
                //         }
                // }
                //
                // for(let i = this.info.links.length - 1; i>=0; i--){
                //         if(hideLinks_id.indexOf(this.info.links[i].id) > -1){
                //             this.info.links.splice(i,1);
                //         }
                // }


                // let deepcopy_link =this.info.links;
                //
                //
                // let deepcopy_node = this.info.nodes;
                //
                // console.log('deep cp node',deepcopy_node);
                // console.log('deep cp link',deepcopy_link);
                //
                //
                //
                //
                // let related_link = [];
                // let related_node = [];
                //
                // for(let i=0; i< deepcopy_link.length;i++){
                //     if(deepcopy_link[i].source.properties.name === node.properties.name ||
                //         deepcopy_link[i].target.properties.name === node.properties.name ){
                //         related_link.push(deepcopy_link[i])
                //         if(deepcopy_link[i].source.properties.name !== node.properties.name){
                //             related_node.push(deepcopy_link[i].source)
                //         }else{
                //             related_node.push(deepcopy_link[i].target)
                //         }
                //
                //     }
                // }
                //
                //
                // let single_link_node = [];
                // let single_link_node_name = [];
                // let multi_link_node = [];
                // let multi_link_node_name = [];
                // for(let i =0; i<related_node.length;i++){
                //     if(related_node[i].weight === 1){
                //         single_link_node.push(related_node[i]);
                //         single_link_node_name.push(related_node[i].properties.name);
                //     }else{
                //         multi_link_node.push(related_node[i]);
                //         multi_link_node_name.push(related_node[i].properties.name);
                //     }
                // }
                // console.log('multi link node name',multi_link_node_name);
                // let hideLinks = [];
                // let hideLinks_id = [];
                //
                // for(let i=0; i<related_link.length;i++){
                //     if(related_link[i].source.properties.name === node.properties.name &&
                //         single_link_node_name.indexOf(related_link[i].target.properties.name)>-1){
                //         hideLinks.push(related_link[i]);
                //         hideLinks_id.push(related_link[i].id);
                //     }
                //     else if(related_link[i].target.properties.name === node.properties.name &&
                //         single_link_node_name.indexOf(related_link[i].source.properties.name)>-1){
                //         hideLinks.push(related_link[i]);
                //         hideLinks_id.push(related_link[i].id);
                //     }
                // }
                //
                // console.log('related links', related_link);
                // console.log('related nodes', related_node);
                // console.log('single link nodes', single_link_node);
                // console.log('hide links',hideLinks);
                // console.log('hide link id', hideLinks_id);
                //
                //
                //
                // for(let i = this.info.nodes.length - 1; i>=0; i--){
                //         if(single_link_node_name.indexOf(this.info.nodes[i].properties.name) > -1){
                //             this.info.nodes.splice(i,1);
                //         }
                // }
                //
                // for(let i = this.info.links.length - 1; i>=0; i--){
                //         if(hideLinks_id.indexOf(this.info.links[i].id) > -1){
                //             this.info.links.splice(i,1);
                //         }
                // }
                //
                //
                // console.log('node',this.info.nodes);
                // console.log('link',this.info.links);
                //
                // this.renderGraph(this.info);











            },



            expandConcept(node_name){
                console.log('node name',node_name);
                console.log('current info',this.info);

                let linklist = [];
                let nodelist = [];
                // console.log('concept value', this.collective_node_value);
                this.$axios({
                    url: '/getAllNodeConnections',
                    method: 'post',
                    data:{
                        node:node_name
                    }
                }).then(response => {
                    console.log(response.data);
                    linklist = response.data.links.map(function (element) {
                        element.source = Number(element.source);
                        element.target = Number(element.target);
                        element.id = Number(element.id);
                        return element
                    });

                    nodelist = response.data.nodes.map(function (element) {
                        element.id = Number(element.id);
                        return element
                    });
                    // console.log('nodelist 2',nodelist);
                    // console.log('linklist 2',linklist);


                    let node_merge_result = this.mergeNodes(this.temp_nodelist,nodelist);
                    console.log('temp node', this.temp_nodelist);
                    let merge_node = node_merge_result[0];
                    let node_map = node_merge_result[1];
                    // console.log('ppp',node_map);
                    // console.log('lll',linklist);



                    for(let i =0; i<linklist.length;i++){
                        linklist[i].source = node_map[linklist[i].source];
                        linklist[i].target = node_map[linklist[i].target];

                    }


                    // console.log('nnn',linklist);
                    let merge_link = this.mergeLinks(this.temp_linklist,linklist);



                    //
                    this.temp_linklist = merge_link;
                    this.temp_nodelist = merge_node;

                    this.info.nodes = merge_node;
                    this.info.links = merge_link;
                    // console.log(this.info)


                    for(let i =0; i<this.info.nodes.length;i++){
                        if(this.info.nodes[i].if_expanded === true){
                            console.log('expanded node', this.info.nodes[i])
                        }else{
                            this.info.nodes[i]['if_expanded']= false;
                        }
                    }


                    this.renderGraph(this.info)



                })
            },

            mergeLinks(arr1,arr2)
            {
                let length1 = arr1.length;
                let length2 = arr2.length;

                arr1 = arr1.map(function (element) {
                    element.source = element.source.id;
                    element.target = element.target.id;
                    return element
                });


                let arr1_set = arr1.map(function(element) {
                    return [element.label, element.source, element.target].toString()
                });
                console.log(arr1_set);

                for(let i =0; i<arr2.length;i++){
                    if (arr1_set.indexOf([arr2[i].label,arr2[i].source,arr2[i].target].toString())>-1){
                        // console.log([arr2[i].label,arr2[i].source,arr2[i].target]);
                        continue;
                    }else{
                        arr2[i].id = arr1.length;
                        arr1.push(arr2[i]);
                    }
                }

                // console.log('merge link',arr1);
                return arr1
            },

            mergeNodes(arr1,arr2){
                let length1 = arr1.length;
                let length2 = arr2.length;
                let node_map = [];
                let old_node_id = '';
                let arr1_name = arr1.map(function (element) {
                    return element.properties.name
                });
                // console.log(arr1_name)
                // console.log(arr1_name.indexOf('Meat'))
                for(let i =0; i<arr2.length;i++){
                    old_node_id = arr2[i].id;
                    if(arr1_name.indexOf(arr2[i].properties.name) > -1){ // 去重
                        node_map[old_node_id] = arr1_name.indexOf(arr2[i].properties.name);
                        continue
                    }
                    else{
                        arr2[i].id = arr1.length;
                        arr1.push(arr2[i])
                        node_map[old_node_id] = arr2[i].id
                    }
                }

                // console.log('merge node',arr1);
                return [arr1, node_map]
            },

            searchConcept(){
                let linklist = [];
                let nodelist = [];
                console.log('concept value', this.collective_node_value);
                this.$axios({
                    url: '/getAllNodeConnections',
                    method: 'post',
                    data:{
                        node:this.collective_node_value
                    }
                }).then(response => {
                    console.log(response);
                    linklist = response.data.links.map(function (element) {
                        element.source = Number(element.source);
                        element.target = Number(element.target);
                        element.id = Number(element.id);
                        return element
                    });

                    nodelist = response.data.nodes.map(function (element) {
                        element.id = Number(element.id);
                        return element
                    });

                    this.temp_nodelist = nodelist;
                    this.temp_linklist = linklist;

                    console.log('temp node',this.temp_nodelist);
                    console.log('temp list',this.temp_linklist);
                    this.dialogFormVisible_viewCollective = false;
                    // this.info.nodes = nodelist;
                    // this.info.links = linklist;
                    this.info.nodes = this.temp_nodelist;
                    this.info.links = this.temp_linklist;

                    let concept_value = this.collective_node_value;

                    this.info.nodes = this.info.nodes.map(function (element) {
                        if(element.properties.name === concept_value){
                            element.if_expanded = true;
                        }
                        else {
                            element['if_expanded'] = false;
                        }
                        return element
                    });

                    this.collective_node_value = '';

                    this.renderGraph(this.info);

                })




            },
            ////////////////////////////////////////////////////////////
            // login functions


            createUser:function(){


                console.log('create user function',this.newUsername)

                this.$axios({
                    url : '/createNewUser',
                    method : 'post',
                    data :
                        {
                            "user" : this.newUsername,
                            "password" : this.newPassword
                        }
                }).then(response=>{

                    if(response.status === 204)
                    {

                        this.$message(

                            {
                                type: 'warning',
                                message: 'The username already exists!'
                            });
                        // this.showLogin = true;

                        // this.username = '';
                        // this.password = '';
                        this.newUsername = '';
                        this.newPassword = '';
                    }
                    else {
                        this.dialog_createUser  = false;
                        this.username = this.newUsername;
                        this.password = this.newPassword;
                        this.newPassword = '';
                        this.newUsername = '';
                        console.log(response);

                        this.$axios({
                            url: '/getUserGraph',
                            method: 'post',
                            data:
                                {
                                    user: this.username,
                                    // password: this.password

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
                            this.changeUserVisible = false;
                            this.renderGraph(this.info)


                        })
                    }
                })

            },


            handleShow:function(){





                console.log('cccc');
                console.log('handleshow username', this.username);
                console.log(this.$route.params);
                // let data = [];
                // if(this.ifTeamWork === false){
                //
                //     data = {user: this.username}
                // }else{
                //     data = { user : this.username
                //              }
                // }

                this.$axios({
                    url:'/getUserGraph',
                    method:'post',
                    data:{user:this.username},
                    // data:{
                    //     // user : "some_user",
                    //     // password: "my_password"
                    //     user : this.username,
                    //     password: this.password
                    //     // user : String(this.$route.params.username),
                    //     // password: String(this.$route.params.password)
                    // }

                }).then(response=>{
                    if (response.status === 204){
                        alert('Wrong username or password !')
                        this.centerDialogVisible=true;
                    }
                    else {
                        if(this.config.admin_users.indexOf(this.username)!== -1){
                            this.dashboard_show = true;
                        }

                        this.centerDialogVisible=false;
                        this.disable_dbclick = false;
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
                        this.$message(

                            {
                                type: 'success',
                                message: 'Welcome Back, ' + this.current_user
                            });
                        this.renderGraph(this.info)
                    }

                }).catch(error=>{
                    this.showLogin = true;
                    this.username = '';
                    // this.password = '';
                })


            },

            onTapLogin:function () {
                this.centerDialogVisible=true
            },

            logout:function () {

                this.showLogin = true;
                this.disable_dbclick = true;
                this.disable_initGraph = true;
                this.disable_submit = true;
                this.disable_viewGraph  =true;
                this.disable_searchConcept = true;
                this.viewGraph_btn_status = true;
                this.dashboard_show=false;
                this.username = '';
                // this.password = '';
                // this.info= {
                //     nodes:[],
                //     links:[]
                // };
                // this.$router.push({name:'login'})
                // this.centerDialogVisible=true;
                // this.renderGraph(this.info)

                let url1 = "https://shib.nacs.uci.edu/idp/profile/Logout";
                let url2 = "https://graphdb.ics.uci.edu/dist/";
                // let url2 = "https://www.youtube.com/";



                window.location.href = "https://graphdb.ics.uci.edu/Shibboleth.sso/Logout?return="
                    +encodeURI(url1 + "?" + "return_url="+encodeURI(url2) )
                    ;
            },

            ////////////////////////////////////////////////////////////



            showOption_view_graph()
            {

                let inputContent = this.$refs.viewCollective.$children[0].value;


                this.optionVisible_viewGraph = inputContent.length >=2;

                this.$forceUpdate()
            },









            selectClear() {
                this.node_value = '';
                this.link_value = '';
                this.new_node_name = '';
                this.new_link_name = '';
                this.init_node_value = '';
                this.collective_node_value = '';

                // this.optionVisible_init_nodes=false;
                // this.optionVisible_add_nodes=false;
                // this.optionVisible_change_nodes=false;

                this.optionVisible_add_link=false;
                this.optionVisible_change_link=false;
                this.optionVisible_viewGraph = false;
                this.disableSelect = true;
                this.input = '';
                this.node_list  =[];
                this.relationship = '';


                this.$forceUpdate()
            },

            selectChange(val) {
                console.log(val)
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
                    this.select_snippet = this.snippet[this.node_value]
                    console.log('snippet',this.select_snippet)
                }
                else if(this.dialogFormVisible === true){
                    this.node_value = val;
                    this.select_snippet = this.snippet[this.node_value]
                    console.log('snippet',this.select_snippet)
                }
                else if(this.dialogFormVisible_initGraph === true){
                    this.init_node_value = val;
                }
                else if(this.dialogFormVisible_viewCollective === true){
                    this.collective_node_value = val;
                }
                this.$forceUpdate()
            },


            cancel()
            {
                this.dialogFormVisible = false;
                this.dialogFormVisible_link = false;
                this.dialogFormVisible_change_node_name = false;
                this.dialogFormVisible_change_link_name = false;
                this.dialogFormVisible_new_relationship = false;
                this.dialogFormVisible_relationship  = false;
                this.temp.length = 0;
                // this.newPassword = '';
                this.newUsername = '';
                this.btnChangeEnable = true;
                this.dialogFormVisible_initGraph = false;


                // this.ifClicked = false;
                this.selectClear();


            },

            collectiveGraph_cancel(){
                this.renderGraph(this.info)
                this.dialogFormVisible_viewCollective = false;
                this.viewGraph_btn_status = true;
                this.readOnly = false;
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



                        let flag = this.doubleClick(this.info, this.info.nodes, this.node_value, this.select_snippet);
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
                this.info.nodes[this.node_id].snippet = this.select_snippet;
                this.dialogFormVisible_change_node_name = false;

                // this.optionVisible = false;
                // this.optionVisible_link = false;
                this.btnChangeEnable = true;

                let node_to_string = this.info.nodes.map(function (element) {
                    return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
                        'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
                        'x': element.x, 'y':element.y,'fx':element.x, 'fy':element.y, 'fixed': true
                    };
                });


                let link_to_string = this.info.links.map(function (element) {
                    return {
                        "source": element.source.id,
                        "target": element.target.id,
                        "id": element.id,
                        "type": element.type,
                        "citation": {},
                        "label": element.label,
                        'x_end':element.x_end,
                        'x_start':element.x_start,
                        'y_end':element.y_end,
                        'y_start':element.y_start,
                        'fixed': true
                    }

                });

                console.log('stringfy node', node_to_string);
                console.log('stringfy links', link_to_string);

                let new_info = [];
                new_info.nodes = node_to_string;
                new_info.links = link_to_string;

                this.renderGraph(new_info);

                // this.renderGraph(this.info);
                this.selectClear();

            },

            change_relationship_name(){
                this.info.links[this.link_id].label = this.new_relationship;
                this.dialogFormVisible_new_relationship = false;
                this.new_relationship = '';

                let node_to_string = this.info.nodes.map(function (element) {
                    return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
                        'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
                        'x': element.x, 'y':element.y,'fx':element.x, 'fy':element.y, 'fixed': true
                    };
                });


                let link_to_string = this.info.links.map(function (element) {
                    return {
                        "source": element.source.id,
                        "target": element.target.id,
                        "id": element.id,
                        "type": element.type,
                        "citation": {},
                        "label": element.label,
                        'x_end':element.x_end,
                        'x_start':element.x_start,
                        'y_end':element.y_end,
                        'y_start':element.y_start,
                        'fixed': true
                    }

                });

                console.log('stringfy node', node_to_string);
                console.log('stringfy links', link_to_string);

                let new_info = [];
                new_info.nodes = node_to_string;
                new_info.links = link_to_string;

                this.renderGraph(new_info);

                // this.renderGraph(this.info);
                this.selectClear();


            },


            change_link_name()
            {

                let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

                if(pattern.test(this.new_reference)) {

                    this.info.links[this.link_id].label = this.new_relationship;
                    this.info.links[this.link_id].citation = this.new_reference;
                    this.dialogFormVisible_change_link_name = false;

                    this.btnChangeEnable = true;
                    this.new_reference = '';
                    this.new_relationship = '';



                    let node_to_string = this.info.nodes.map(function (element) {
                        return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
                            'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
                            'x': element.x, 'y':element.y,'fx':element.x, 'fy':element.y, 'fixed': true
                        };
                    });


                    let link_to_string = this.info.links.map(function (element) {
                        return {
                            "source": element.source.id,
                            "target": element.target.id,
                            "id": element.id,
                            "type": element.type,
                            "citation": {},
                            "label": element.label,
                            'x_end':element.x_end,
                            'x_start':element.x_start,
                            'y_end':element.y_end,
                            'y_start':element.y_start,
                            'fixed': true
                        }

                    });

                    console.log('stringfy node', node_to_string);
                    console.log('stringfy links', link_to_string);

                    let new_info = [];
                    new_info.nodes = node_to_string;
                    new_info.links = link_to_string;

                    this.renderGraph(new_info);

                    // this.renderGraph(this.info);
                    this.selectClear();
                }else{

                    this.dialogFormVisible_change_link_name = true;
                    this.$message(

                        {
                            type: 'warning',
                            message: 'Invalid URL!'
                        });
                    this.new_reference = '';


                }
            },



            select_relationship(){
                console.log('selected relationship: ',this.relationship);
                this.relationship_name = this.relationship;
                this.dialogFormVisible_relationship = false;
                this.selectClear();

            },



            drag_addLinks()
            {


                console.log('selected relationship: ',this.relationship);
                this.relationship_name = this.relationship;


                console.log('add drag links',this.start.index, this.end.index);

                console.log('add reference', this.reference);
                let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator



                    if ((pattern.test(this.reference) && this.config.Citations === true) || (this.config.Citations === false )) {

                        this.dialogFormVisible_link = false;
                        this.dialogFormVisible_relationship = false;
                        console.log('valid');
                        let new_link = {};

                        if (this.relationship !== ''){
                            if (this.config.Citations === false) {
                                new_link = {
                                    "source": this.start,
                                    "target": this.end,
                                    "id": this.info.links.length,
                                    "type": 'link',
                                    "citation": {},
                                    "label": this.relationship

                                };
                            }
                            else {
                                new_link = {
                                    "source": this.start,
                                    "target": this.end,
                                    "id": this.info.links.length,
                                    "type": 'link',
                                    "citation": this.reference,
                                    "label": this.relationship

                                };
                            }


                        let link_name_set = [];
                        console.log('temp node', this.temp[0]);
                        for (let i = 0; i < this.info.links.length; i++) {
                            if (this.info.links[i].source.properties.name === this.start.properties.name
                                && this.info.links[i].target.properties.name === this.end.properties.name) {

                                link_name_set.push(this.info.links[i].label);
                            }
                        }

                        console.log('link name set', link_name_set);
                        if (link_name_set.indexOf(new_link.label) > -1) {
                            console.log('This label is already used ');
                            this.$message({
                                'type': 'warning',
                                'message': 'There is already a relationship with that URL!'
                            })
                        }
                        else {

                            this.info.links.push(new_link);
                            console.log('new link added', this.info, typeof(this.info));
                            // this.initial_links_count ++;


                        }

                        let node_to_string = this.info.nodes.map(function (element) {
                            return {
                                'id': element.id, 'type': element.type, 'properties': {'name': element.properties.name},
                                'label': element.label, 'snippet': element.snippet, 'if_expanded': element.if_expanded,
                                'x':element.x, 'y':element.y,'fx':element.x, 'fy':element.y, 'fixed': true
                            };
                        });
                        let link_to_string;
                        if (this.config.Citations === false) {
                            link_to_string = this.info.links.map(function (element) {
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
                                    'fixed': true
                                }

                            });
                        } else {
                            link_to_string = this.info.links.map(function (element) {
                                return {
                                    "source": element.source.id,
                                    "target": element.target.id,
                                    "id": element.id,
                                    "type": element.type,
                                    "citation": element.citation,
                                    "label": element.label,
                                    'x_end':element.x_end,
                                    'x_start':element.x_start,
                                    'y_end': element.y_end,
                                    'y_start': element.y_start,
                                    'fixed': true
                                }

                            });
                        }

                        console.log('stringfy node', node_to_string);
                        console.log('stringfy links', link_to_string);

                        let new_info = [];
                        new_info.nodes = node_to_string;
                        new_info.links = link_to_string;

                        this.renderGraph(new_info);


                        // this.renderGraph(this.info);
                        this.ifClicked = false;
                        this.selectClear();
                        this.reference = '';
                        }else{
                            this.dialogFormVisible_link = true;
                            this.$message(
                                {
                                    type: 'warning',
                                    message: 'Labels can not be empty!'
                                });
                            this.reference = '';

                        }


                    } else {
                        this.dialogFormVisible_link = true;
                        this.$message(
                            {
                                type: 'warning',
                                message: 'Invalid URL!'
                            });
                        this.reference = '';



                }




            },


            renderGraph(info) {



                if (this.viewGraph_btn_status === false && this.showLogin === false) {
                    this.disable_submit = true;
                    this.disable_searchConcept = false;
                }
                console.log('render data', info);
                if(this.showLogin === false && this.viewGraph_btn_status === true)
                {
                    this.disable_submit = false;
                    this.disable_viewGraph = false;
                    this.disable_searchConcept = true;


                }



                let {links, nodes} = info;

                //关系分组
                setLinkGroup(links);
                console.log('render graph link',links);
                let nodes_name = ''
                nodes.map(function (element) {
                    nodes_name = nodes_name.concat(element.properties.name,'%7C')
                     return nodes_name

                });
                // console.log('nodes_name',nodes_name)

                if(nodes !== []) {
                    this.$axios({
                        url: 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=' + nodes_name + '&redirects=&exintro=true&exsentences=1&format=json&origin=*&callback=',
                        method: 'get'
                    }).then(response => {


                        response.data = response.data.slice(5);
                        response.data = response.data.slice(0, response.data.length - 1);
                        let wiki = JSON.parse(response.data).query.pages;
                        console.log('wiki', wiki);
                        let extract = [];
                        for(let i =0; i<Object.keys(wiki).length;i++){
                            let snippet = String(wiki[Object.keys(wiki)[i]].extract).replace(/<[^>]*>|/g,"").replace(/\(.*?\)/g,'');
                            snippet = snippet.replaceAll('\n','');
                            let title = String(wiki[Object.keys(wiki)[i]].title)
                            extract[title] = snippet
                        }
                        // console.log('extract',extract)
                        // for(let i  = 0; i<nodes.length;i++){
                        //     nodes[i].snippet = extract[nodes[i].properties.name]
                        // }

                        for(let i =0; i< Object.keys(extract).length; i++){
                            if(localStorage.hasOwnProperty(Object.keys(extract)[i])){
                                continue
                            }
                            localStorage.setItem(Object.keys(extract)[i], extract[Object.keys(extract)[i]])

                        }
                        // console.log('local storage',localStorage.valueOf())
                        for(let i  = 0; i<nodes.length;i++){
                            nodes[i].snippet = localStorage.getItem(nodes[i].properties.name)
                        }





                    });



                }




                d3.select("#graph").html('');


                let force = d3.layout.force()//layout将json格式转化为力学图可用的格式
                    .nodes(nodes)//设定节点数组
                    .links(links)//设定连线数组

                    .linkDistance(700)//连接线长度
                    .charge(-1500)//顶点的电荷数。该参数决定是排斥还是吸引，数值越小越互相排斥
                    .on("tick", function (){
                            tick()
                        },
                    )//指时间间隔，隔一段时间刷新一次画面

                    .start();//开始转换

                //此处不能换位置，因为需要先读取info信息
                if(this.info !== []) {
                    let noWeight_node = [];
                    for (let i = 0; i < this.info.nodes.length; i++) {
                        if (this.info.nodes[i].weight === 0) {

                            noWeight_node.push(this.info.nodes[i].properties.name)
                        }
                    }
                    console.log('noweight node', noWeight_node);
                    console.log(noWeight_node.length === 0);
                    console.log(this.has_weight);

                    this.has_weight = noWeight_node.length === 0;
                }




                let zoom = d3.behavior.zoom()
                    .scaleExtent([.4, 2])
                    .on("zoom", zoomed)
                ;


                // let svg_drag = d3.behavior.drag()
                //     .on('dragstart',null)
                //     .on('drag',null)
                //     .on('dragend',()=>{console.log('end')})



                let svg = d3.select("#graph").append("svg")

                    .attr("pointer-event", "all")
                    .attr("preserveAspectRatio", "xMidYMid meet")//自适应容器大小
                    // .attr('width', 921)
                    // .attr('height', 899)
                    .attr("viewBox", "-500 -200 3000 1500")
                    // .attr("viewBox", "0 0 1000 1000")
                    .call(zoom)


                    // .call(svg_drag)
                    .on('touchmove',null)

                    // .on('mousemove',function(evt){
                    //     let loc = cursorPoint(evt);
                    //     console.log('svm mouse',loc.x, loc.y);
                    //
                    // })


                    .on("dblclick", (node, i)=>{
                        console.log('svg node',node,i,d3.select(d3.event.target).datum())
                        console.log('d3 event', d3.event);

                        if (d3.event.defaultPrevented) return;
                        clearTimeout(this.clickTimeId);

                        if(this.readOnly === true || this.disable_dbclick === true){

                            console.log('read mode only')
                        }

                        else {
                            if(d3.select(d3.event.target).datum() === undefined)
                                this.dialogFormVisible = true;
                        }




                    });
                let svg_select = document.querySelector('svg');
                let pt = svg_select.createSVGPoint();

                function cursorPoint(evt){
                    pt.x = evt.clientX; pt.y = evt.clientY;
                    // console.log('svm mouse',pt.x, pt.y);
                    return pt.matrixTransform(svg_select.getScreenCTM().inverse());
                }

                svg_select.addEventListener('mousemove',function(evt){
                    let loc = cursorPoint(evt);
                    console.log('svm mouse',loc.x, loc.y);
                    // Use loc.x and loc.y here
                },false);

                // d3.selectAll('rect').on('mousedown.drag',null);

                let circle_g = svg.selectAll("circle")
                    .data(force.nodes())//表示使用force.nodes数据
                    .enter()
                    .append("g")
                    .attr("class",function(node,i){
                        return "g_circle_" + i; })//标记circle的父节点
                    .style("cursor","pointer")
                    .call(drag(this)) //将当前选中的元素传到drag函数中，使顶点可以被拖动

                    .on("click", (node, i,) => {
                        if (d3.event.defaultPrevented) return;

                        this.dragNode = node;
                        console.log('dragNode',node);
                        clearTimeout(this.clickTimeId);

                        this.clickTimeId = setTimeout( ()=> {
                                if(this.readOnly === true){
                                    // this.$message(
                                    //     {
                                    //         type: 'Warning',
                                    //         message: 'Read Only Mode'
                                    //     });
                                    console.log('read only mode')
                                }
                                else {


                                    // this.temp.push(node.index);
                                    // console.log('liuliu', this.temp);
                                    // if (this.temp.length === 2 && this.temp[0] !== this.temp[1]) {
                                    //     this.dialogFormVisible_link = true;
                                    //
                                    // }
                                    // else if (this.temp.length === 2 && this.temp[0] === this.temp[1]) {
                                    //     this.temp.length = 0
                                    // }
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
                        this.detailname = node.properties.name;
                        d3.select('.g_circle_'+ node.index).select('circle')
                            .attr('r',50)

                        d3.select('.g_circle_'+ node.index).select('tspan')
                            .attr('font-size',25)

                        // showNodeInfo(node, this);
                        // showCircleBorderOuterArc(node, i);
                    })
                    .on('mouseout',(node)=>{
                        // this.showdetail_node = false;
                        d3.select('.g_circle_'+ node.index).select('circle')
                            .attr('r',40);

                        d3.select('.g_circle_'+ node.index).select('tspan')
                            .attr('font-size',15)



                    })
                    // .on('dblclick',()=>{
                    //     if (d3.event.defaultPrevented) return;
                    //     console.log('dblclick')
                    //
                    // })
                    .on("dblclick", (node )=>{


                        if (d3.event.defaultPrevented) return;
                        clearTimeout(this.clickTimeId);
                        if(this.readOnly === true){

                            if(node.if_expanded === true){
                                node.if_expanded = false;
                                this.collapseConcept(node);

                            }
                            else {
                                node.if_expanded = true;
                                this.expandConcept(node.properties.name);
                            }



                        }
                        else {
                            this.dialogFormVisible = true;
                        }
                    })
                    .on('contextmenu',(d,node)=>{
                        if (d3.event.defaultPrevented) return;
                        if(this.readOnly === true){
                            // this.$message(
                            //     {
                            //         type: 'Warning',
                            //         message: 'Read Only Mode'
                            //     });
                            console.log('read only mode')
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
                    .attr("r", 40)//设置圆圈半径
                    .style("fill", function (node) { return getCircleColor(node); })

                ;
                console.log('circle',circle)

                let text = circle_g.append("text")
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")//在圆圈中加上数据
                    .style('fill', "black")
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
                    .attr("stroke-width",7)//箭头宽度
                    .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                    .attr('fill', 'rgba(0,0,0, 0.7)');//箭头颜色

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
                    .attr("stroke-width",7)//箭头宽度
                    .attr("d", "M0,0L10,-5L10,5")//箭头的路径
                    .attr('fill', 'rgba(0,0,0, 0.7)');//箭头颜色




                const edges_line = svg.append("g").selectAll(".edgepath")
                    .data(force.links())
                    .enter()
                    .append("path")

                    .style("stroke", 'black')
                    .style("stroke-width", 2)//线条粗细
                    .style("fill-opacity",0)
                    .style("cursor","pointer")
                    .attr("id", function (d, i) { return 'edgepath' + i; })
                    .on("mouseover", function(d,i){
                        return getStrokeWidth(d,i);
                    })
                    .on("mouseout", function() {
                        edges_line.style("stroke-width", 3);
                        edges_text.selectAll('textPath').attr("font-size", 20);
                    })
                    // .on('click', (link) => { this.deleteLine(this.info,link); })
                    .on('contextmenu',(d,link)=>{
                        if (d3.event.defaultPrevented) return;
                        if(this.readOnly === true){
                            // this.$message(
                            //     {
                            //         type: 'Warning',
                            //         message: 'Read Only Mode'
                            //     });
                            console.log('read only mode')
                        }else {
                            Menu(this.menu_edge)(d, d3.event, link)
                        }

                    });

                const edges_text = svg.append("g").selectAll(".edgetext")
                    .data(links)
                    .enter()
                    .append("text")
                    // .style("pointer-events", "none")
                    .attr("class","linetext")
                    .attr('text-anchor', "middle")
                    .attr("fill-opacity", 0.8)
                    .style("cursor","pointer")

                    .attr({'class': 'edgelabel',
                        'id': function (d, i) { return 'edgepath' + i; },
                        'dx': 250,
                        'dy': -1,
                        'fill':'black',


                    })

                // .attr("x",250)
                // .attr('y',25)
                // .attr('text-anchor',"middle")







                function edge_text_Position(){

                    return 'rotate(180,40,5)'
                }



                let that = this;
                //设置线条上的文字
                edges_text.append('textPath')
                    .attr('xlink:href', function (d, i) { return '#edgepath' + i })
                    // .attr("pointer-events", "none")
                    .attr("font-size", 20)

                    .text(function (d ) {
                        let circleText = '';
                        console.log('text relationship', d, that);
                        if(d.label && d.label.length > 50){
                            if(that.config.Citations === false) {
                                circleText =  d.label.substring(0, 50) + '...)';
                            }
                            else{
                                if(d.citation === undefined){
                                    circleText =  d.label.substring(0, 50) + '...)';
                                }else {
                                    circleText = d.label + ' (' + d.citation.substring(0, 50) + '...)';
                                }
                            }

                        }else{
                            if(that.config.Citations === false) {

                                circleText = d.label ;
                            }
                            else{
                                if(d.citation === undefined){
                                    circleText = d.label;
                                }else {
                                    circleText = d.label + ' (' + d.citation + ')';
                                }
                            }
                        }

                        return circleText;


                    })
                    .on('mouseover',(d,i)=>{
                        getStrokeWidth(d,i)
                    })
                    .on('mouseout',(d,i)=>{
                        d3.select('text#edgepath'+i).select('textPath').attr("font-size", 20)
                        edges_line.style("stroke-width", 3);
                    })
                    .on('contextmenu',(d,link)=>{
                        console.log('huahua',d,link);
                        if (d3.event.defaultPrevented) return;
                        if(this.readOnly === true){

                            // this.$message(
                            //     {
                            //         type: 'Warning',
                            //         message: 'Read Only Mode'
                            //     });
                            console.log('read only mode')

                        }
                        else {
                            Menu(this.menu_edge)(d, d3.event, link)
                        }

                    });


                function zoomed() {//svg下的g标签移动大小
                    // svg.selectAll("g").attr("transform", "scale(" +d3.event.scale + ")");
                    svg.attr("transform", "scale(" +d3.event.scale + ")");

                }
                console.log('edge line',edges_line);

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



                function getStrokeWidth(d,i) {


                    d3.select('path#edgepath'+i).style("stroke-width", function (edge) {

                        return 6
                    });
                    d3.select('text#edgepath'+i).select('textPath').attr("font-size", 25)
                }

                function getTextPosition(d){
                    const sx = d.source.x;
                    const sy = d.source.y;
                    const tx = d.target.x;
                    const ty = d.target.y;

                    const distance = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));

                    return distance / 2
                }

                function drag(_this){//拖拽函数
                    const mouse_line = svg.append("path")
                        .attr('id','mouse_link')
                        .style("stroke", 'black')
                        .style("stroke-width", 2)//线条粗细
                        .style("fill-opacity",0)
                        .attr('marker-end', 'url(#end)');

                    return force.drag().on("dragstart",function(d){

                        // console.log('start node',d);


                        if(_this.ifClicked===true ) {

                            _this.dragStartIndex = d;
                            _this.mouseLinkLineStartLoc = [d.x, d.y];

                            force.stop();
                            _this.original_dx =  d.px
                            _this.original_dy = d.py;
                            console.log('start position',_this.original_dx, _this.original_dy)

                        }

                        d3.event.sourceEvent.stopPropagation(); //取消默认事件
                        d.fixed = true;//拖拽开始后设定被拖拽对象为固定

                    })

                        .on('drag', (d) =>{



                            edges_text
                                .attr("dx",  d=> {

                                    return getTextPosition(d)
                                })
                                .attr("dy",  function(d) {
                                    return -5;
                                });


                            if (_this.ifClicked === true && _this.dragNode === d) {
                                force.stop();

                                mouse_line.style('opacity', '1');
                                mouse_line.attr('d', function () {



                                    if (d3.select(d3.event.sourceEvent.srcElement).datum() === undefined) {

                                        d3.select('.g_circle_' + _this.target_node_index).select('circle')
                                            .style('fill', function (node) {
                                                return getCircleColor(node);
                                            });

                                        return ('M' + d.x + ' '
                                            + d.y + "L" + +d3.mouse(d3.event.sourceEvent.srcElement)[0]
                                            + ' ' + d3.mouse(d3.event.sourceEvent.srcElement)[1]);//绘制直线
                                    }
                                    else {

                                        // d3.select('.g_circle_'+ d3.select(d3.event.sourceEvent.srcElement).datum().index)
                                        //     .select('circle').style('fill','red');



                                        return ('M' + _this.mouseLinkLineStartLoc[0] + ' ' + _this.mouseLinkLineStartLoc[1] +
                                            "L" + +d3.select(d3.event.sourceEvent.srcElement).datum().x
                                            + ' ' + d3.select(d3.event.sourceEvent.srcElement).datum().y)

                                    }



                                });

                                if (d3.select(d3.event.sourceEvent.srcElement).datum() !== undefined
                                    && d.index !== d3.select(d3.event.sourceEvent.srcElement).datum().index)
                                {
                                    _this.target_node_index = d3.select(d3.event.sourceEvent.srcElement).datum().index;
                                }


                            }


                        })


                        .on('dragend',(d)=>{
                            // console.log('mouse',((d3.event.sourceEvent.target)))
                            if(_this.ifClicked===true) {
                                // console.log('drag end', _this.original_dx, _this.original_dy)
                                d.px = _this.original_dx;
                                d.py = _this.original_dy;
                                // console.log(d3.mouse(d3.event.sourceEvent.target));
                                // console.log(d3.event)
                                // console.log(d3.event.sourceEvent.target);
                                let data = d3.select(d3.event.sourceEvent.srcElement).datum()
                                // console.log('data',d3.event.sourceEvent.srcElement)
                                // console.log('datum',data);




                                _this.end  = data;
                                _this.start = d;



                                if(data!==undefined && _this.end.type!=='link') {
                                    // console.log('clicked',_this.ifClicked);
                                    if(_this.start.index === _this.end.index)
                                    {
                                        // d3.select('.g_circle_'+ d.index).select('circle')
                                        //     .style('fill', function (node) { return getCircleColor(node);});
                                        mouse_line.style('opacity', '0');
                                        // _this.ifClicked = false;
                                    }
                                    else {
                                        // console.log('start', _this.start.properties.name, _this.start.type);
                                        // console.log('end', _this.end.properties.name, _this.end.type);







                                        if(_this.config.Citations === true){

                                            _this.dialogFormVisible_link = true;

                                        }else{
                                            _this.dialogFormVisible_relationship = true;
                                        }


                                        mouse_line.style('opacity', '0');

                                        d3.select('.g_circle_' + d.index).select('circle')
                                            .style('fill', function (node) {
                                                return getCircleColor(node);
                                            });

                                        _this.ifClicked = false;
                                    }


                                }
                                else{
                                    d3.select('.g_circle_'+ d.index).select('circle')
                                        .style('fill', function (node) { return getCircleColor(node);});

                                    _this.ifClicked = false;
                                    mouse_line.style('opacity', '0');
                                }


                                force.resume();
                            }


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
                    if(circleText && circleText.length > 20){
                        circleText = circleText.substring(0,20) + '...'+ circleText.substring(20,circleText.length);

                        d3.select(_this).text(function(){return '';});
                    }
                    d3.select(_this).append('tspan').attr('x',0).attr('y',0).attr("font-size", 15)
                        .text(function(){ return circleText; });
                }



                function tick() {

                    circle.attr("transform", transform1);//圆圈
                    text.attr("transform", transform2);//顶点文字
                    edges_line
                        .attr('d', function (d) {

                            return getNodesLine(d);//曲线路径

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

                    });



                }

                //设置圆圈和文字的坐标
                function transform1(d) {

                    // console.log(d)
                    if(isNaN(d.x) && isNaN(d.y))
                    {
                        d.x = 360;
                        d.y = 266;
                    }
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
                    if(isNaN(d.x) && isNaN(d.y))
                    {
                        d.x = 360;
                        d.y = 266;
                    }
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
            doubleClick(info,nodes, input,snippet){

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
                        'label': 'Concept',
                        'snippet':snippet,
                        'if_expanded':false
                    };

                    this.info.nodes.push(new_node);

                    let node_to_string = this.info.nodes.map(function (element) {
                        return {'id':element.id, 'type':element.type, 'properties':{'name':element.properties.name},
                            'label':element.label, 'snippet':element.snippet, 'if_expanded':element.if_expanded,
                            'x': element.x, 'y':element.y
                        };
                    });


                    let link_to_string = this.info.links.map(function (element) {
                        return {
                            "source": element.source.id,
                            "target": element.target.id,
                            "id": element.id,
                            "type": element.type,
                            "properties": {},
                            "label": element.label,
                            'x_end':element.x_end,
                            'x_start':element.x_start,
                            'y_end':element.y_end,
                            'y_start':element.y_start,

                        }

                    });

                    console.log('stringfy node', node_to_string);
                    console.log('stringfy links', link_to_string);

                    let new_info = [];
                    new_info.nodes = node_to_string;
                    new_info.links = link_to_string;

                    this.renderGraph(new_info);

                    // this.renderGraph(this.info);
                    return true
                }

                else{
                    this.$message({
                        'type': 'warning',
                        'message': 'There is already a concept with that name!'
                    })
                    // alert('There is already a concept with that name!')
                    return false
                }


            },

            singleClick(info, node,input){
                // let temp = [];

                // let source = node.id;

                let link_name_set = [];
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
                        console.log('new link added', info);
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
                        "source": String(element.source.id), "target": String(element.target.id),
                        "citation": element.citation,
                        "x_start":String(element.x_start),
                        "x_end":String(element.x_end),
                        "y_start":String(element.y_start),
                        "y_end" : String(element.y_end)
                    }
                });
                //
                console.log(this.current_user);
                console.log('nn', JSON.stringify(this.upload_nodes));
                console.log('nn', JSON.stringify(this.upload_links));

                let flag = true;
                let noWeight_node = [];
                console.log('testtest',this.info);
                for (let i = 0; i < this.info.nodes.length; i++) {
                    if (this.info.nodes[i].weight === 0) {
                        flag = false;
                        noWeight_node.push(this.info.nodes[i].properties.name)
                    }
                }

                if (this.has_weight === false) {
                    this.$message({
                        'type': 'warning',
                        'message': 'The concept [ ' + noWeight_node.toString()+' ] needs a least one relationship, please check it.'
                    })
                    return false;
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
                            links: this.upload_links

                        }


                    }).then(response => {
                        console.log('pp', JSON.stringify(this.upload_nodes));
                        console.log('pp', JSON.stringify(this.upload_links));
                        console.log('success', response)
                        this.$message({
                            'type':'success',
                            'message':'Saved Successfully!'
                        });
                        // this.renderGraph(this.info)
                        return true
                    })
                        .catch(error=>{
                        console.log('error',error);
                        this.$message({
                            'type':'warning',
                            'message':'The database server is busy, please try again!'
                        });
                        return false

                    });

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

