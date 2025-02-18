<template>
    <!-- Main Container -->
    <div class="mt-2">
      <b-form-input v-model="searchQuery" placeholder="Suche..."></b-form-input>


        <b-button-group style="width: 100%;" class="mt-3 mb-4">
            <b-button @click="showAllActivites" :variant="outlineAllVariant">Alle Aktivitäten</b-button>
            <b-button @click="showOwnActivites" :variant="outlineOwnVariant">Eigene Aktivitäten</b-button>
        </b-button-group>

        
        <div v-if="allActivites">
          <b-card-group deck>
            <b-card v-for="(activity, index) in filteredActivities" :key="index" class="mb-2">
              <b-card-body>
                <b-card-title>{{ activity.Titel }}</b-card-title>
                <b-card-text>{{ activity.Beschreibung }}</b-card-text>
                <b-card-text>{{ activity.Straße }} {{ activity.Hausnummer }} - {{ activity.Ort }} ({{ activity.Postleitzahl }}), {{ activity.Staat }}</b-card-text>
              </b-card-body>
            </b-card>
          </b-card-group>
        </div>
        <div v-else>
          <b-card-group deck>
            <b-card v-for="(activity, index) in filteredOwnActivities" :key="index" class="mb-2">
              <b-card-body>
                <b-card-title>{{ activity.Titel }}</b-card-title>
                <b-card-text>{{ activity.Beschreibung }}</b-card-text>
                <b-card-text>{{ activity.Straße }} {{ activity.Hausnummer }} - {{ activity.Ort }} ({{ activity.Postleitzahl }}), {{ activity.Staat }}</b-card-text>
              </b-card-body>
            </b-card>
          </b-card-group>
        </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";

  
  export default {
    name: "activitiesView",
    components: {},
    data() {
      return {
        show: false,

        searchQuery: "",

        allActivites: true,


        activities: [],
        ownActivites: [],

        apiUrl: process.env.VUE_APP_API_URL,
      };
    },
    methods: {
      showAllActivites() {
        this.allActivites = true;
      },
      showOwnActivites() {
        this.allActivites = false;
      },
    },

    computed: {
      outlineAllVariant() {
        return this.allActivites === true
          ? "secondary"
          : "outline-secondary";
      },
      outlineOwnVariant() {
        return this.allActivites === true
          ? "outline-secondary"
          : "secondary";
      },

      filteredActivities() {
        return this.activities.filter(item => {
          const searchLower = this.searchQuery.toLowerCase();
          return (
            item.Titel.toLowerCase().includes(searchLower) ||
            item.Beschreibung.toLowerCase().includes(searchLower)
          );
        });
      },

      filteredOwnActivities() {
        return this.ownActivites.filter(item => {
          const searchLower = this.searchQuery.toLowerCase();
          return (
            item.Titel.toLowerCase().includes(searchLower) ||
            item.Beschreibung.toLowerCase().includes(searchLower)
          );
        });
      },
    },
  
    mounted() {
      this.show = true;
      /*const Toast = this.$swal.mixin({
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", this.$swal.stopTimer);
            toast.addEventListener("mouseleave", this.$swal.resumeTimer);
          },
        });
  
        Toast.fire({
            icon: "info",
            title:
              "",
          });*/
  
      axios
        .get(this.apiUrl + "/Aktivitaet")
        .then((response) => {
          this.activities = response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
  
          if (error.status === 401) {
            localStorage.removeItem("token");
          }
        });

      axios
        .get(this.apiUrl + "/Aktivitaet/MeineAktivitaeten")
        .then((response) => {
          this.ownActivites = response.data;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
  
          if (error.status === 401) {
            localStorage.removeItem("token");
          }
        });
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
  
  small {
    display: block;
    color: #9b0214;
    text-align: center;
    font-size: 0.8em;
  }
  
  a {
    color: #d8041c;
  }
  </style>
  