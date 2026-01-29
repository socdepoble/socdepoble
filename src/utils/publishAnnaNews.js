/**
 * Script to populate Anna Climent's Healthy Menu News.
 */
import { supabaseService } from '../services/supabaseService';

export const healthyPlates = [

    {
        title: "Entrepà de Calamars i Bajoca 🦑",
        content: "Una proposta clàssica de bar però en versió saludable: Pà integral, oli d'oliva verge, calamars a la planxa i bajoca verda fregida. Cuina de veritat per al nostre cos.",
        image_url: "entrep_calamars_bajoca_1769535560136.png",
        tags: ["saludable", "mar"]
    },
    {
        title: "Esgarraret Premium de la Torre 🌶️",
        content: "El secret d'un bon esgarraret: bacallar dessalat de qualitat, bajoca roja torrada al forn de llenya, molt d'all i julivert, i per descomptat, el nostre or líquid: oli d'oliva verge extra.",
        image_url: "entrep_esgarraret_premium_1769535583411.png",
        tags: ["tradició", "proteïna"]
    },
    {
        title: "Sèpia amb Tomaca Crua 🍅",
        content: "La frescor de la tomaca crua triturada combinada amb la textura de la sèpia a la planxa. Tot dins d'un bon pà integral. Simple, nutritiu i deliciós.",
        image_url: "entrep_sepia_tomaca_1769535601139.png",
        tags: ["lleuger", "fresc"]
    },
    {
        title: "Flor-i-col Arrebossada amb Ou 🥚",
        content: "Qui diu que la flor-i-col és avorrida? Arrebossada lleugerament i combinada amb un ou remenat, és un entrepà que et donarà tota l'energia necesària.",
        image_url: "entrep_floricol_ou_1769535622413.png",
        tags: ["vegetarià", "vibrant"]
    },
    {
        title: "Sofregit d'Ou amb Tomaca 🍳",
        content: "Un clàssic que mai falla. Tomaca natural sofregida lentament amb ou, servit en un bon pà de poble integral. L'esmorzar dels campions.",
        image_url: "entrep_sofregit_ou_tomaca_1769535639756.png",
        tags: ["tradició", "esmorzar"]
    },
    {
        title: "Moixama, Taperes i Ceba 🐟",
        content: "Explosió de sabors mediterranis. Moixama de qualitat, tàperes de la zona i ceba caramel·litzada. Una combinació premium per a paladars exigents.",
        image_url: "entrep_moixama_taperes_ceba_1769535659324.png",
        tags: ["mediterrani", "premium"]
    },
    {
        title: "Truita d'Espàrrecs Tendres 🌿",
        content: "La truita de creïlla de tota la vida, millorada amb espàrrecs de marge acabats de collir. Un mos de camp en cada queixalada.",
        image_url: "entrep_truita_esparrecs_tendres_1769535678703.png",
        tags: ["horta", "vegetarià"]
    },
    {
        title: "Bon Cuixot amb Tomaca Refregada 🍖",
        content: "Res com el pernil bo si es menja com cal. Pà integral crocant, tomaca refregada amb amor i oli d'oliva. La joia de la nostra gastronomia.",
        image_url: "entrep_cuixot_tomaca_refregada_1769535694157.png",
        tags: ["essencial", "qualitat"]
    }
];

export const publishAnnaNews = async () => {
    const ANNA_ID = 'anna-climent-1';
    const GROUP_NAME = 'Menjar Saludable';

    for (const plate of healthyPlates) {
        try {
            await supabaseService.createPost({
                content: plate.content,
                author_id: ANNA_ID,
                author_role: 'author',
                author_name: 'Anna Climent',
                town_name: 'Global',
                image_url: plate.image_url,
                category: 'gent',
                tags: plate.tags,
                group_id: 'menjar-saludable-1' // Correct ID for the healthy food group
            });
            console.log(`Publicada: ${plate.title}`);
        } catch (e) {
            console.error(`Error publicant ${plate.title}:`, e);
        }
    }
};
