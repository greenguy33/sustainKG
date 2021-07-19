<template>

  <div id="app">
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

          <el-dialog :visible.sync="dialogFormVisible">
              Node Name
              <el-select
                      label-position="right"
                      label-width="86px"
                      style="width: 350px; margin-left:50px;"

                      v-model="value"
                      placeholder="请选择"
                      clearable
                      filterable
                      @blur="selectBlur"
                      @clear="selectClear"
                      @change="selectChange"
              ><el-option
                      v-for="(item,index) in options"
                      :key="index"
                      :label="item.label"
                      :value="item.value" ></el-option>
              </el-select>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="cancel">
                      No
                  </el-button>
                  <el-button type="primary" @click="addNodes">
                      Yes
                  </el-button>
              </div>
          </el-dialog>


          <el-dialog :visible.sync="dialogFormVisible_change_node_name">
              Node Name
              <el-select
                      label-position="right"
                      label-width="86px"
                      style="width: 350px; margin-left:50px;"

                      v-model="value"
                      placeholder="请选择"
                      clearable
                      filterable
                      @blur="selectBlur"
                      @clear="selectClear"
                      @change="selectChange"
              ><el-option
                      v-for="(item,index) in options"
                      :key="index"
                      :label="item.label"
                      :value="item.value" ></el-option>
              </el-select>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="cancel">
                      No
                  </el-button>
                  <el-button type="primary" @click="change_node_name">
                      Yes
                  </el-button>
              </div>
          </el-dialog>



          <el-dialog :visible.sync="dialogFormVisible_link">
              Link Name

              <el-autocomplete class="inline-input" v-model="state2"
                               placeholder="请输入内容" :fetch-suggestions="querySearch"
                               :trigger-on-focus="false"
                               label-position="right"
                               label-width="86px"
                               style="width: 350px; margin-left:50px;"
              ></el-autocomplete>

              <div slot="footer" class="dialog-footer">
                  <el-button @click="cancel">
                      No
                  </el-button>
                  <el-button type="primary" @click="addLinks">
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
    import install from './plugins/d3-context-menu'
    install(d3); // 为d3注册右键菜单插件
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
            value: '',
            options: [
                {
                    value: 'node1',
                    label: 'node1'
                }, {
                    value: 'node2',
                    label: 'node2'
                }
            ],

            keywords: ' ',
            info: info,
            ifClicked:false,
            nodeMenuFlag:false,
            ifDelete:false,
            state1:'',
            state2:'',
            selected_Node: '',
            node_list : [{'value':'node1'},
                         {'value':'node2'}],

            link_list : [{'value':'link1'},
                {'value':'link2'}],

            dialogFormVisible:false,
            dialogFormVisible_link:false,
            dialogFormVisible_change_node_name:false,
            temp : [],
            clickTimeId : 0,
            addlink: false,
            node_id: '',




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
                            console.log('test !!!',select_node)
                            info.nodes.splice(select_node.index,1);
                            //bug 这里的node是index不是object
                            for(let i =info.links.length-1; i>=0; i-- )
                            {
                                console.log('link index',i,node);
                                if(info.links[i].source === select_node
                                    || info.links[i].target === select_node)
                                {
                                    info.links.splice(i,1);
                                }

                            }

                            console.log('after delete', info)
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
                        // this.$prompt(
                        //     'Please Input Node New Name：',
                        //     'Tips',
                        //     {
                        //         confirmButtonText: 'Yes',
                        //         cancelButtonText: 'No',
                        //         inputValue: 'New Node Name',
                        //         inputErrorMessage: 'Input cannot be none',
                        //         inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
                        //             if(!value) {
                        //                 return 'Input cannot be none';
                        //             }
                        //         },
                        //
                        //     }).then(({value}) => {
                        //         console.log(this.info.nodes[node_id]);
                        //         console.log(this.info.nodes[node_id].properties.name);
                        //         this.info.nodes[node_id].properties.name = value;
                        //         this.renderGraph(info);
                        //
                        // }).catch((err) => {
                        //     console.log(err);
                        // });


                    },

                },

            ],

            menu_edge:[
                {
                    title: 'Delete Links',
                    action: (link,selected_link) => {

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
                            info.links.splice(selected_link.index,1);
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


                        this.$prompt(
                            'Please Input Link New Name：',
                            'Tips',
                            {
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'No',
                                inputValue: 'New Link Name',
                                inputErrorMessage: 'Input cannot be none',
                                inputValidator: (value) => {       // 点击按钮时，对文本框里面的值进行验证
                                    if(!value) {
                                        return 'Input cannot be none';
                                    }
                                },

                            }).then(({value}) => {
                                console.log('link id',link_id);
                                console.log('lala',(this.info.links[link_id].label));

                                this.info.links[link_id].label = value;

                                this.renderGraph(info);

                        }).catch((err) => {
                            console.log(err);
                        });
                    }

                }
            ],



        }
    },

    mounted() {

        this.renderGraph(this.info);

    },







    methods: {


        selectBlur(e) {
            // 意见类型
            if (e.target.value !== '') {
                // let index = this.options.indexOf('value');
                // console.log('index',index);
                // this.value = e.target.value + '(其他)';
                console.log('No selection');
                this.$forceUpdate()   // 强制更新
            }
        },
        selectClear() {
            this.value = '';
            this.$forceUpdate()
        },
        selectChange(val) {
            this.value = val;
            this.$forceUpdate()
        },


        cancel()
        {
            this.dialogFormVisible = false;
            this.dialogFormVisible_link = false;
            this.dialogFormVisible_change_node_name = false;
            this.temp.length = 0;
        },

        addNodes(){
            this.dialogFormVisible = false;
            console.log('state1',this.value);
            console.log('info', this.info);
            this.doubleClick(this.info, this.info.nodes, this.value)

        },

        change_node_name(){

            console.log(this.info.nodes[this.node_id]);
            console.log(this.info.nodes[this.node_id].properties.name);
            this.info.nodes[this.node_id].properties.name = this.value;
            this.dialogFormVisible_change_node_name = false;
            this.renderGraph(this.info);
        },

        addLinks()
        {
            console.log('state2',this.state2);
            this.dialogFormVisible_link = false;

            if (this.temp.length === 2) {
                this.singleClick(this.info, this.selected_Node, this.state2);
            }

            this.$message(

                    {
                    type: 'success',
                    message: 'Add Links!'
                });

        },

        querySearch(queryString, cb){
            let node_list = this.node_list;
            let link_list = this.link_list;
            if (this.dialogFormVisible === true) {
                let results = queryString ? node_list.filter(this.createFilter(queryString)) : node_list;
                cb(results)
            }
            else if (this.dialogFormVisible_link === true)
            {
                let results = queryString ? link_list.filter(this.createFilter(queryString)) : link_list;
                cb(results)
            }

        },

        createFilter(queryString)
        {
            return (node_list) => {
                return (node_list.value.toLowerCase().indexOf(queryString.toLowerCase())===0)
            }
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
                .attr("r", 35)//设置圆圈半径
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
            const edges_line = svg.append("g").selectAll(".edgepath")
                .data(force.links())
                .enter()
                .append("path")
                .attr("marker-end",  function (d, i) { return getMarkerArrow(i); })//根据箭头标记的id号标记箭头
                .style("stroke", '#9aaabf')
                .style("stroke-width", 4)//线条粗细
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
                .attr("fill-opacity", 1)
                .style("cursor","pointer")
                .attr({'class': 'edgelabel', 'id': function (d, i) { return 'edgepath' + i; }, 'dx': 150, 'dy': 20, 'fill':'#9aaabf'});

            //设置线条上的文字
            edges_text.append('textPath')
                .attr('xlink:href', function (d, i) { return '#edgepath' + i })
                .attr("pointer-events", "none").attr("font-size", 15)
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
                    .attr("markerWidth", 10)//标识的大小
                    .attr("markerHeight", 10)
                    .attr("viewBox", "0 -4 12 15")//坐标系的区域
                    .attr("refX", 0)//箭头坐标
                    .attr("refY", 0)
                    .attr("orient", 'auto')//绘制方向，可设定为：auto（自动确认方向）和 角度值
                    .append("svg:path")
                    .attr("stroke-width",1)//箭头宽度
                    .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                    .attr('fill', 'rgba(0,0,0, 0.4)');//箭头颜色
                return "url(#arrow" + i + ")";
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
                if(circleText && circleText.length > 8){
                    circleText = circleText.substring(0,8) + "...";
                    d3.select(_this).text(function(){return '';});
                }
                d3.select(_this).append('tspan').attr('x',0).attr('y',0).attr("font-size", 18)
                    .text(function(){ return circleText; });
            }




            function tick() {

                circle.attr("transform", transform1);//圆圈
                text.attr("transform", transform2);//顶点文字
                edges_line.attr('d', function (d) {
                    //绘制自己指向自己的路径
                    // if(d.relation.isSelf) { return getNodeSelfPath(d) }
                    //绘制两个节点之间的路径
                    return getNodesLine(d);//曲线路径
                });

                // if(circleBorderOuterArcObj !== null) {
                //   circleBorderOuterArcObj.attr("transform", function (d){ return "translate("+d.x+","+d.y+")" });
                // }

                //绘制节点删除功能半圆环
                if(removePath !== null) {
                    removePath.attr("transform", function (d){ return "translate("+d.x+","+d.y+")" });

                    let r1 = null;
                    remove_rect1.attr('d',function(d) { r1 = d; })
                        .attr("x",r1.x + 33 + 6.75).attr("y",r1.y  - 36 + 9.75).attr("width",5).attr("height",3).attr("rx",1.5).attr("ry",1.5);

                    let r2 = null;
                    remove_rect2.attr('d',function(d) { r2 = d; })
                        .attr("x",r2.x + 30 + 6.75).attr("y",r2.y  - 33 + 9.75).attr("width",12).attr("height",14).attr("rx",1.5).attr("ry",1.5);

                    let l1 = null;
                    remove_line1.attr('d',function(d) { l1 = d; })
                        .attr("x1",l1.x + 28 + 6.75).attr("y1",l1.y - 33 + 9.75).attr("x2",l1.x + 45 + 6.75).attr("y2",l1.y - 33 + 9.75);

                    let l2 = null;
                    remove_line2.attr('d',function(d) { l2 = d; })
                        .attr("x1",l2.x + 34 + 6.75).attr("y1",l2.y - 30 + 9.75).attr("x2",l2.x + 34 + 6.75).attr("y2",l2.y - 23 + 9.75);

                    let l3 = null;
                    remove_line3.attr('d',function(d) { l3 = d; })
                        .attr("x1",l3.x + 38 + 6.75).attr("y1",l3.y - 30 + 9.75).attr("x2",l3.x + 38 + 6.75).attr("y2",l3.y - 23 + 9.75);
                }

                //绘制解除节点位置锁定半圆环
                if(unlockPath !== null) {
                    unlockPath.attr("transform", function (d){ return "translate("+d.x+","+d.y+")" });
                    unlock_path1.attr("transform", function (d){ return "translate("+ (d.x - 45) +","+ (d.y - 23) +")" });

                    let r1 = null;
                    unlock_rect1.attr('d',function(d) { r1 = d; })
                        .attr("x",r1.x  - 52 + 6.75).attr("y",r1.y - 30 + 9.75).attr("width",15).attr("height",12).attr("rx",1.5).attr("ry",1.5);

                    let l1 = null;
                    unlock_line1.attr('d',function(d) { l1 = d; })
                        .attr("x1",l1.x  - 52 + 15).attr("y1",l1.y  - 30 + 15).attr("x2",l1.x  - 52 +15).attr("y2",l1.y  - 30 + 18);
                }

                //绘制隐藏节点和关系半圆环
                if(hidePath !== null) {
                    hidePath.attr("transform", function (d){ return "translate("+d.x+","+d.y+")" });

                    hide_path1
                        .attr("d", function(d) {
                            return "M" + (d.x - 13) + "," + (d.y + 42) + "A15,15,0,0,1" + (d.x + 13) + "," + (d.y + 42)
                        });
                    hide_path2
                        .attr("d", function(d) {
                            return "M"+ (d.x - 12 + 10.4) + "," + (d.y + 34 + 10.937) + "A" + 3.749 + "," + 3.749 + ",0,1,1," + (d.x - 12 + 15.338) + "," + (d.y + 33 + 9)
                        });
                    hide_path3
                        .attr("d", function(d) {
                            return "M" + (d.x - 12) + "," + (d.y + 42) + "A20,20,0,0,0" + (d.x - 4) + "," + (d.y + 47)
                        });
                    hide_path4
                        .attr("d", function(d) {
                            return "M" + (d.x + 11) + "," + (d.y + 44) + "A20,20,0,0,0" + (d.x + 13) + "," + (d.y + 42)
                        });

                    let c1 = null;
                    hide_circle1.attr('d',function(d) { c1 = d; })
                        .attr("cx",c1.x - 12 + 17.15).attr("cy",c1.y + 33 + 17.25).attr("r",6);

                    let l1 = null;
                    hide_line1.attr('d',function(d) { l1 = d; })
                        .attr("x1",l1.x - 12 + 14.15).attr("y1",l1.y + 33 + 17.25).attr("x2",l1.x - 12 + 20.15).attr("y2",l1.y + 33 + 17.25);

                }

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

