import Vue from 'vue'
import App from './App.vue'
import ApolloClient from "apollo-boost"
import VueApollo from "vue-apollo"

Vue.config.productionTip = false

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    uri: "http://localhost:4000/graphql"
  })
})

Vue.use(apolloProvider);

new Vue({
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
