/**
 * Mock data repository for Lore Personas
 * Enriching profiles with authentic content reflecting their social context.
 */

export const MOCK_LORE_POSTS = {
    // Vicent Ferris (Woodworker)
    '11111111-1111-4111-a111-000000000001': [
        {
            id: 'lp-v1',
            content: "Acabant de restaurar la porta principal de la Masia del Pi. La fusta de roure té una vida eterna si se sap cuidar. #Artesania #LaTorre",
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            author_id: '11111111-1111-4111-a111-000000000001',
            author_name: 'Vicent Ferris',
            author_role: 'ambassador',
            image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop'
        },
        {
            id: 'lp-v2',
            content: "Hui m'han arribat uns taulons d'olivera que són una meravella. Ja estic pensant quina taula eixirà d'ací. Bon dia poble!",
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            author_id: '11111111-1111-4111-a111-000000000001',
            author_name: 'Vicent Ferris',
            author_role: 'ambassador'
        }
    ],
    // Maria "Mèl" (Beekeeper)
    '11111111-1111-4111-a111-000000000004': [
        {
            id: 'lp-m1',
            content: "Les abelles ja estan treballant de valent amb el romer. Enguany la mèl de primavera serà espectacular. Si algú vol passar-se pel mas, ja estem verolant!",
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            author_id: '11111111-1111-4111-a111-000000000004',
            author_name: 'Maria "Mèl"',
            author_role: 'user',
            image_url: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=2081&auto=format&fit=crop'
        },
        {
            id: 'lp-m2',
            content: "Sempre m'ha agradat vore com el poble es desperta des de dalt del vessant de la muntanya. Quina sort tenim de viure ací.",
            created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            author_id: '11111111-1111-4111-a111-000000000004',
            author_name: 'Maria "Mèl"',
            author_role: 'user'
        }
    ],
    // Elena Popova (Caregiver)
    '11111111-1111-4111-a111-000000000003': [
        {
            id: 'lp-e1',
            content: "Hui hem fet una passejada fins a la font amb la senyora Amparo. L'aire de la Torre és el millor remei per a tot.",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            author_id: '11111111-1111-4111-a111-000000000003',
            author_name: 'Elena Popova',
            author_role: 'user',
            image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1920&auto=format&fit=crop'
        }
    ],
    // Joan Batiste (Shepherd)
    '11111111-1111-4111-a111-000000000012': [
        {
            id: 'lp-j1',
            content: "Pels camins de l'Aitana, hui no fa gens de calor. Les cabres tenen bon pasturage sota l'ombra dels pins.",
            created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
            author_id: '11111111-1111-4111-a111-000000000012',
            author_name: 'Joan Batiste',
            author_role: 'user'
        }
    ],
    // Lucía Belda (Pharmacist)
    '11111111-1111-4111-a111-000000000002': [
        {
            id: 'lp-l1',
            content: "Compte amb el sol de migdia, que a la muntanya pica més del que pensem! Poseu-vos crema i beveu molta aigua.",
            created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
            author_id: '11111111-1111-4111-a111-000000000002',
            author_name: 'Lucía Belda',
            author_role: 'ambassador'
        }
    ],
    // Damià (Arquitecte)
    'damia-arq-1': [
        {
            id: 'lp-d1',
            content: "Revisitant les mides de la Masia de l'Arquitecte. El futur de Sóc de Poble es construeix sobre fonaments sòlids i identitat de terra. Gràcies per la vostra confiança!",
            created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
            author_id: 'damia-arq-1',
            author_name: 'Damià',
            author_role: 'official',
            image_url: '/Users/javillinares/.gemini/antigravity/brain/493388f8-1740-4544-959f-ae5585256501/architect_collection_portrait_1769437639992.png'
        },
        {
            id: 'lp-d2',
            content: "Dissenyant el nou sistema de xat de proximitat. Volem que la tecnologia se senta com una conversa a la fresca de la plaça. #Arquitecte #Genius",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            author_id: 'damia-arq-1',
            author_name: 'Damià',
            author_role: 'official'
        }
    ]
};

export const MOCK_LORE_ITEMS = {
    // Vicent Ferris
    '11111111-1111-4111-a111-000000000001': [
        {
            id: 'li-v1',
            title: "Taula de centre en olivera",
            description: "Taula de centre única, feta a mà amb fusta d'olivera local. Acabat natural amb cera d'abelles del poble.",
            price: "180€",
            category_slug: "products",
            image_url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop',
            author_id: '11111111-1111-4111-a111-000000000001'
        }
    ],
    // Maria "Mèl"
    '11111111-1111-4111-a111-000000000004': [
        {
            id: 'li-m1',
            title: "Pot de Mèl de Romer (1kg)",
            description: "Mèl pura de romer de la Serra d'Aitana. Collita pròpia. Totalment natural i sense additius.",
            price: "12€",
            category_slug: "products",
            image_url: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=2081&auto=format&fit=crop',
            author_id: '11111111-1111-4111-a111-000000000004'
        }
    ],
    // Elena Popova
    '11111111-1111-4111-a111-000000000003': [
        {
            id: 'li-e1',
            title: "Acompanyament i cures",
            description: "Ajuda amb la compra, gestions o simplement companyia per a gent gran. Tinc referències al poble.",
            price: "A consultar",
            category_slug: "services",
            author_id: '11111111-1111-4111-a111-000000000003'
        }
    ],
    // Joan Batiste
    '11111111-1111-4111-a111-000000000012': [
        {
            id: 'li-j1',
            title: "Formatge de cabra artesà",
            description: "Formatge fresc fet amb llet de les meues cabres cada matí. Pura tradició de Benifallim.",
            price: "8€/peça",
            category_slug: "products",
            author_id: '11111111-1111-4111-a111-000000000012'
        }
    ]
};
