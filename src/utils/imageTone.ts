export type ImageTone = "light" | "dark";

const SAMPLE_SIZE = 24;
const LIGHT_THRESHOLD = 0.6;

// 取圖片中間區域（文字所在位置）嘅平均相對亮度，判斷係淺色定深色
export function detectImageTone(img: HTMLImageElement): ImageTone | null {
    try {
        const canvas = document.createElement("canvas");
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        const ctx = canvas.getContext("2d", {willReadFrequently: true});
        if (!ctx) return null;

        const sx = img.naturalWidth * 0.2;
        const sy = img.naturalHeight * 0.3;
        const sw = img.naturalWidth * 0.6;
        const sh = img.naturalHeight * 0.4;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        const {data} = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        let total = 0;
        for (let i = 0; i < data.length; i += 4) {
            total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        }
        const luminance = total / (data.length / 4) / 255;
        return luminance > LIGHT_THRESHOLD ? "light" : "dark";
    } catch {
        // 跨域圖片冇 CORS header 時 canvas 會被 taint，維持預設
        return null;
    }
}
