<template v-if="loading">
    <v-row>
        <v-col v-for="(n, i) in 8" :key="i" cols="3">
            <v-skeleton-loader elevation="2" type="card" />
        </v-col>
    </v-row>
</template>

<script>
export default {
  name: "Skeleton",
}
</script>