<template>
  <div>
    <b-card class="login m-3 mt-5">
      <h3>Willkommen zurück</h3>
      <h6>Wir freuen uns so, dich wiederzusehen!</h6>

      <hr class="m-4" />

      <small>Account-Informationen</small>
      <b-form @submit.prevent="handleLogin()">
        <b-form-group id="input-group-username" label-for="input-username">
          <b-form-input
            id="input-username"
            v-model="username"
            type="text"
            placeholder="Benutzername"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-password"
          label-for="input-password"
          class="mt-2"
        >
          <b-input-group>
            <b-form-input
              id="input-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Passwort"
              required
            ></b-form-input>
            <b-input-group-append>
              <b-button
                @click="togglePassword"
                variant="outline-secondary"
                style="
                  border-radius: 0 0.375rem 0.375rem 0;
                  border-color: #dee2e6;
                "
              >
                <b-icon :icon="showPassword ? 'eye-slash' : 'eye'"></b-icon>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <small
          ><b-link v-b-modal.registration-modal style="color: #4b99ff"
            >Registierung</b-link
          ></small
        >

        <b-button
          type="submit"
          variant="primary"
          class="mt-3"
          style="width: 100%; background-color: #4b99ff; border-color: #4b99ff"
          >Login</b-button
        >
      </b-form>

      <b-modal
        id="registration-modal"
        title="Registrierung"
        hide-header-close
        hide-footer
        centered
        size="lg"
      >
        <b-form @submit.prevent="handleRegistration()">
          <b-form-group id="input-group-username" label-for="input-username">
            <b-form-input
              id="input-username"
              v-model="registrationUsername"
              type="text"
              placeholder="Benutzername"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-password"
            label-for="input-password"
            class="mt-2"
          >
            <b-input-group>
              <b-form-input
                id="input-password"
                v-model="registrationPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Passwort"
                required
              ></b-form-input>
              <b-input-group-append>
                <b-button
                  @click="togglePassword"
                  variant="outline-secondary"
                  style="
                    border-radius: 0 0.375rem 0.375rem 0;
                    border-color: #dee2e6;
                  "
                >
                  <b-icon :icon="showPassword ? 'eye-slash' : 'eye'"></b-icon>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
          <hr>
          <b-form-group id="input-group-name" label-for="input-name"  class="mt-2">
            <b-form-input
              id="input-name"
              v-model="registrationName"
              type="text"
              placeholder="Nachname"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-firstname" label-for="input-firstname" class="mt-2">
            <b-form-input
              id="input-firstname"
              v-model="registrationFirstname"
              type="text"
              placeholder="Vorname"
              required
            ></b-form-input>
          </b-form-group>
          <hr>
          <b-form-group id="input-group-email" label-for="input-email" class="mt-2">
            <b-form-input
              id="input-email"
              v-model="registrationEmail"
              type="email"
              placeholder="E-Mail"
              required
            ></b-form-input>
          </b-form-group>
          <hr>
          <b-button
            class="mt-2"
            type="submit"
            style="background-color: #4b99ff; border-color: #4b99ff"
            block
            >Registrieren</b-button
          >
        </b-form>
        <b-alert v-if="this.errorMessage" show class="mt-3" variant="danger">{{
          this.errorMessage
        }}</b-alert>
      </b-modal>

      <b-alert v-if="this.errorMessage" show class="mt-3" variant="danger">{{
        this.errorMessage
      }}</b-alert>
    </b-card>
  </div>
</template>

<script>
import axios from "axios";
import { login } from "../services/auth";

export default {
  data() {
    return {
      username: "",
      password: "",

      registrationUsername: "",
      registrationPassword: "",
      registrationName: "",
      registrationFirstname: "",
      registrationEmail: "",

      errorMessage: "",

      showPassword: false,

      apiUrl: process.env.VUE_APP_API_URL,
    };
  },
  methods: {
    async handleLogin() {
      try {
        await login(this.username, this.password);
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error;
      }
    },

    async handleRegistration() {
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
        anmeldename: this.registrationUsername,
        passwort: this.registrationPassword,
        name: this.registrationName,
        vorname: this.registrationFirstname,
        email: this.registrationEmail,
        IstEventveranstalter: false,
      };

      axios
        .post(this.apiUrl + "/create-user", body)
        .then(async () => {
          Toast.fire({
            icon: "success",
            title: "Benutzer erstellt",
          });
          this.$bvModal.hide("registration-modal");
          await login(this.registrationUsername, this.registrationPassword);
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.errorMessage = error;
        });
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
small {
  display: block;
  text-align: center;
  font-size: 0.8em;
}
</style>
