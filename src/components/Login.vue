

<template>
    <div v-title data-title="Login">


        <el-dialog
                :close-on-click-modal="false"
                title="Login"
                :visible.sync="centerDialogVisible"
                width="30%"
                center>
            <span>Username<el-input v-model="username" placeholder="Please Input Username" @keyup.native.enter='login'></el-input></span>
            <br><br>
            <!--<span>Password<el-input type="password" v-model="password" placeholder="Please Input Password" @keyup.native.enter='login'></el-input></span>-->
            <el-button type="text" style="margin-top: 15px;" @click.native="dialog_createUser=true; centerDialogVisible=false">No account?</el-button>
            <span slot="footer" class="dialog-footer">
            <!--<el-button @click.native="centerDialogVisible=false">No</el-button>-->
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
            <br><br>
            <!--<span>Password<el-input type="password" v-model="newPassword" onkeyup="value=value.replace(/[^A-Za-z0-9_]/g,'');" placeholder="Please Input Password"></el-input></span>-->
            <span slot="footer" class="dialog-footer">
            <el-button @click.native="dialog_createUser=false; centerDialogVisible=true">No</el-button>
            <el-button type="primary" @click="createUser" >Yes</el-button>
          </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {

        name: 'App',
        data() {

            return {
                centerDialogVisible:true,
                dialog_createUser:false,
                username:'',
                // password:'',
                newUsername:'',
                // newPassword:'',

            }
        },


        methods: {

            login() {

                if ( this.username === '') {
                    this.$message(
                        {
                            type: 'warning',
                            message: 'The username cannot be empty'
                        });
                }else {

                    this.$axios({
                        url: '/getUserGraph',
                        method: 'post',
                        data: {
                            user: this.username,
                            // password: this.password

                        }

                    }).then(response => {
                        if (response.status === 204) {
                            this.$message(
                                {
                                    type: 'warning',
                                    message: 'Wrong username !'
                                });

                            this.centerDialogVisible = true;
                        }

                        else {
                            this.$router.push({
                                name: 'home',
                                params: {username: this.username}
                            })
                        }
                    })
                }

            },

            createUser: function () {

                this.dialog_createUser = false;
                console.log('create user function', this.newUsername);
                if ( this.newUsername === '') {
                    this.$message(
                        {
                            type: 'warning',
                            message: 'The username cannot be empty'
                        });
                    this.dialog_createUser = true
                }
                else {

                    this.$axios({
                        url: '/createNewUser',
                        method: 'post',
                        data:
                            {
                                "user": this.newUsername,
                                // "password": this.newPassword
                            }
                    }).then(response => {
                        this.username = this.newUsername;
                        // this.password = this.newPassword;
                        // this.newPassword = '';
                        this.newUsername = '';
                        console.log(response);
                        if (response.status === 204) {

                            this.$message(
                                {
                                    type: 'warning',
                                    message: 'The username already exists!'
                                });
                            this.showLogin = true;
                            this.dialog_createUser = true;
                            this.username = '';
                            // this.password = '';
                        }

                        else {


                            this.$axios({
                                url: '/getUserGraph',
                                method: 'post',
                                data: {
                                    user: this.username,
                                    // password: this.password

                                }

                            }).then(response => {
                                // if (response.status === 204){
                                //     alert('Wrong username or password !')
                                //     this.centerDialogVisible=true;
                                // }

                                // else {
                                this.$router.push({
                                    name: 'home',
                                    params: {username: this.username}
                                })
                                // }
                            })
                        }
                    })
                }

                },



        }
    }


</script>