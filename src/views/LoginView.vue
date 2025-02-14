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
              <b-button @click="togglePassword" variant="outline-secondary" style="border-radius: 0 0.375rem 0.375rem 0; border-color: #dee2e6;">
                <b-icon :icon="showPassword ? 'eye-slash' : 'eye'"></b-icon>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <small
          ><b-link @click="showAlert()" style="color: #4b99ff"
            >Passwort vergessen?</b-link
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

      <b-alert v-if="this.errorMessage" show class="mt-3" variant="danger">{{
        this.errorMessage
      }}</b-alert>
    </b-card>
  </div>
</template>

<script>
import { login } from "../services/auth";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",

      showPassword: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        await login(this.username, this.password);
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = "Ungültige Anmeldeinformationen";
      }
    },

    showAlert() {
      this.$swal({
        html: `
          <h5>Passwort vergessen?</h5>
          Kein Problem! Bitte wende dich an unsere E-Mail-Adresse:<br>
          <a href="mailto:support@easyactivity.org?subject=Supportanfrage%20-%20Passwort%20vergessen">support@easyactivity.org</a>
        `,
        icon: "info",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
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
