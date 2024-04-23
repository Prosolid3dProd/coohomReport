const ButtonAction = ({ text, color = 'transparent', background = 'white', altura = 'full', hbg, htext, action }) => {

    return (
        <button
            className={` rounded-md w-[75px] md:w-[100px] md:h-${altura} h-[50px] flex justify-center items-center transition-all ease-out duration-300 text-[${color}] bg-[${background}] outline outline-1 outline-[${color}] hover:bg-[${color}] hover:text-[${background}] hover:outline-[${color}]`}
            onClick={action}
        >
            {text}
        </button>
    )
}
const ButtonForm = ({ text, color = 'transparent', background = 'white', altura = 'full', hbg, htext, action }) => {

    return (
        <button
            className={`w-[160px] md:w-[160px] md:h-${altura} h-[32px] rounded-lg flex justify-center items-center transition-all ease-out duration-300 text-[${color}] bg-[${background}] outline outline-1 outline-[${color}] hover:bg-[${color}] hover:text-[${background}] hover:outline-[${color}]`}
            onClick={action}
        >
            {text}
        </button>
    )
}

const LabelForm = ({ text, color = 'transparent', background = 'white', action }) => {

    return (
        <label
            className={
                `w-[75px] md:w-[100px] h-[50px] rounded-lg md:h-full flex justify-center items-center transition-all ease-out duration-300 text-[${color}] bg-[${background}] outline outline-1 outline-[${color}] hover:bg-[${color}] hover:text-[${background}] hover:outline-[${color}]`
            }
            onClick={action}
        >
            {
                text
            }
        </label>
    )
}

const
    LabelAction = ({ text, color = 'transparent', background = 'white', action }) => {

        return (
            <label
                className={
                    ` rounded-md w-[75px] md:w-[100px] h-[50px] md:h-full flex justify-center items-center transition-all ease-out duration-300 text-[${color}] bg-[${background}] outline outline-1 outline-[${color}] hover:bg-[${color}] hover:text-[${background}] hover:outline-[${color}]`
                }
                onClick={action}
            >
                {
                    text
                }
            </label>
        )
    }

export {
    ButtonAction,
    LabelAction,
    ButtonForm,
    LabelForm
}