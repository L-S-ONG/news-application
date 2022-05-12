<template>
  <v-main class="grey lighten-3 pl-16 pr-16">
    <v-container fluid grid-list-md>
      <v-responsive class="flex pt-10 mb-2">
        <v-row>
          <v-col cols="8" sm="8">
            <div class="text-h4 font-weight-medium d-inline-block text-blue">Headlines</div>
          </v-col>
          <v-col cols="2" sm="2">
            <v-select
              v-model="selectedSources"
              :items="sourcesStates"
              label="Source(s)"
              multiple
              chips
              persistent-hint
              item-text="name"
              item-value="id"
              outlined
              dense
              @input="updateSource"
            ></v-select>
          </v-col>
          <v-col cols="2" sm="2">
            <v-text-field
              label="Search"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              outlined
              dense
              @input="updateSearch"
            ></v-text-field>
            <!-- <v-btn depressed color="error" @click="checkAPI"> Error </v-btn> -->
          </v-col>
        </v-row>
      </v-responsive>
      <div v-if="this.$store.getters['news/getLoading']">
        <skeleton-loader />
      </div>
      <v-layout row wrap justify="space-around">
        <!-- Cards -->
        <v-flex v-for="(article, index) in news" :key="index" v-bind="{ [`xs3`]: true }">
          <v-card>
            <v-img
              :src="article.urlToImage"
              height="200px"
              gradient="to top right, rgba(0, 0, 0,.15), rgba(25,38,48,.18)"
            >
              <v-app-bar             
                flat
                color="rgba(0, 0, 0, 0)"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="white"
                  icon
                  @click="redirectToNews(article.url)"
                >
                  <v-icon>mdi-arrow-right-thin-circle-outline</v-icon>
                </v-btn>
              </v-app-bar>
              
            </v-img>
            <v-card-title>
              <span class="caption">{{ article.publishedAt }}</span>
            </v-card-title>
            <v-card-title class="mt-n7">
              <span class="subtitle-1 line-height-20 font-weight-medium">{{ article.title }}</span>
            </v-card-title>
            <v-card-text>
              <p class="text--primary word-wrapper">
                <span v-html="article.description" />
              </p>
              <v-btn
                text
                color="primary accent-4"
                class="px-0"
                @click="showArticleDialog(article)"
              >
                Read More
              </v-btn>
            </v-card-text>
          </v-card>
        </v-flex>
        <!-- Detail Dialog -->
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <v-card>
           <v-img
              :src="selectedArticle.urlToImage"
              height="200px"
            >
              <v-app-bar             
                flat
                color="rgba(0, 0, 0, 0)"
              >
                <v-spacer></v-spacer>
                <v-btn
                  color="white"
                  icon
                  @click="redirectToNews(selectedArticle.url)"
                >
                  <v-icon>mdi-arrow-right-thin-circle-outline</v-icon>
                </v-btn>
              </v-app-bar>
            </v-img>
            <v-card-title>
              <span class="caption">{{ selectedArticle.publishedAt }}</span>
            </v-card-title>
            <v-card-title class="mt-n7">
              <span class="subtitle-1 line-height-20 font-weight-medium">{{ selectedArticle.title }}</span>
            </v-card-title>
            <v-card-text>
              <p class="text--primary">
                <span v-html="selectedArticle.description" />
              </p>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- Error Dialog -->
        <v-btn
          text
          color="primary accent-4"
          class="px-0"
          @click="showError"
        >
          Show Error
        </v-btn>
        <v-dialog
          v-model="this.$store.getters['news/getErrorDialog']"
          width="500"
        >
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Error
            </v-card-title>

            <v-card-text class="mt-5">
              <span class="subtitle-1">Error encountered, please try again later</span>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="hideError"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';
import SkeletonLoader from './SkeletonLoader.vue';

export default {
  components: { SkeletonLoader },
  name: 'HelloWorld',

  data: () => ({
    loading: false,
    timeZone: '',
    sources: [],
    selectedSources: [],
    search: '',
    dialog: false,
    selectedArticle: []
  }),
  methods: {
    showError() {
      this.$store.dispatch('news/initError', true);
    },
    hideError() {
      this.$store.dispatch('news/initError', false);
    },
    showArticleDialog(article) {
      this.selectedArticle = article
      this.dialog = true
    },
    redirectToNews(url) {
      window.open(url, '_blank');
    },
    updateSearch() {
      console.log(this.search);
      this.searchHeadline();
    },
    updateSource() {
      console.log(this.selectedSources);
      this.searchHeadline();
    },
    async searchHeadline() {
      await this.$store.dispatch('news/retrieveHeadlines', {
        sources: this.selectedSources.toString(),
        q: this.search
      });
    },
    checkAPI() {
      axios
        .get('https://newsapi.org/v2/sources?apiKey')
        .then((response) => {
          // eslint-disable-next-line prefer-destructuring
          console.log(response.data.sources);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  computed: {
    sourcesStates() {
      return this.$store.getters['news/getSources'];
    },
    news() {
      return this.$store.getters['news/getHeadlines'];
    }
  },
  async mounted() {
    console.log(process.env);
    this.timeZone = moment.tz.guess();

    await this.$store.dispatch('news/retrieveSources');
    await this.$store.dispatch('news/retrieveHeadlines', {});
  }
};
</script>
<style scoped>
.card-container {
  column-count: 4;
  column-gap: 1em;
  column-fill: balance;
}
.card-container > * {
  display: inline-block;
  width: 100%;
}
.line-height-20 {
  line-height: 20px;
}
.word-wrapper {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
