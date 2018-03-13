<template>
    <div id="Organisation">
        <h1>{{ name }}</h1>
        <h2 v-for="member in members" :key="member.name + member.id" @click="increment(member.id)" >{{member.name}}, {{member.id}}</h2>
    </div>
</template>

<script>
export default {
  name: "Organisation",
  data() {
    return {
      name: "DEFAULT ORGANISATION",
      members: [
          {
              id: 0,
              name: "tommy"
          },
          {
              id: 1,
              name: "michael"
          }
      ]
    };
  },
  computed: {
      increment(id) {
          this.members = this.members.map(member => {
              if (member.id === id) member.id++
              return member
          })
      }
  }
};
</script>

<style>

</style>
