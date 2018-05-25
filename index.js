/**
 * vue-auto-bus 
 * A simple event bus tool.
 */
; (function () {
	var vueBus = {}

	vueBus.install = function (Vue) {
		var version = Number(Vue.version.split('.')[0])
		if (version < 2) {
			throw Error('Vue version must > 2')

			return
		}

		var eventList = {}
		var uidHash = {}
		// window.el=eventList;window.uh=uidHash

		var bus = {
			on: function (name, fn) {
				// console.log('bus this',this)
				if (typeof fn != 'function') {
					throw new Error('Listener must be function');
					return;
				}
				eventList[name] = eventList[name] || []
				eventList[name].push(fn)

				//save this event to 
				uidHash[this._uid] = uidHash[this._uid] || []
				uidHash[this._uid].push([name, fn])
			},
			emit: function (name, ...args) {
				var fns = eventList[name] || []

				for (let i = 0; i < fns.length; i++) {
					fns[i].apply(this, args)
				}
			},
		}

		Vue.mixin({
			beforeCreate: function () {
				// create a link to uid
				this.$bus = {
					_uid: this._uid,
					on: bus.on,
					$on: bus.on,
					emit: bus.emit,
					$emit: bus.emit,
				}

				var busConfigList = this.$options.$bus
				for (var name in busConfigList) {
					var fn = busConfigList[name].bind(this)

					this.$bus.on(name, fn)
				}
			},
			beforeDestroy: function () {
				//clear all events

				var uidList = uidHash[this._uid] || []
				for (let i = 0; i < uidList.length; i++) {
					var [name, fn] = uidList[i];

					var els = eventList[name]
					for (let j = 0; j < els.length;) {
						if (els[j] == fn) {
							els.splice(j, 1)
						} else {
							j++
						}
					}

					if (els.length == 0) {
						delete eventList[name]
					}
				}
				delete uidHash[this._uid]
			}
		})
	}


	// if module
	if (typeof exports === 'object') {
		module.exports = vueBus; return
	}
	if (typeof define === 'function' && define.amd) {
		define([], function () { return vueBus });
		return
	}
	// if direct include
	if (typeof window !== 'undefined' && window.Vue) {
		window.VueBus = vueBus
		window.Vue.use(vueBus) //auto-activation
	}
})()