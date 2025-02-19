<template>
    <b-container class="chat-container">
      <b-row class="chat-box p-3">
        <b-col>
          <div class="messages">
            <div v-for="(msg, index) in messages" :key="index" class="message" :class="{ 'user-message': msg.isUser }">
              <strong>{{ msg.isUser ? 'Du' : 'Andere' }}:</strong> {{ msg.text }}
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row class="input-area">
        <b-col>
          <b-input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Nachricht schreiben..." />
        </b-col>
        <b-col cols="auto">
          <b-button variant="primary" @click="sendMessage">Senden</b-button>
        </b-col>
      </b-row>
    </b-container>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    props: {
      groupid: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        newMessage: '',
        messages: [],

        userData: null,

        apiUrl: process.env.VUE_APP_API_URL,
      };
    },
    methods: {
      sendMessage() {
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
          Inhalt: this.newMessage,
          GruppenID: this.groupid
        };

        axios
            .post(this.apiUrl + "/Nachrichten", body)
            .then(async () => {
                this.fetchMessages();
                this.newMessage = '';
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                Toast.fire({
                    icon: "error",
                    title: "Nachricht konnte nicht gesendet werden.",
                });
            });
      },

      async fetchUserData() {
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
      },

      async fetchMessages() {
        axios
        .get(this.apiUrl + "/Nachrichten?GruppenID=" + this.groupid)
        .then((response) => {
          this.messages = response.data.map(msg => ({
            text: msg.Inhalt,
            isUser: msg.NutzerID === this.userData.NutzerID
          }));
        })
        .catch((error) => {
            console.error("Error fetching data:", error);

            if (error.status === 401) {
                localStorage.removeItem("token");
            }
        });
      },
    },

    async mounted() {
      await this.fetchUserData();
      await this.fetchMessages();
    },
  };
  </script>
  
  <style scoped>
  .chat-container {
    max-width: 500px;
    margin: 20px auto;
    border: 1px solid #ddd;
    border-radius: 10px;
    background: white;
  }
  
  .chat-box {
    max-height: 150px;
    overflow-y: auto;
    border-bottom: 1px solid #ddd;
  }
  
  .messages {
    display: flex;
    flex-direction: column;
  }
  
  .message {
    padding: 8px;
    margin: 5px;
    border-radius: 8px;
    max-width: 80%;
  }
  
  .user-message {
    align-self: flex-end;
    background-color: #007bff;
    color: white;
  }
  
  .input-area {
    padding: 10px;
  }
  </style>
  