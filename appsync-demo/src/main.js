import Vue from 'vue'
import App from './App.vue'

// vue-apollo makes it easier for your vue app to interact with the apollo-client
// inside the aws-appsync package, which, in turn, coordinates the data exchanges
// between the front end store and the backend store and deals with caching etc.
import VueApollo from 'vue-apollo'
import AWSAppSyncClient from 'aws-appsync'

const config = {
 url: '<Add URL Endpoint>',
 region: 'us-west-2',
 auth: {
  type: 'API_KEY',
  apiKey: '<Add Your Key>'
 },
 disableOffline: true // this was added to stop an issue with duplicated list items
}

// The default fetchPolicy is cache-first. This means that if data
// is returned from the cache, no network request will be sent. If
// a new item is in a list, this will not be realised. So here we change
// the policy so that network requests are always sent after data is returned
// from the cache.
const options = {
 defaultOptions: {
  watchQuery: {
    fetchPolicy: 'network-only'
  },
  query: {
    fetchPolicy: 'network-only'
  }
 }
}
const client = new AWSAppSyncClient(config, options)
const appsyncProvider = new VueApollo({
 defaultClient: client
})
Vue.use(VueApollo)
Vue.config.productionTip = false
new Vue({
 render: h => h(App),
 apolloProvider: appsyncProvider
}).$mount('#app')