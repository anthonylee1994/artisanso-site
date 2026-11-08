import React from "react";
import {Text} from "@react-pdf/renderer";
import {pdfStyles as s} from "../pdfStyles";

export const PdfFooter = () => {
    return <Text style={s.footer} fixed render={({pageNumber, totalPages}) => `第 ${pageNumber} 頁，共 ${totalPages} 頁`} />;
};
