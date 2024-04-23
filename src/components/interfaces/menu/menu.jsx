import { useState, useEffect } from "react";
import BotonPlegar from "./botonPlegar";
import Lista from "./lista";

const Menu = () => {
  const root = document.getElementById("root");
  const [change, setChange] = useState(false);
  localStorage.setItem("MenuDesp", change);
  const [mostrarTexto, setmostrarTexto] = useState(true);
  const ruta = window.location.pathname.split("/");

  const onClick = () => {
    root.classList.toggle("rootLayout");
    setChange((c) => !c);
    setmostrarTexto((b) => !b);
  };

  return (
    <aside className="col-span-1 row-start-2 row-span-2 bg-gray flex flex-col gap-4">
      <ul className="flex items-center h-full w-full flex-col pt-4 list-disc [&>*:last-child]:absolute [&>*:last-child]:bottom-4 relative">
        <BotonPlegar fn={onClick} change={change} />
        <Lista change={change} textShown={mostrarTexto} />
      </ul>
    </aside>
  );
};

export default Menu;
