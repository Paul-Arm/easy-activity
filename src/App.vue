<template>
  <div id="app">
    <b-navbar toggleable style="background-color: #4b99ff;">
      <b-navbar-brand href="#" style="margin-left: 2rem; color: white;">EasyActivity</b-navbar-brand>

      <b-navbar-toggle target="navbar-toggle-collapse" style="margin-right: 2rem;" v-if="currentRouteName !== 'LoginView'">
        <template #default="{ expanded }">
          <b-icon style="color: white;" v-if="expanded" icon="chevron-bar-up"></b-icon>
          <b-icon style="color: white;" v-else icon="chevron-bar-down"></b-icon>
        </template>
      </b-navbar-toggle>

      <b-collapse id="navbar-toggle-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item style="color: white !important;" @click="openModalInvites()"><b-icon icon="card-list"></b-icon>&nbsp;Gruppeneinladungen</b-nav-item>
          <b-nav-item style="color: white !important;" @click="logoutUser()"><b-icon icon="box-arrow-left"></b-icon>&nbsp;Logout</b-nav-item>
          <b-nav-item style="color: white !important;" disabled>{{ userData.username }} - {{ userData.Email }}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view class="container"></router-view>

    <b-navbar variant="light" bg="light" class="footer justify-content-around" v-if="currentRouteName !== 'LoginView'">
      <b-navbar-nav class="mb-3">
        <b-nav-item to="/" :class="{ active: $route.path === '/' }">
          <font-awesome-icon icon="newspaper" style="font-size: 1.5em" />
          <small>Aktuelles</small>
        </b-nav-item>
        <b-nav-item to="/activities" :class="{ active: $route.path === '/activities' }">
          <font-awesome-icon icon="fa-solid fa-calendar-days" style="font-size: 1.5em" />
          <small>Aktivitäten</small>
        </b-nav-item>
        <b-nav-item to="/groups" :class="{ active: $route.path === '/groups' }">
          <font-awesome-icon icon="fa-solid fa-people-group" style="font-size: 1.5em" />
          <small>Gruppe</small>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>


    <b-modal v-model="modalVisible" title="Gruppeneinladungen" hide-footer hide-header-close>
        <div v-if="loading" class="text-center">
            <b-spinner label="Lädt..."></b-spinner>
        </div>
        <div v-else>
          <b-card
            v-for="(group, index) in inviteGroups"
            class="mb-2"
            :key="index"
            :header="group.Gruppenname"
          >
            <b-button-group class="w-100">
              <b-button variant="success" @click="acceptInvite(group.GruppeID)">Annehmen</b-button>
            </b-button-group>
          </b-card>
        </div>
    </b-modal>
  </div>
  
</template>

<script>
import axios from 'axios';
import { logout } from "@/services/auth";

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      loading: false,
      modalVisible: false,

      inviteGroups: null,

      userData: null,

      apiUrl: process.env.VUE_APP_API_URL,
    };
  },
  methods: {
    async logoutUser()
    {
      await logout();
      this.$router.push("/login");
    },

    openModalInvites() {
        this.loading = true;
        this.modalVisible = true;
        
        axios
            .get(this.apiUrl + "/Gruppen/Einladungen")
            .then((response) => {
              this.inviteGroups = response.data;
              this.loading = false;
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
    
                if (error.status === 401) {
                    localStorage.removeItem("token");
                }
            });
    },

    async acceptInvite(groupID) {
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
        .post(this.apiUrl + "/Gruppen/" + groupID + "/Beitreten")
        .then(async () => {
          Toast.fire({
            icon: "success",
            title: "Einladung angenommen",
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          Toast.fire({
            icon: "error",
            title: "Einladung konnte nicht angenommen werden",
          });
        });
    },
  },
  computed: {
    currentRouteName() {
        return this.$route.name;
    }
  },

  mounted() {
    axios
      .get(this.apiUrl + "/MeinProfiel")
      .then((response) => {
        this.userData = response.data;
      })
      .catch((error) => {
          console.error("Error fetching data:", error);

          if (error.status === 401) {
              localStorage.removeItem("token");
          }
      });
  }
};

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
}


.header {
  background: linear-gradient(180deg, #2a2cb0, #4b99ff);
  padding: 40px;
  text-align: center;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
  flex-shrink: 0;
}

.header-title {
  font-size: 1em;
  color: white;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;
}

.container {
  margin: 0 auto;
  flex: 1;
  overflow-y: auto;
}

.footer {
  text-align: center;
  padding: 10px 0;
  flex-shrink: 0;
}

.b-card-body {
  border-radius: 8px;
}

small {
  display: block;
  text-align: center;
  font-size: 0.8em;
}

.active {
  background-color: #e5e5e5;
  border-radius: 7px;
}

.b-navbar {
  padding: 1rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

</style>
