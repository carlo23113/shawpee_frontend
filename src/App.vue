<template>
<v-app id="inspire">
    <v-app-bar id="navbar" app>
        <v-btn @click="home()" text id="nav-btn">
            SHAWPEE
        </v-btn>
        <v-tab v-for="datas in categories" :key="datas.id">{{
        datas.Name
      }}</v-tab>

        <div class="admin" v-if="admin == true">
            <v-btn to="/home" text id="nav-btn">
                Home
            </v-btn>
            <v-btn text id="nav-btn">
                Orders
            </v-btn>
            <v-btn text id="nav-btn">
                Pendings
            </v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn v-if="admin == true" @click="logout()" text id="nav-btn" v-bind="attrs" v-on="on">
            Logout
        </v-btn>
        <v-dialog v-if="admin == false" v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
                <v-btn text id="nav-btn" v-bind="attrs" v-on="on">
                    Login
                </v-btn>
            </template>
        </v-dialog>
    </v-app-bar>

    <v-main>
        <router-view></router-view>
    </v-main>

    <!--------- LOGIN DIALOG ------->

    <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <form @submit.prevent="login()">
                    <v-card-title>
                        <span class="headline">Login</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field label="Username*" @keydown="clear()" v-model="username" required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" name="input-10-1" label="Password*" hint="At least 8 characters" counter @click:append="show1 = !show1"></v-text-field>
                                </v-col>
                                <medium style="color:red; margin: auto">{{ error }}</medium>
                            </v-row>
                        </v-container>
                        <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialog = false">
                            Close
                        </v-btn>
                        <v-btn color="blue darken-1" text type="submit">
                            Login
                        </v-btn>
                    </v-card-actions>
                </form>
            </v-card>
        </v-dialog>
    </v-row>
</v-app>
</template>

<script>
export default {
    data: () => ({
        links: ["Dashboard", "Messages", "Profile", "Updates"],
        admin: false,
        dialog: false,
        username: "",
        password: "",
        error: "",
        categories: [],
        show1: false,
        rules: {
            required: (value) => !!value || "Required.",
            min: (v) => v.length >= 4 || "Min 4 characters",
        },
    }),
    methods: {
        home() {
            if (this.admin == false) {
                this.$router.push("/home");
            } else if (this.admin == true) {
                this.$router.push("/adminhome");
            }
        },
        login() {
            if (this.username == "admin" && this.password == "admin") {
                this.admin = true;
                this.$router.push("/adminhome");
                this.dialog = false;
            } else {
                this.error = "Incorrect username or password";
            }
        },
        clear() {
            this.error = "";
        },
        logout() {
            this.admin = false;
            this.$router.push("/home");
        },
    },
    created() {
        this.home();
    },
};
</script>
