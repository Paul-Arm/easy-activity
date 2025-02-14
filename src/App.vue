<template>
  <div id="app">
    <b-navbar style="background-color: #4b99ff;" class="px-3 p-3 d-flex justify-content-end align-items-center">
      <div class="d-flex algin-items-center" v-if="currentRouteName !== 'LoginView'">
        <div class="text-white font-weight-bold h5 m-2 d-flex" style="align-items: center;">{{ userName }}</div>
        <b-avatar variant="light" src="/img/icons/party-pinguin.jpg" size="48px" class="shadow-sm"></b-avatar>
      </div>
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
  </div>
  
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      showInstallPrompt: false,
      deferredPrompt: null,

      userName: "Max Mustermann"

    };
  },
  methods: {
    

  },
  computed: {
    currentRouteName() {
        return this.$route.name;
    }
  },

  mounted() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt = true;
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


.install-prompt {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 11;
}

.install-prompt-ios {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 11;
}

.b-navbar {
  padding: 1rem;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
