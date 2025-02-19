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
            <b-card v-for="(activity, index) in filteredActivities" :key="index" class="mb-2" style="cursor: pointer;">
              <b-card-body>
                <b-card-title>{{ activity.Titel }}</b-card-title>
                <b-card-text>{{ activity.Beschreibung }}</b-card-text>
                <b-card-text>{{ activity.Straße }} {{ activity.Hausnummer }} - {{ activity.Ort }} ({{ activity.Postleitzahl }}), {{ activity.Staat }}</b-card-text>
              </b-card-body>
              <b-card-footer>
                📅&nbsp;{{ formatDate(activity.Startzeitpunkt) }}
              </b-card-footer>
            </b-card>
          </b-card-group>
        </div>
        <div v-else>
          <b-card-group deck>
            <b-card v-for="(activity, index) in filteredOwnActivities" :key="index" class="mb-2" style="cursor: pointer;" @click="openModal(activity)">
              <b-card-body>
                <b-card-title>{{ activity.Titel }}</b-card-title>
                <b-card-text>{{ activity.Beschreibung }}</b-card-text>
                <b-card-text>{{ activity.Straße }} {{ activity.Hausnummer }} - {{ activity.Ort }} ({{ activity.Postleitzahl }}), {{ activity.Staat }}</b-card-text>
              </b-card-body>
              <b-card-footer>
                📅&nbsp;{{ formatDate(activity.Startzeitpunkt) }}
              </b-card-footer>
            </b-card>
          </b-card-group>
        </div>


        <b-modal v-model="showModal" title="Aktivität" hide-header-close ok-only ok-title="Schließen" ok-variant="secondary">
          <b-button-group class="w-100">
            <b-button variant="success" @click="setAttendance(true)"><b-icon icon="check-circle"></b-icon></b-button>
            <b-button variant="danger" @click="setAttendance(false)"><b-icon icon="x-circle"></b-icon></b-button>
          </b-button-group>
          <hr>

          <h6>Teilnehmer</h6>
          {{ countAgrees }} zugesagt <br>
          {{ countDisagrees }} abgesagt
          <template #modal-footer>
            <b-button variant="secondary" @click="showModal = false">Schließen</b-button>
          </template>
          <hr>
          <div v-if="showLocationSuggestions">
            Ortsvorschläge
            <b-button v-b-modal.modal-location-suggestions variant="success">Ort vorschlagen</b-button>

            <b-modal id="modal-location-suggestions" title="Ort vorschlagen" hide-header-close hide-footer>
              <b-form-group
                  label="Straße:"
                  label-for="street"
                  label-cols-sm="3"
                  label-align-sm="right"
              >
                  <b-form-input id="street" v-model="street"></b-form-input>
              </b-form-group>

              <b-form-group
                  label="Hausnummer:"
                  label-for="number"
                  label-cols-sm="3"
                  label-align-sm="right"
              >
                  <b-form-input id="number" v-model="number"></b-form-input>
              </b-form-group>

              <b-form-group
                  label="Postleitzahl:"
                  label-for="postal-code"
                  label-cols-sm="3"
                  label-align-sm="right"
              >
                  <b-form-input id="postal-code" v-model="postalCode"></b-form-input>
              </b-form-group>

              <b-form-group
                  label="Ort:"
                  label-for="city"
                  label-cols-sm="3"
                  label-align-sm="right"
              >
                  <b-form-input id="city" v-model="city"></b-form-input>
              </b-form-group>

              <b-form-group
                  label="Staat:"
                  label-for="state"
                  label-cols-sm="3"
                  label-align-sm="right"
              >
                  <b-form-input id="state" v-model="state"></b-form-input>
              </b-form-group>
              <b-button variant="success" class="mt-2" @click="postLocationSuggestion()">Aktivität erstellen</b-button>
            </b-modal>

            <b-card-group deck>
              <b-card v-for="(location, index) in locationSuggestions" :key="index">
                <b-card-body style="padding: 3px !important;">
                  <b-card-title>Stimmen: {{ location.votes }}</b-card-title>
                  <b-card-text>{{ location.Straße }} {{ location.Hausnummer }} - {{ location.Postleitzahl }} {{ location.Ort }}</b-card-text>
                  <b-button variant="success" @click="acceptLocationSuggest(location)">Anwenden</b-button>
                </b-card-body>
              </b-card>
            </b-card-group>
          </div>
          <div v-if="showTimeSuggestions">
            <hr>
            Zeitvorschläge
            <b-button variant="success">Zeit vorschlagen</b-button>
            <b-card-group deck>
              <b-card v-for="(time, index) in timeSuggestions" :key="index">
                <b-card-body style="padding: 3px !important;">
                  <b-card-title>Stimmen: {{ location.votes }}</b-card-title>
                  <b-card-text>{{ time.Startzeitpunkt }} - {{ location.Endzeitpunkt }}</b-card-text>
                  <b-button variant="success">Anwenden</b-button>
                </b-card-body>
              </b-card>
            </b-card-group>
          </div>
        </b-modal>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { format } from 'date-fns';

  
  export default {
    name: "activitiesView",
    components: {},
    data() {
      return {
        show: false,

        searchQuery: "",

        allActivites: true,

        showModal: false,

        activities: [],
        ownActivites: [],

        activityID: null,

        showLocationSuggestions: false,
        showTimeSuggestions: false,
        locationSuggestions: false,
        timeSuggestions: false,

        countAgrees: 0,
        countDisagrees: 0,

        street: "",
        number: "",
        postalCode: "",
        city: "",
        state: "",

        apiUrl: process.env.VUE_APP_API_URL,
      };
    },
    methods: {
      async openModal(activity) {
        this.activityID = activity.AktivitätID;
        this.showLocationSuggestions = activity.Ortsabstimmung;
        this.showTimeSuggestions = activity.Zeitabstimmung;

        if (this.showLocationSuggestions) {
          axios
            .get(this.apiUrl + "/Aktivitaet/{id}/Ortvorschlaege?activity_id=" + activity.AktivitätID)
            .then((response) => {
                this.locationSuggestions = response.data;
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
    
                if (error.status === 401) {
                    localStorage.removeItem("token");
                }
            });

          this.locationSuggestions = activity.Ortsvorschläge;
        }

        if (this.showTimeSuggestions) {
          axios
            .get(this.apiUrl + "/Aktivitaet/{id}/Zeitvorschlaege?activity_id=" + activity.AktivitätID)
            .then((response) => {
                this.timeSuggestions = response.data;
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
    
                if (error.status === 401) {
                    localStorage.removeItem("token");
                }
            });

          this.locationSuggestions = activity.Ortsvorschläge;
        }

        axios
          .get(this.apiUrl + "/Teilnahme/" + activity.AktivitätID)
          .then((response) => {
            this.countAgrees = response.data.filter(item => item.StimmtZu).length;
            this.countDisagrees = response.data.filter(item => !item.StimmtZu).length;
          })
          .catch((error) => {
              console.error("Error fetching data:", error);
  
              if (error.status === 401) {
                  localStorage.removeItem("token");
              }
          });

        this.showModal = true;
      },

      setAttendance(attendance) {
        const Toast = this.$swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", this.$swal.stopTimer);
                toast.addEventListener("mouseleave", this.$swal.resumeTimer);
            },
        });

        axios
            .post(this.apiUrl + "/Teilnahme/" + this.activityID + "/abstimmen?teilnahme=" + attendance)
            .then(async () => {
                Toast.fire({
                    icon: "success",
                    title: "Teilnahme abgestimmt",
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                Toast.fire({
                    icon: "error",
                    title: "Teilnahme konnte nicht abgestimmt werden.",
                });
            });
      },

      postLocationSuggestion() {
        const Toast = this.$swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", this.$swal.stopTimer);
                toast.addEventListener("mouseleave", this.$swal.resumeTimer);
            },
        });

        const body = {
          Straße: this.street,
          Hausnummer: this.number,
          Postleitzahl: this.postalCode,
          Ort: this.city,
          Staat: this.state
        };

        axios
            .post(this.apiUrl + "Aktivitaet/{id}/Ortvorschlag?activity_id=" + this.activityID, body)
            .then(async () => {
                Toast.fire({
                    icon: "success",
                    title: "",
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                Toast.fire({
                    icon: "error",
                    title: "",
                });
            });
      },

      acceptLocationSuggest() {

      },
     
      showAllActivites() {
        this.allActivites = true;
      },
      showOwnActivites() {
        this.allActivites = false;
      },

      formatDate(date) {
        try {
          return format(new Date(date), 'dd.MM.yyyy HH:mm');
        } catch (error) {
          return "-";
        }
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
  </style>
  