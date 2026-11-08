import React from "react";
import {Path, Svg} from "@react-pdf/renderer";

// 與 public/logo.svg 使用同一條 path；react-pdf 的 <Image> 不支援 SVG 檔，所以直接繪製向量。
const LOGO_PATH = "M0,14C0,6.27,6.27,0,14,0h36c7.73,0,14,6.27,14,14v36c0,7.73-6.27,14-14,14H14c-7.73,0-14-6.27-14-14V14ZM15.25,11.5v41h33.5v-9h-24.5v-23h24.5v-9H15.25ZM32,26v12h12v-12h-12Z";

export const CompanyLogo = (props: {size: number}) => {
    const {size} = props;
    return (
        <Svg width={size} height={size} viewBox="0 0 64 64">
            <Path d={LOGO_PATH} fill="#000" />
        </Svg>
    );
};
