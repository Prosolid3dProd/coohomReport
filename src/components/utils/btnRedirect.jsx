import { Arrow } from "../icons"

const ButtonReport = ({ title, click }) => {
        return (
                <button
                        className=" w-[170px] h-[56px] text-md text-white bg-blue transition ease-out duration-350 hover:bg-blue/75"
                        onClick={click}
                >
                        <p className="flex justify-evenly font-semibold">
                                {title} <Arrow className="text-[26px]" />
                        </p>
                </button>
        )

}

export default ButtonReport