import re

with open('src/data/index.js', 'r') as f:
    data = f.read()

local_images = [
    "/assets/uploads/brain/hero_panoramic_landscape_1774710654078.png",
    "/assets/uploads/brain/art_trellat_farmer_1774708525806.png",
    "/assets/uploads/brain/nano_mercat_llaurador_1774197050578.png",
    "/assets/uploads/brain/aplec_danses_1774952191348.png",
    "/assets/uploads/brain/nano_mel_font_roja_1774216345755.png",
    "/assets/uploads/brain/art_trellat_v2_1774708257858.png",
    "/assets/uploads/brain/hero_serrella_comic_1774709602282.png",
    "/assets/uploads/brain/nano_oli_oliva_1774198089084.png",
    "/assets/uploads/brain/collita_pomes_valencia_1779774496548.png",
    "/assets/uploads/brain/nano_dron_agricola_1774304886750.png",
    "/assets/uploads/brain/nano_porta_signada_1774195575764.png",
    "/assets/uploads/brain/nano_sorra_pedra_seca_1774216330218.png",
    "/assets/uploads/brain/nano_rosa_horta_1774196037465.png",
    "/assets/uploads/brain/sopar_germanor_logo_1774393503308.png",
    "/assets/uploads/brain/nano_taula_olivera_1774216315176.png",
    "/assets/uploads/brain/nano_olleta_alcoi_1774235360622.png",
    "/assets/uploads/brain/ametlles_campanya_logo_1774393473416.png",
    "/assets/uploads/brain/nano_hort_comunitari_1774312947947.png",
    "/assets/uploads/brain/nano_rentonar_sega_1774196023321.png",
    "/assets/uploads/poble/cocentaina/cover.jpg",
    "/assets/uploads/poble/penaguila/cover.jpg",
    "/assets/uploads/poble/la-torre/cover.jpg",
    "/assets/uploads/poble/benifallim/cover.jpg",
    "/assets/uploads/poble/xativa/cover.jpg",
    "/assets/uploads/poble/morella/cover.jpg"
]

idx = 0
def repl(match):
    global idx
    img = local_images[idx % len(local_images)]
    idx += 1
    return img

new_data = re.sub(r'https://picsum\.photos/seed/[^/]+/\d+/\d+', repl, data)

with open('src/data/index.js', 'w') as f:
    f.write(new_data)

print("Images replaced with local assets!")
