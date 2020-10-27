<template>
<v-app>
    <ApolloQuery :query="require('@/graphql/queries/categories.gql')">
        <!-- The result will automatically updated -->
        <template slot-scope="{ result: { data }, isLoading }">
            <!-- Some content -->

            <v-card id="tabs">
                <v-tabs v-if="isLoading">
                    <v-tab>Loading...</v-tab>
                </v-tabs>
                <v-tabs v-else>
                    <v-tab @click="showall()">All({{ totalproducts }})</v-tab>
                    <v-tab v-for="datas of data.categories" :key="datas.id" @click="sort(datas.Name)">{{ datas.Name }}</v-tab>
                </v-tabs>
            </v-card>
        </template>
    </ApolloQuery>

    <div class="container1">
        <div class="text-center" id="pag">
            <v-pagination v-model="page" color="#282d32" :length="3" circle></v-pagination>
            <div id="search">
                <v-text-field label="Solo" placeholder="Search a product" solo></v-text-field>
                <v-btn style="margin-top: 5px; color: white;" color="#282d32" large>
                    <svg id="search-btn" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" class="svg-inline--fa fa-search fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                    </svg>
                </v-btn>
            </div>
        </div>

        <div class="products">
            <v-card v-for="datas in allproducts" :key="datas.id" class="mx-auto" max-width="220">
                <v-img src="../../assets/iphone.jpg" height="180px"></v-img>

                <v-card-title>
                    {{ datas.Name }}
                </v-card-title>

                <v-card-subtitle> ₱{{ datas.Price / 100 }} </v-card-subtitle>
                <v-card-subtitle>
                    {{ datas.Description }}
                </v-card-subtitle>

                <v-card-actions>
                    <v-btn color="#282d32 lighten-2" @click="editProduct(datas.id)" text>
                        Edit
                    </v-btn>
                    <v-btn color="#282d32 lighten-2" @click="deleteProduct(datas.id)" text>
                        Delete
                    </v-btn>

                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </div>

        <div class="add">
            <v-speed-dial v-model="fab" :top="top" :bottom="bottom" :right="right" :left="left" :direction="direction" :open-on-hover="hover" :transition="transition">
                <template v-slot:activator>
                    <v-btn v-model="fab" @click="allcateg" color="blue darken-2" dark fab>
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="svg-inline--fa fa-plus fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
                        </svg>
                    </v-btn>
                </template>
                <v-dialog v-model="dialog" persistent max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn fab dark small color="green" v-bind="attrs" v-on="on">
                            P
                        </v-btn>
                    </template>
                </v-dialog>
                <v-dialog v-model="dialog1" persistent max-width="600px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn fab dark small color="indigo" v-bind="attrs" v-on="on">
                            C
                        </v-btn>
                    </template>
                </v-dialog>
            </v-speed-dial>
        </div>

        <!--------- ADD PRODUCT DIALOG ------->
        <v-row justify="center">
            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <form method="POST" @submit.prevent="addProduct">
                        <v-card-title>
                            <span class="headline">Add Product</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field label="Product Name*" v-model="newproduct.name" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field label="Product Description*" type="text" v-model="newproduct.description" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Price (₱)*" type="number" v-model="newproduct.price" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select v-bind:items="allcategories" v-model="category" @change="selectCategoryID" label="Product Category*"></v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog = false">
                                Close
                            </v-btn>
                            <v-btn color="blue darken-1" type="submit">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </form>
                </v-card>
            </v-dialog>
        </v-row>

        <!--------- EDIT PRODUCT DIALOG ------->
        <v-row justify="center">
            <v-dialog v-model="dialog2" persistent max-width="600px">
                <v-card>
                    <form method="POST" @submit.prevent="updateProduct(editproduct.id)">
                        <v-card-title>
                            <span class="headline">Edit Product</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field label="Product Name*" v-model="editproduct.name" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-text-field label="Product Description*" type="text" v-model="editproduct.description" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Price (₱)*" type="number" v-model="editproduct.price" required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select v-bind:items="allcategories" v-model="editproduct.category" @change="selectCategoryID1" label="Product Category*"></v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog2 = false">
                                Close
                            </v-btn>
                            <v-btn color="blue darken-1" type="submit">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </form>
                </v-card>
            </v-dialog>
        </v-row>

        <!--------- ADD PRODUCT CATEGORY ------->

        <v-row justify="center">
            <v-dialog v-model="dialog1" persistent max-width="600px">
                <v-card>
                    <form method="POST" @submit.prevent="addCategory">
                        <v-card-title>
                            <span class="headline">Add Product Category</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field label="Product Category Name*" v-model="newcategory" required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog1 = false">
                                Close
                            </v-btn>
                            <v-btn type="submit" color="blue darken-1" text>
                                Save
                            </v-btn>
                        </v-card-actions>
                    </form>
                </v-card>
            </v-dialog>
        </v-row>
    </div>
</v-app>
</template>

<script>
import swal from "sweetalert";
import gql from "graphql-tag";
import addcategory from "@/graphql/mutations/addcategory.gql";
import addproduct from "@/graphql/mutations/addproduct.gql";
import editproduct from "@/graphql/mutations/editproduct.gql";
import deleteproduct from "@/graphql/mutations/deleteproduct.gql";
export default {
    data: () => ({
        page: 1,
        direction: "top",
        fab: false,
        fling: false,
        hover: false,
        tabs: null,
        top: false,
        right: true,
        bottom: true,
        left: false,
        transition: "slide-y-reverse-transition",
        dialog: false,
        dialog1: false,
        dialog2: false,
        categories: [],
        totalproducts: 0,
        category: "",
        products: [],
        allcategories: [],
        allproducts: [],
        newcategory: "",
        newproduct: {
            name: "",
            description: "",
            price: "",
            categoryid: 0,
        },
        editproduct: {
            name: "",
            description: "",
            price: "",
            category: "",
            categoryid: 0,
        },
    }),
    methods: {
        allcateg() {
            for (let x = 0; x < this.categories.length; x++) {
                this.allcategories.push(this.categories[x].Name);
            }
            this.totalproducts = this.products.length;
        },
        selectCategoryID() {
            for (let x = 0; this.categories.length; x++) {
                if (this.category == this.categories[x].Name) {
                    console.log(this.categories[x].id);
                    this.newproduct.categoryid = this.categories[x].id;
                }
            }
        },
        selectCategoryID1() {
            for (let x = 0; this.categories.length; x++) {
                if (this.category == this.categories[x].Name) {
                    console.log(this.categories[x].id);
                    this.editproduct.categoryid = this.categories[x].id;
                }
            }
        },
        addCategory() {
            //alert(this.newcategory);
            this.$apollo
                .mutate({
                    mutation: addcategory,
                    variables: {
                        Name: this.newcategory,
                    },
                })
                .then(() => {
                    this.dialog1 = false;
                    swal({
                        title: "Success",
                        text: "You added new category",
                        icon: "success",
                        button: "OK",
                    });
                })
                .catch((error) => {
                    console.error(error);
                    console.log(this.newcategory);
                });
        },
        addProduct() {
            this.$apollo
                .mutate({
                    mutation: addproduct,
                    variables: {
                        Name: this.newproduct.name,
                        Description: this.newproduct.description,
                        Price: this.newproduct.price * 100,
                        Status: true,
                        category_id: this.newproduct.categoryid,
                    },
                })
                .then(() => {
                    this.dialog = false;
                    swal({
                        title: "Success",
                        text: "You added new product",
                        icon: "success",
                        button: "OK",
                    });
                })
                .catch((error) => {
                    console.error(error);
                    console.log(this.newcategory);
                });
        },
        sort(name) {
            this.allproducts = [];
            for (let x = 0; x < this.products.length; x++) {
                if (this.products[x].category.Name == name) {
                    let temp = {
                        Name: this.products[x].Name,
                        Description: this.products[x].Description,
                        Price: this.products[x].Price,
                    };
                    this.allproducts.push(temp);
                }
            }
        },
        allproducts1() {
            this.allproducts = this.products;
        },
        showall() {
            this.allproducts = [];
            this.allproducts = this.products;
        },
        editProduct(id) {
            this.allcateg();
            this.dialog2 = true;
            for (let x = 0; x < this.products.length; x++) {
                if (this.products[x].id == id) {
                    this.editproduct.id = this.products[x].id;
                    this.editproduct.name = this.products[x].Name;
                    this.editproduct.description = this.products[x].Description;
                    this.editproduct.price = this.products[x].Price / 100;
                    this.editproduct.category = this.products[x].category.Name;
                }
            }
        },
        deleteProduct(id) {
            swal({
                title: "Are you sure?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    this.$apollo
                        .mutate({
                            mutation: deleteproduct,
                            variables: {
                                id: id,
                            },
                        })
                        .then(() => {
                            this.dialog2 = false;
                            swal("Deleted Successful", {
                                icon: "success",
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            console.log(this.newcategory);
                        });
                } else {
                    swal("The product is not deleted!");
                }
            });
        },
        updateProduct(id) {
            this.$apollo
                .mutate({
                    mutation: editproduct,
                    variables: {
                        id: id,
                        Name: this.editproduct.name,
                        Description: this.editproduct.description,
                        Price: this.editproduct.price * 100,
                        Status: true,
                        category_id: this.editproduct.categoryid,
                    },
                })
                .then(() => {
                    this.dialog2 = false;
                    swal({
                        title: "Success",
                        text: "You edited the product",
                        icon: "success",
                        button: "OK",
                    });
                })
                .catch((error) => {
                    console.error(error);
                    console.log(this.newcategory);
                });
        },
    },
    apollo: {
        categories: gql `
      {
        categories {
          id
          Name
        }
      }
    `,
        products: gql `
      {
        products {
          id
          Name
          Description
          Price
          category {
            Name
          }
        }
      }
    `,
    },
    mounted() {
        this.allcateg();
        this.allproducts1();
    },
    created() {
        this.allcateg();
        this.allproducts1();
    },
    computed: {
        activeFab() {
            switch (this.tabs) {
                case "one":
                    return {
                        class: "purple",
                            icon: "account_circle",
                    };
                case "two":
                    return {
                        class: "red",
                            icon: "edit",
                    };
                case "three":
                    return {
                        class: "green",
                            icon: "keyboard_arrow_up",
                    };
                default:
                    return {};
            }
        },
    },

    watch: {
        top(val) {
            this.bottom = !val;
        },
        right(val) {
            this.left = !val;
        },
        bottom(val) {
            this.top = !val;
        },
        left(val) {
            this.right = !val;
        },
    },
};
</script>
