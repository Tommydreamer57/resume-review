<template>
  <div id="app">
    <Details />
    <div id="content">
      <img src="./assets/logo.png">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Details from "@/components/reusable/Details";
export default {
  name: "App",
  components: {
    Details
  }
};
</script>

<style>
@import 'reset.css';
@import 'theme.css';
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  color: #2c3e50;
}
#content {
  width: 70vw;
  padding-top: 60px;
  border: 1px solid black;
}
#Details {
  width: 30vw;
  border: 1px solid black;
}
</style>
