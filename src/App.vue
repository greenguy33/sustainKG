

<template>
    <div>

        <router-view/>


    </div>
</template>

<script>
    export default {

        name: 'App',
        data() {

           return {


           }
        },

        mounted(){
            // this.jump();
        },

        methods:{

            jump(){
                this.$router.push({name:'login'})
            }
        }
    }


</script>