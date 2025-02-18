<template>
  <!-- Main Container -->
  <div class="mt-2">
    <b-alert variant="warning" show class="text-center">
      <div>
        <b-icon icon="exclamation-triangle" font-scale="1.5"></b-icon>
        <br>
        Die App befindet sich noch <strong>in Entwicklung</strong>.
        Es können noch vermehrt Fehler auftreten.</div>
    </b-alert>

    <div class="news-container">
      <h2 class="title">Aktuelle News</h2>
      <ul style="list-style: none; padding: 0;">
        <li v-for="news in newsList" :key="news.id" class="news-item">
          <h3>{{ news.title }}</h3>
          <p>{{ news.description }}</p>
          <span class="date">📅 {{ news.date }}</span>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "homeView",
  components: {
  },
  data() {
    return {
      show: false,

      newsList: [
        { id: 1, title: "🔥 Sommerfestival 2025", description: "Das größte Musikfestival des Jahres mit Top-Acts!", date: "18. Februar 2025" },
        { id: 3, title: "Event-Planung leicht gemacht", description: "Die neuesten Tools für Event-Manager im Überblick.", date: "12. Februar 2025" }
      ],

      apiUrl: process.env.VUE_APP_API_URL,
    };
  },

  methods: {},

  mounted() {
    this.show = true;
  },
};
</script>

<style scoped>
.b-card-body {
  border-radius: 8px;
}

.b-navbar {
  height: 70px;
}

.news-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: linear-gradient(135deg, #4B99FF, #82b8ff);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: white;
  font-family: 'Arial', sans-serif;
}
.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}
.news-item {
  padding: 15px;
  margin: 10px 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
}
.date {
  display: block;
  font-size: 0.9em;
  opacity: 0.8;
}
</style>
