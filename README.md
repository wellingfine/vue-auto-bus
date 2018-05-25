
# About

A simple global event bus tool for Vue2. This tool will delete all relevant events when Vue object is destoryed.


# usage

```javascript
var vab=require('vue-auto-bus'); 
Vue.use(vab);
```

In your-single.vue file:
```javascript
export default {
	mounted(){
		//any where in vue file

		//listen
		this.$bus.on('your-event-name',()=>{
			// do something
		})

		// send event
		this.$bus.emit('your-event-name','anything')
	},
	
	// or 
	$bus:{
		
	}
}


```



# TODO

* test case
* more document
* bus helper

