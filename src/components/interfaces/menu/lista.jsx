import { lista as items } from "./menuData";
import { listaCliente as itemsCliente } from "./menuData";
import { NavLink } from "react-router-dom";
import { CONFIG } from "../../../data/constants";

const Item = ({ name, Icon, textShown }) => (
  <NavLink
    to={`${name}`}
    className="w-full flex flex-row justify-center items-center border-b border-transparent focus:text-blue pb-2 pt-2 hover:bg-gray-200 transition duration-400 ease-out hover:ease-in lg:justify-start pl-3 max-[1023px]:pl-0 text-gray-400"
  >
    <Icon className="w-8 h-8 flex self-center cursor-pointer" />
    {textShown && (
      <p className="cursor-pointer ml-3 max-[1024px]:hidden">{name}</p>
    )}
  </NavLink>
);

const Lista = ({ change, textShown }) => {
  const campaign = localStorage.getItem("campaign");
  const roleItems =
    campaign === CONFIG.ROLE.ADMIN
      ? items
      : campaign === CONFIG.ROLE.CLIENT
      ? itemsCliente
      : [];

  return (
    <ul className="flex items-center h-full w-full flex-col pt-4 list-disc relative">
      {roleItems.map(({ name, icon }, index) => (
        <li key={index} className="w-full">
          <Item
            name={name}
            Icon={icon}
            textShown={change ? false : textShown}
          />
        </li>
      ))}
    </ul>
  );
};

export default Lista;
