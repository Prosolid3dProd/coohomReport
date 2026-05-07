import { ArrowsLeft, ArrowsRight } from "../../icons";

const BotonPlegar = ({ fn, change }) => {
  const icon = change ? <ArrowsRight /> : <ArrowsLeft />;
  return (
    <li className="w-full flex mt-2 mb-4 max-[1024px]:hidden lg:justify-end">
      <div onClick={fn} className="mr-5 cursor-pointer text-gray-400">
        {icon}
      </div>
    </li>
  );
};

export default BotonPlegar;
