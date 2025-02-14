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
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "homeView",
  components: {
  },
  data() {
    return {
      show: false,

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
