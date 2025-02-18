<template>
    <!-- Main Container -->
    <div class="mt-2">
        <b-row class="justify-content-center mt-4 mb-3">
            <b-col md="8" lg="6">
                <b-card title="Neue Gruppe erstellen" header-bg-variant="primary" text-variant="light">
                    <b-form @submit.prevent="createGroup">
                        <b-form-group label-for="group-name">
                        <b-form-input
                            id="group-name"
                            v-model="newGroupName"
                            placeholder="Gib einen Gruppennamen ein"
                            required
                        ></b-form-input>
                        </b-form-group>
                        <div class="d-flex justify-content-between">
                        <b-button type="submit" variant="primary" class="w-100 mt-2">
                            Gruppe erstellen
                        </b-button>
                        </div>
                    </b-form>
                </b-card>
            </b-col>
        </b-row>
        <hr>
        <b-row>
            <b-col v-for="group in groups" :key="group.GruppeID" cols="12" md="6" lg="4">
                <b-card :title="group.Gruppenname" :sub-title="'Gruppe ID: ' + group.GruppeID" class="mb-4">
                <template #footer>
                    <b-button variant="primary" @click="openModal(group.GruppeID)">Gruppendetails</b-button>
                </template>
                </b-card>
            </b-col>
        </b-row>

        <b-modal v-model="modalVisible" :title="modalGroupName" hide-footer hide-header-close>
            <div v-if="loading" class="text-center">
                <b-spinner label="Lädt..."></b-spinner>
            </div>
            <div v-else>
                <div class="d-flex justify-content-between">
                    <h5>Details zur Gruppe</h5>
                    <b-button size="sm" variant="danger" @click="leaveGroup(modalGroupID)">Gruppe verlassen</b-button>
                </div>
                <p><strong>Gruppe ID:</strong> {{ modalGroupID }}</p>
                <p><strong>Gruppenname:</strong> {{ modalGroupName }}</p>

                <b-button v-b-toggle.collapse-group-members variant="link" @click="fetchGroupMembers(modalGroupID)">Gruppenmitglieder&nbsp;<b-icon icon="chevron-down"></b-icon></b-button>
                <b-collapse id="collapse-group-members" class="mt-2">
                    <b-card>
                        <ul class="m-0">
                            <li v-for="(groupMember, index) in modalGroupMembers" :key="index">
                                {{ groupMember.Nachname }}, {{ groupMember.Vorname }} ({{ groupMember.Nutzername }})
                            </li>
                        </ul>
                    </b-card>
                </b-collapse>

                <hr>
                <h6>Benutzer einladen</h6>
                <b-input-group class="mt-3">
                    <b-form-input v-model="userEmail" type="email" style="border-radius: 0.375rem 0 0 0.375rem;" placeholder="E-Mail des Nutzers"></b-form-input>
                    <b-input-group-append>
                        <b-button variant="outline-success" style="border-radius: 0 0.375rem 0.375rem 0;" @click="inviteUserInGroup(modalGroupID)">Einladen</b-button>
                    </b-input-group-append>
                </b-input-group>

                <hr>
                <div>
                    <div>Aktivitäten in dieser Gruppe:</div>
                    <b-button style="font-size: 85%;" v-b-toggle.collapse-new-activity variant="link">Aktivität erstellen&nbsp;<b-icon icon="chevron-down"></b-icon></b-button>
                    <b-collapse id="collapse-new-activity" class="mt-2">
                        <b-card>
                            <b-form-group
                                class="mb-0"
                                >
                                <b-form-group
                                    label="Titel:"
                                    label-for="title"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-input id="title"></b-form-input>
                                </b-form-group>

                                <b-form-group
                                    label="Beschreibung:"
                                    label-for="description"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-input id="description"></b-form-input>
                                </b-form-group>

                                <hr>

                                <b-form-group
                                    label="Straße:"
                                    label-for="street"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-input id="street"></b-form-input>
                                </b-form-group>

                                <b-form-group
                                    label="Hausnummer:"
                                    label-for="number"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-input id="number"></b-form-input>
                                </b-form-group>

                                <b-form-group
                                    label="Postleitzahl:"
                                    label-for="postal-code"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-input id="postal-code"></b-form-input>
                                </b-form-group>

                                <b-form-group
                                    label="Ort:"
                                    label-for="city"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-input id="city"></b-form-input>
                                </b-form-group>

                                <b-form-group
                                    label="Staat:"
                                    label-for="state"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-input id="state"></b-form-input>
                                </b-form-group>

                                <hr>

                                <b-form-group
                                    label="Startzeitpunkt:"
                                    label-for="starttime"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-datepicker id="example-datepicker" class="mb-2"></b-form-datepicker>
                                    <b-form-timepicker locale="de"></b-form-timepicker>
                                </b-form-group>

                                <b-form-group
                                    label="Endzeitpunkt: (optional)"
                                    label-for="endtime"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-datepicker id="example-datepicker" class="mb-2"></b-form-datepicker>
                                    <b-form-timepicker locale="de"></b-form-timepicker>
                                </b-form-group>

                                <b-form-group
                                    label="Abstimmungsende:"
                                    label-for="voting-deadline"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-datepicker id="example-datepicker" class="mb-2"></b-form-datepicker>
                                    <b-form-timepicker locale="de"></b-form-timepicker>
                                </b-form-group>
                                
                                <hr>

                                <b-button variant="success" class="mt-2">Aktivität erstellen</b-button>
                            </b-form-group>
                        </b-card>
                    </b-collapse>

                    <ul v-if="groupActivities && groupActivities.length > 0">
                        <li v-for="(groupActivity, index) in groupActivities" :key="index">
                            {{ groupActivity.Titel }}
                        </li>
                    </ul>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
  
  export default {
    name: "groupsView",
    components: {},
    data() {
      return {
        loading: false,
        modalVisible: false,

        modalGroupID: null,
        modalGroupName: "",
        modalGroupDescription: "",
        modalGroupMembers: null,

        groups: null,
        groupActivities: null,

        newGroupName: "",

        userEmail: "",

        apiUrl: process.env.VUE_APP_API_URL,
      };
    },
    methods: {
        openModal(groupID) {
            this.loading = true;
            this.modalVisible = true;
            
            axios
                .get(this.apiUrl + "/Gruppen/" + groupID)
                .then((response) => {
                    this.modalGroupID = response.data.GruppeID;
                    this.modalGroupName = response.data.Gruppenname;
                    this.loading = false;
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
                    this.groupActivities = response.data.filter(activity => activity.Gruppe === groupID);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
        
                    if (error.status === 401) {
                        localStorage.removeItem("token");
                    }
            });
        },

        fetchGroupMembers(groupID) {
            axios
                .get(this.apiUrl + "/Gruppen/" + groupID + "/Mitglieder")
                .then((response) => {
                    this.modalGroupMembers = response.data;
                    this.loading = false;
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
        
                    if (error.status === 401) {
                        localStorage.removeItem("token");
                    }
                });
        },

        async leaveGroup(groupID) {
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
                .post(this.apiUrl + "/Gruppen/" + groupID + "/Verlassen")
                .then(async () => {
                    Toast.fire({
                        icon: "success",
                        title: "Gruppe verlassen",
                    });
                    this.modalVisible = false;
                    this.fetchGroups();
                })
                .catch((error) => {
                console.error("Error fetching data:", error);
                Toast.fire({
                    icon: "error",
                    title: "Gruppe konnte nicht verlassen werden",
                });
                });
            },

        inviteUserInGroup(groupID) {
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
                userEmail: this.userEmail,
            };

            axios
                .post(this.apiUrl + "/Gruppen/" + groupID + "/Einladen", body)
                .then(async () => {
                    Toast.fire({
                        icon: "success",
                        title: "Benutzer in Gruppe eingeladen",
                    });
                    this.fetchGroups();
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    Toast.fire({
                        icon: "error",
                        title: "Fehler beim Einladen in die Gruppe",
                    });
                });
        },

        fetchGroups() {
            axios
                .get(this.apiUrl + "/Gruppen")
                .then((response) => {
                    this.groups = response.data;
                })
                .catch((error) => {
                console.error("Error fetching data:", error);
    
                if (error.status === 401) {
                    localStorage.removeItem("token");
                }
            });

            
        },
        
        createGroup() {
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
                Gruppenname: this.newGroupName,
            };

            axios
                .post(this.apiUrl + "/Gruppen", body)
                .then(async () => {
                    Toast.fire({
                        icon: "success",
                        title: "Gruppe erstellt",
                    });
                    this.fetchGroups();
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    Toast.fire({
                        icon: "error",
                        title: "Fehler beim Erstellen der Gruppe",
                    });
                });
        }
    },
  
    mounted() {
      this.fetchGroups();
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
  
  h4 {
    color: #000000;
  }
  </style>
  