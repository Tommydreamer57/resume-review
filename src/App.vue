<template>
  <div id="app">
    <Details />
    <div id="content">
      <img src="./assets/logo.png">
      <router-view/>
      <a href="http://localhost:8070/auth"><h1>LOGIN</h1></a>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Details from "@/components/reusable/Details";
export default {
  name: "App",
  components: {
    Details
  }
};
axios.get("http://localhost:8070/auth/me").then(res => {
  console.log(res.data);
});
</script>

<style>
@import "reset.css";
@import "theme.css";
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
