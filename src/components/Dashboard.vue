<template>

    <div class="block" v-title data-title="Dashboard">
        <el-header style="text-align: right;height:40px;">





            <div class="grid-content " >
               <h3 style="margin-right: 750px;" >SustainKG</h3>
            </div>

        </el-header>
            <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%"
                    :default-sort = "{prop: 'date', order: 'descending'}"

            >

                <!--<el-table-column-->
                        <!--type="selection"-->
                        <!--width="55">-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="Id"
                        label="Id"

                        width="100">
                </el-table-column>
                <el-table-column
                        prop="User"
                        label="User"
                        sortable
                        width="700">
                </el-table-column>
                <el-table-column
                        prop="Nodes"
                        label="Nodes"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="Links"

                        sortable
                        label="Links">
                </el-table-column>


            </el-table>
        <div><h2></h2></div>
        <el-pagination class="fy"
                @current-change="handleCurrentChange"
                layout="total"
                :total="total"
               >
        </el-pagination>
    </div>
</template>
<script>
    export default {



        mounted(){
            if(this.username ==='qingys1' || this.username ==='wmt4') {
                this.getData();
            }
            else{
                console.log('no authority')
            }

        },
        data() {
            return {
                username:this.$route.params.username,
                password:this.$route.params.password,

                total:0,//默认数据总数
                pagesize:10,//每页的数据条数
                currentPage:1,//默认开始页面
                tableData: [

                ],

            };
        },
        methods: {

            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
            },



            getData(){
                this.$axios({
                    url:'/getGraphStatistics',
                    method:'get'
                }).then(response=>{
                    this.tableData = response.data.map(function (element,i) {
                        return {Id:i,User:element.name, Nodes:element.nodes, Links:element.links}
                    });
                    this.total=this.tableData.length;
                    console.log(response.data)
                })
            }
        },
    }
</script>
<style>
    .fy{
    text-align:center;
    margin-top:30px;
}</style>