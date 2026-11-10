import { createRouter, createWebHistory } from "vue-router"

import IniCio from '../components/IniCio.vue'
import XestionPaciente from '../components/XestionPaciente.vue'
import SobreNos from '../components/SobreNos.vue'
import AvisoLegal from '../components/AvisoLegal.vue'
import NotFound from '../components/NotFound.vue'
import PoliticaPrivacidad from "../components/PoliticaPrivacidad.vue"
import XestionDoctores from "../components/XestionDoctores.vue"
import XestionCitas from "../components/XestionCitas.vue"

// As rutas específicas van antes da ruta comodín, que amosa a páxina 404.
const routes = [
    {path: '/', name: 'IniCio', component: IniCio},
    {path: '/sobrenos', name: 'SobreNos', component: SobreNos},
    {path: '/avisolegal', name: 'AvisoLegal', component: AvisoLegal},
    {path: '/politica-privacidad', name: 'PoliticaPrivacidad', component: PoliticaPrivacidad},
    {path: '/xestion-pacientes', name: 'XestionPaciente', component: XestionPaciente},
    {path: '/xestion-doctores', name: 'XestionDoctores', component: XestionDoctores},
    {path: '/xestion-citas', name: 'XestionCitas', component: XestionCitas},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router