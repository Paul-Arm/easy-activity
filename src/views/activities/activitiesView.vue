<template>
    <!-- Main Container -->
    <div class="mt-2">
        <b-button-group style="width: 100%;" class="mt-3 mb-4">
            <b-button variant="secondary">Kartenansicht</b-button>
            <b-button variant="outline-secondary">Listenansicht</b-button>
        </b-button-group>

        <l-map
            :zoom="zoom"
            :center="center"
            style="height: 400px; width: 100%;"
        >
            <l-tile-layer :url="tileLayerUrl" />
            
            <l-marker :lat-lng="center" :icon="customIcon">
                <l-popup>  Hier wilde Party <a href="#">Mehr Informationen</a></l-popup>
            </l-marker>
        </l-map>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
  import L from "leaflet";

  
  export default {
    name: "activitiesView",
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
    },
    data() {
      return {
        show: false,
  
        center: [50.9750, 11.0292],
        zoom: 13,
        tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        customIcon: L.icon({
            iconUrl: "https://easy-activity.vercel.app/img/others/marker.png", // Beispiel-Icon
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        }),

        apiUrl: process.env.VUE_APP_API_URL,
      };
    },
  
    methods: {},
  
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
        .get(this.apiUrl + "/home/get-informations")
        .then((response) => {
          this.news = response.data.news;
  
          this.passwordReset = response.data.passwordReset;
  
          localStorage.setItem('roles', response.data.roles);
  
          if (response.data.passwordReset === true) {
            this.$swal({
              title: "Bitte ändere dein Passwort",
              text: "Dein Passwort wurde von einem Administrator zurückgesetzt",
              icon: "warning",
              confirmButtonColor: "#B02A2A",
              didClose: () => {
                this.$router.push("/account/security");
              },
            });
          }
  
          this.show = false;
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
  