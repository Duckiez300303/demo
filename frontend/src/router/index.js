import { createRouter, createWebHistory } from "vue-router";

import dashboard from "../pages/master/dashboard.vue";
import user from "../pages/user.vue";
import voucher from "../pages/voucher.vue";
import user_voucher from "../pages/user_voucher.vue";

const routes = [
    {
        name: 'Dashboard',
        path: '/',
        component: dashboard,
        children: [
            { name: 'user', path: '/user', component: user },
            { name: 'voucher', path: '/voucher', component: voucher },
            { name: 'user_voucher', path: '/user_voucher', component: user_voucher },
        ]
    },
];

const router = Router();
export default router;
function Router() {
    const router = new createRouter({
        history: createWebHistory(),
        routes,
    });
    return router;
}