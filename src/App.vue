<template>
    <div id="app">
        <div class="content">
            <wall></wall>
        </div>
    </div>
</template>

<script>
    import Wall from "./components/Wall";
    export default {
        name: 'app',
        components: {Wall},
    }
</script>

<style lang="scss">
    #app {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;

        .content {
            flex: 1;
            overflow: auto;
            height: 100%;
        }
    }
</style>
