import {Font} from "@react-pdf/renderer";
import regularUrl from "@/assets/fonts/NotoSansTC-Regular.ttf?url";
import boldUrl from "@/assets/fonts/NotoSansTC-Bold.ttf?url";
import {hyphenateCjk} from "./cjkLineBreak";
import {FONT_FAMILY} from "./pdfStyles";

let registered = false;

// 只註冊一次；字型 URL 隨 PDF chunk 一併 lazy load，不納入主 bundle。
export function registerFonts(): void {
    if (registered) return;
    registered = true;
    Font.register({family: FONT_FAMILY, fonts: [{src: regularUrl}, {src: boldUrl, fontWeight: 700}]});
    // `word => [word]` 會令沒有空格的中文整段無法換行（超出邊界），所以逐字拆分斷行點。
    Font.registerHyphenationCallback(hyphenateCjk);
}
