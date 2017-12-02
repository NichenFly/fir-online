import Vue from 'vue'
import Router from 'vue-router'
import { Menu, Dropdown, Icon } from 'iview'

Vue.component('Menu', Menu)
Vue.component('Dropdown', Dropdown)
Vue.component('Icon', Icon)
Vue.component('DropdownMenu', Dropdown.Menu)
Vue.component('DropdownItem', Dropdown.Item)

Vue.use(Router)

const Layout = (resolve) => {
    import('components/layout').then((module) => resolve(module))
}

const Room = (resolve) => {
    import('components/room').then((module) => resolve(module))
}

const Chess = (resolve) => {
    import('components/chess').then((module) => resolve(module))
}

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'layout',
            component: Layout,
            redirect: 'room',
            children: [{
                path: '/room',
                name: 'room',
                component: Room
            },
            {
                path: '/chess',
                name: 'chess',
                component: Chess
            }]
        }
    ]
})
