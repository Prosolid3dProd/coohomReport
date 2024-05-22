import { lista as items } from "./menuData";
import { listaCliente as itemsCliente } from "./menuData";

import { NavLink } from "react-router-dom";

import { CONFIG } from "../../../data/constants";

const Item = ({ name, Icon, textShown, id }) => (
  <li className="w-full">
    <NavLink
      key={id}
      to={`${name}`}
      className="w-full flex flex-row justify-center items-center border-b border-transparent focus:text-blue pb-2 pt-2 hover:bg-gray-200 transition duration-400 ease-out hover:ease-in lg:justify-start pl-3 max-[1023px]:pl-0 text-gray-400"
    >
      <Icon className="w-8 h-8 flex self-center cursor-pointer" />
      {textShown && (
        <p className="cursor-pointer ml-3 max-[1024px]:hidden">{name}</p>
      )}
    </NavLink>
  </li>
);

const Lista = ({ change, textShown }) => {
  if (localStorage.getItem("campaign") === CONFIG.ROLE.ADMIN) {
    return items?.map(({ id, name, icon }) => (
      <Item
    key={id}
    id={id}
    name={name}
    Icon={icon}
    textShown={change ? false : textShown}
  />
    ));
  }
  if (localStorage.getItem("campaign") === CONFIG.ROLE.CLIENT) {
    return itemsCliente?.map(({ id, name, icon }) => (
      <Item
      key={id}
      id={id}
      name={name}
      Icon={icon}
      textShown={change ? false : textShown}
    />
    ));
  }
};


export default Lista;
