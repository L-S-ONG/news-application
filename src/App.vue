<template>
  <div id="app">
    <v-app id="news">
      <v-app-bar app color="blue" flat>
        <v-container class="py-0 fill-height">
          <span class="text-h5 white--text">{{ links }}</span>
        </v-container>
      </v-app-bar>
      <router-view />
    </v-app>
  </div>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
    links: 'News',
  }),
};
</script>
