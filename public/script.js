// import Vue from "vue";

let LOAD_NUM = 4
let watcher


new Vue({
    el: "#app",
    data: {
        total: 0,
        search: "cat",
        products: [],
        cart: [],
        loading: false,
        lastSearch: "",
        results: []
    },
    methods: {
        addToCart: function (product) {
            // console.log(product.id)
            let found = false
            this.total += product.price
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === product.id) {
                    found = true
                    this.cart[i].qty++
                    // console.log('inc');
                }
            }
            if (!found) {
                this.cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    qty: 1,
                })
            }
        },
        increment(item) {
            this.total += item.price
            // this.cart.find(a => a.id === item.id).qty += 1
            item.qty++
        },
        decrement(item) {
            this.total -= item.price
            item.qty--
            if (item.qty <= 0) {
                this.cart.splice(this.cart.indexOf(item), 1)
            }
        },
        onSubmit() {
            this.lastSearch = this.search
            this.$http.get(`http://localhost:3000/search?q=${this.search}`)
                .then(response => {
                    // console.log(response.data);
                    this.products = []
                    this.results = []
                    this.results = response.body
                    this.loading = true
                    this.loading = false
                    this.appendResults()
                })
        },
        appendResults() {
            if (this.products.length < this.results.length) {
                this.appendTo = this.results.slice(
                    this.products.length,
                    LOAD_NUM + this.products.length
                )
                this.products = this.products.concat(this.appendTo)
            }
        }
    },
    filters: {
        currency: function (price) {
            return `$${price.toFixed(2)}`
        }
    },
    created() {
        this.onSubmit()
    },
    updated() {
        const sensor = document.getElementById('product-list-bottom')
        watcher = scrollMonitor.create(sensor)
        watcher.enterViewport(this.appendResults)
    },
    beforeUpate() {
        if (watcher) {
            watcher.destroy()
            watcher = null
        }
    }
})


