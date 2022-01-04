const Jimp = require('jimp');

module.exports = async function createCaptcha() {
    let captchaPre = Math.random().toString(36).slice(2, 8);
    let splitCaptcha = captchaPre.split("")
    for (let i = 0; i != captchaPre.length; i++) {
        if (Math.round(Math.random(0,1)) == 1) {
            splitCaptcha[i] = splitCaptcha[i].toUpperCase()
        }
    }
    const captcha = splitCaptcha.join("");
    const image = new Jimp(300, 70, 'black');
    const font = await Jimp.loadFont(`${__dirname}/font/Montserrat-BlackItalic.fnt`)
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    const textWidth = Jimp.measureText(font, captcha);
    const textHeight = Jimp.measureTextHeight(font, captcha);
    image.print(font, (w/2 - textWidth/2), (h/2 - textHeight/2), captcha);
    image.write(`${__dirname}/captchas/${captcha}.png`);
    return captcha;
}