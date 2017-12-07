import Vue from 'vue'
import Router from 'vue-router'
import { Menu, Dropdown, Icon, Card, Tooltip } from 'iview'
import { Row, Col } from 'iview/src/components/grid'
import VueSocketio from 'vue-socket.io'

Vue.component('Menu', Menu)
Vue.component('MenuItem', Menu.Item)
Vue.component('Dropdown', Dropdown)
Vue.component('DropdownMenu', Dropdown.Menu)
Vue.component('DropdownItem', Dropdown.Item)
Vue.component('Icon', Icon)
Vue.component('Card', Card)
Vue.component('Row', Row)
Vue.component('Col', Col)
Vue.component('Tooltip', Tooltip)

Vue.use(Router)
Vue.use(VueSocketio, '/')

const Layout = (resolve) => {
    import('components/layout').then((module) => resolve(module))
}

const Hall = (resolve) => {
    import('components/hall').then((module) => resolve(module))
}

const Room = (resolve) => {
    import('components/room').then((module) => resolve(module))
}

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'layout',
            component: Layout,
            redirect: 'hall',
            children: [{
                path: '/hall',
                name: 'hall',
                component: Hall
            },
            {
                path: '/room/:id',
                name: 'room',
                component: Room
            }]
        }
    ]
})
