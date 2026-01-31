export const PROVERBS = [
    { text: "A vora riu, no fages niu.", meaning: "Adverteix sobre el perill de construir en zones inundables o inestables." },
    { text: "Qui no vulga pols, que no vaja a l'era.", meaning: "Si no vols problemes, evita les situacions que els provoquen." },
    { text: "Al que té por, la por el busca.", meaning: "La por atrau allò que es tem." },
    { text: "De ponent, ni vent ni gent.", meaning: "Els vents de l'oest solen portar mala sort o mal temps." },
    { text: "Gota a gota, el mar s'esgota.", meaning: "Amb paciència i constància s'aconsegueixen grans coses." },
    { text: "A la taula i al llit, al primer crit.", meaning: "Cal ser puntual i obedient quan es tracta de menjar o descansar." },
    { text: "Qui molt abraça, poc estreny.", meaning: "Voler fer massa coses alhora sol portar a no fer-ne cap bé." },
    { text: "A l'estiu, tota cuca viu.", meaning: "A l'estiu la vida és més fàcil i alegre." },
    { text: "Home que no xarrra, no val una banya.", meaning: "La comunicació és fonamental entre les persones del poble." },
    { text: "Tants caps, tants barrets.", meaning: "Cada persona té la seua opinió." },
    { text: "A foc que no crema, no t'hi acostes.", meaning: "No busques el que no et convé." },
    { text: "Bon bategat, millor llegat.", meaning: "Viure amb passió deixa un bon record (Lema Sóc de Poble)." },
    { text: "Sóc de poble, sóc de terra, sóc de vida.", meaning: "Manifest d'identitat rural." },
    { text: "La saviesa no ocupa lloc, però dóna molt de joc.", meaning: "Elogi al coneixement." },
    { text: "Qui sembra vents, cull tempestes.", meaning: "Les males accions porten males conseqüències." },
    { text: "A cada porc li arriba el seu Sant Martí.", meaning: "Tothom acaba pagant per les seues males accions." },
    { text: "Cel a borreguets, aigua a canterets.", meaning: "Predicció meteorològica basada en la forma dels núvols." },
    { text: "Home refranyer, home punyeter.", meaning: "Refrany irònic sobre aquells que fan servir massa refranys." }
];

export const getRandomProverb = () => {
    return PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
};
