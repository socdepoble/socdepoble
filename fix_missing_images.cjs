const fs = require('fs');
const path = require('path');

const dataFile = fs.readFileSync(path.join(__dirname, 'src/data.js'), 'utf8');

const replacements = {
  "/assets/avatars/comic/nano.png": "/assets/avatars/comic/nano_banana_comic.png",
  "/assets/avatars/comic/pepica.png": "/assets/avatars/comic/pepica_vall_comic.png",
  "/assets/brain/c7c302c1-d324-4124-b24a-1d7279636125/vicent_ferris_comic_avatar_1770151824722.png": "/assets/avatars/comic/vicent_ferris_comic.png",
  "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_oficial_vosc_v2_1770060040751.png": "/assets/avatars/comic/iaia_comic_matriarch.png",
  "/assets/brain/generations/nano_hort_comunitari_1774312947947.png": "/assets/brain/generations/nano_mercat_llaurador_1774197050578.png",
  "/assets/brain/c7c302c1-d324-4124-b24a-1d7279636125/rural_landscape_comic_post_1770151940141.png": "/assets/brain/generations/nano_rentonar_sega_1774196023321.png",
  "/assets/brain/c7c302c1-d324-4124-b24a-1d7279636125/ajuntament_cocentaina_icon_1770151889268.png": "/assets/brain/generations/nano_palau_comtal_1774195484197.png",
  "/assets/brain/generations/nano_rentonar_cultura.png": "/assets/brain/generations/nano_rentonar_arquitectura_1774196001924.png",
  "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/pepica_cuinera_1770056555739.png": "/assets/brain/generations/nano_rebost_1774192095512.png",
  "/assets/master/iaia_guiding_family.png": "/assets/brain/generations/nano_mixa_qa.png",
  "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/andreu_tia_style_1770057709875.png": "/assets/avatars/comic/andreu_soler_comic.png",
  "/assets/brain/generations/nano_mel_muntanya_1774198107481.png": "/assets/brain/generations/mel_nano_v2.png",
  "/assets/brain/generations/nano_oli_oliva_1774198089084.png": "/assets/brain/generations/oli_nano_v2.png",
  "/assets/brain/generations/nano_oli_alcoi_1774312962325.png": "/assets/brain/generations/oli_nano_v2.png",
  "/assets/brain/generations/nano_mel_romani_1774312978226.png": "/assets/brain/generations/mel_nano_v2.png",
  "/assets/brain/8af35100-14a2-4c77-85c9-24dbda45f6fd/nano_pericana_1772075129355.png": "/assets/brain/generations/nano_olleta_alcoi_1774235360622.png",
  "/assets/brain/8af35100-14a2-4c77-85c9-24dbda45f6fd/nano_herbero_1772075197845.png": "/assets/brain/generations/nano_olleta_alcoi_1774235360622.png",
  "/assets/brain/generations/nano_aplec_danses_1774284345110.png": "/assets/brain/generations/nano_mixa_socis.png",
  "/assets/brain/generations/nano_ple_ordinari_1774284363882.png": "/assets/brain/generations/nano_socis_tecnologics_1774235328704.png",
  "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/nanobanana_tia_style_1770057831273.png": "/assets/avatars/comic/nano_banana_comic.png",
  "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/super_ratoli_tia_style_1770057904274.png": "/assets/avatars/comic/avatar_ratoli_comic.png",
  "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/flash_tia_style_1770057846137.png": "/assets/avatars/comic/flash_comic.png",
  "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_arxiu_tia_style_1770059261040.png": "/assets/avatars/comic/iaia_comic_rebost.png",
  "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_mercat_tia_style_1770059284376.png": "/assets/avatars/comic/iaia_comic_matriarch.png",
  "/assets/brain/generations/nano_pedra_seca_notext_1774284571231.png": "/assets/brain/generations/nano_pedra_seca.png",
  "/assets/brain/8af35100-14a2-4c77-85c9-24dbda45f6fd/nano_penaguila_1772075314889.png": "/assets/brain/generations/nano_penaguila.png",
  "/assets/brain/8af35100-14a2-4c77-85c9-24dbda45f6fd/nano_benifallim_1772075376269.png": "/assets/brain/generations/nano_benifallim.png",
  "/assets/brain/generations/nano_sella_notext_1774284492475.png": "/assets/brain/generations/nano_sella.png",
  "/assets/brain/generations/nano_orxeta_notext_1774284510025.png": "/assets/brain/generations/nano_orxeta.png",
  "/assets/brain/generations/nano_relleu_notext_1774284617988.png": "/assets/brain/generations/nano_relleu.png",
  "/assets/brain/generations/nano_alcoleja_notext_1774284523308.png": "/assets/brain/generations/nano_alcoleja.png",
  "/assets/brain/generations/nano_xixona_notext_1774284540341.png": "/assets/brain/generations/nano_xixona.png",
  "/assets/brain/generations/nano_tibi_notext_1774284556611.png": "/assets/brain/generations/nano_tibi.png",
  "/javi_master.jpg": "/assets/master/Javi_Llinares-Foto_perfil-1.jpg"
};

let modifiedData = dataFile;
for (const [oldStr, newStr] of Object.entries(replacements)) {
  modifiedData = modifiedData.split(oldStr).join(newStr);
}

fs.writeFileSync(path.join(__dirname, 'src/data.js'), modifiedData, 'utf8');
console.log('data.js updated with new image paths!');
