import { useState, useEffect } from "react";
import BotonPlegar from "./botonPlegar";
import Lista from "./lista";

const Menu = () => {
  const root = document.getElementById("root");
  const [change, setChange] = useState(() => {
    return localStorage.getItem("MenuDesp") === "true";
  });
  const [mostrarTexto, setMostrarTexto] = useState(true);

  useEffect(() => {
    localStorage.setItem("MenuDesp", change);
  }, [change]);

  const onClick = () => {
    root.classList.toggle("rootLayout");
    setChange((prevChange) => !prevChange);
    setMostrarTexto((prevMostrarTexto) => !prevMostrarTexto);
  };

  return (
    <aside className="col-span-1 row-start-2 row-span-2 bg-gray flex flex-col gap-4">
      <ul className="flex items-center h-full w-full flex-col pt-4 list-disc relative">
        <BotonPlegar fn={onClick} change={change} />
        <Lista change={change} textShown={mostrarTexto} />
      </ul>
    </aside>
  );
};

export default Menu;
