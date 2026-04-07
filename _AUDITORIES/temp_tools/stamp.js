const Jimp = require('jimp');

const avatars = [
    { name: 'Súper Ratolí', src: '/Users/javillinares/.gemini/antigravity/brain/70bf0ea2-26ba-49ee-a8a7-e4133a8e5596/avatar_ratoli_base_1772224401184.png', dest: '../public/assets/avatars/comic/avatar_ratoli_comic.png' },
    { name: 'Mixa', src: '/Users/javillinares/.gemini/antigravity/brain/70bf0ea2-26ba-49ee-a8a7-e4133a8e5596/mixa_base_1772224414965.png', dest: '../public/assets/avatars/comic/mixa_comic.png' },
    { name: 'Flash', src: '/Users/javillinares/.gemini/antigravity/brain/70bf0ea2-26ba-49ee-a8a7-e4133a8e5596/flash_base_1772224429602.png', dest: '../public/assets/avatars/comic/flash_comic.png' },
    { name: 'Sultan', src: '/Users/javillinares/.gemini/antigravity/brain/70bf0ea2-26ba-49ee-a8a7-e4133a8e5596/sultan_base_1772224442128.png', dest: '../public/assets/avatars/comic/sultan_comic.png' }
];

async function run() {
    try {
        const logo = await Jimp.read('../public/assets/master/logo_socdepoble_white_full.png');
        logo.resize(250, Jimp.AUTO);

        const fontWhite = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        const fontBlack = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        const fontLargeWhite = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        const fontLargeBlack = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
        
        for (const item of avatars) {
            console.log("Processing", item.name);
            const img = await Jimp.read(item.src);
            
            img.composite(logo, 50, 40);

            const wm = "Creat per Nano Banana";
            const wmWidth = Jimp.measureText(fontWhite, wm);
            const textX = img.bitmap.width - wmWidth - 40;
            const textY = img.bitmap.height - 70;
            
            img.print(fontBlack, textX + 2, textY + 2, wm);
            img.print(fontWhite, textX, textY, wm);

            const nWidth = Jimp.measureText(fontLargeWhite, item.name);
            const nX = (img.bitmap.width - nWidth) / 2;
            const nY = img.bitmap.height - 100;
            
            img.print(fontLargeBlack, nX + 3, nY + 3, item.name);
            img.print(fontLargeWhite, nX, nY, item.name);

            await img.writeAsync(item.dest);
            console.log("Saved", item.dest);
        }
    } catch (e) {
        console.error("Error drawing stamp:", e);
    }
}
run();
