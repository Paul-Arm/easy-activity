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

        <b-modal v-model="modalVisible" :title="modalGroupName" ok-only ok-title="Schließen" ok-variant="secondary" hide-header-close>
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

                <chatbox :groupid="modalGroupID"></chatbox>

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
                    <b-button v-b-toggle.collapse-new-activity variant="link">Aktivität erstellen&nbsp;<b-icon icon="chevron-down"></b-icon></b-button>
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
                                    <b-form-input id="title" v-model="title"></b-form-input>
                                </b-form-group>

                                <b-form-group
                                    label="Beschreibung:"
                                    label-for="description"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-input id="description" v-model="description"></b-form-input>
                                </b-form-group>

                                <hr>

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

                                <hr>

                                <b-form-group
                                    label="Startzeitpunkt:"
                                    label-for="starttime"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-datepicker id="start-datepicker" class="mb-2" v-model="startDate"></b-form-datepicker>
                                    <b-form-timepicker id="start-timepicker" locale="de" v-model="startTime"></b-form-timepicker>
                                </b-form-group>

                                <b-form-group
                                    label="Endzeitpunkt: (optional)"
                                    label-for="endtime"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-datepicker id="end-datepicker" class="mb-2" v-model="endDate"></b-form-datepicker>
                                    <b-form-timepicker id="end-timepicker" locale="de" v-model="endTime"></b-form-timepicker>
                                </b-form-group>

                                <b-form-group
                                    label="Abstimmungsende:"
                                    label-for="voting-deadline"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-datepicker id="deadline-datepicker" class="mb-2" v-model="votingDeadlineDate"></b-form-datepicker>
                                    <b-form-timepicker id="deadline-timepicker" locale="de" v-model="votingDeadlineTime"></b-form-timepicker>
                                </b-form-group>

                                <b-form-group
                                    label="Ortsabstimmung:"
                                    label-for="local-vote"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-checkbox
                                        id="local-vote"
                                        name="local-vote"
                                        v-model="localVote"
                                        >
                                    </b-form-checkbox>
                                </b-form-group>

                                <b-form-group
                                    label="Zeitabstimmung:"
                                    label-for="time-vote"
                                    label-cols-sm="3"
                                    label-align-sm="right"
                                >
                                    <b-form-checkbox
                                        id="time-vote"
                                        name="time-vote"
                                        v-model="timeVote"
                                        >
                                    </b-form-checkbox>
                                </b-form-group>
                                
                                <hr>

                                <b-button variant="success" class="mt-2" @click="createActivity(modalGroupID)">Aktivität erstellen</b-button>
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
import { format } from 'date-fns';
import chatbox from "@/components/chatboxView.vue";
  
  export default {
    name: "groupsView",
    components: {chatbox},
    data() {
      return {
        loading: false,
        modalVisible: false,

        modalGroupID: null,
        modalGroupName: "",
        modalGroupDescription: "",
        modalGroupMembers: null,

        title: "",
        description: "",
        street: "",
        number: "",
        postalCode: "",
        city: "",
        state: "",
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        votingDeadlineDate: null,
        votingDeadlineTime: null,
        localVote: false,
        timeVote: false,

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

        createActivity(groupID) {
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

            let startDate = format((new Date(this.startDate)), 'yyyy-MM-dd') + "T" + this.startTime + ".000Z";
            let endDate = format((new Date(this.endDate)), 'yyyy-MM-dd') + "T" + this.endTime + ".000Z";


            let openEnd = false;
            if (this.endDate === null || this.endTime === null) {
                openEnd = true;
                endDate = startDate;
            }

            let votingDeadlineDate = format((new Date(this.votingDeadlineDate)), 'yyyy-MM-dd') + "T" + this.votingDeadlineTime + ".000Z";

            const body = {
                "Titel": this.title,
                "Beschreibung": this.description,
                "Adresse": {
                    "Straße": this.street,
                    "Hausnummer": this.number,
                    "Postleitzahl": this.postalCode,
                    "Ort": this.city,
                    "Staat": this.state
                },
                "Startzeitpunkt": startDate,
                "Endzeitpunkt": endDate,
                "Ortsabstimmung": this.localVote,
                "Zeitabstimmung": this.timeVote,
                "GruppeID": groupID,
                "Abstimmungsende": votingDeadlineDate,
                "ZeitAlsSchnittmenge": true,
                "OffenesEnde": openEnd
            };

            axios
                .post(this.apiUrl + "/Aktivitaet", body)
                .then(async () => {
                    Toast.fire({
                        icon: "success",
                        title: "Aktivität erstellt",
                    });
                    this.modalVisible = false;
                    this.fetchGroups();
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    Toast.fire({
                        icon: "error",
                        title: "Fehler beim Erstellen der Aktivität",
                    });
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
  