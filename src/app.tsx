import React from "react";
import {Footer} from "./components/layout/Footer";
import {Header} from "./components/layout/Header";
import {About} from "./components/sections/About";
import {Contact} from "./components/sections/Contact";
import {Hero} from "./components/sections/Hero";
import {QuoteForm} from "./components/sections/QuoteForm";
import {Showcase} from "./components/sections/Showcase";
import {FloatingWhatsApp} from "./components/ui/FloatingWhatsApp";

export const App = () => {
    return (
        <React.Fragment>
            <Header />
            <main>
                <Hero />
                <About />
                <Showcase />
                <QuoteForm />
                <Contact />
            </main>
            <Footer />
            <FloatingWhatsApp />
        </React.Fragment>
    );
};
