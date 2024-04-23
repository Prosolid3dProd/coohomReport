import { Sol, Luna } from "../icons";
import { useState, useEffect } from "react";

const ModoNoche = () => {
    const [modoNoche, setModoNoche] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setModoNoche(mediaQuery.matches);

        const handleChange = (e) => {
            setModoNoche(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", modoNoche);
    }, [modoNoche]);

    return (
        <button
            onClick={() => setModoNoche(modo => !modo)}
            className={modoNoche ? "dark" : ""}
        >
            {modoNoche
                ? <Sol className="text-yellow-600 transition-all ease-in duration-150 hover:rotate-45 hover:brightness-125" />
                : <Luna className="text-blue/75 transition-all ease-in duration-150 hover:rotate-45 hover:brightness-75" />}
        </button>
    );
};

export default ModoNoche;
