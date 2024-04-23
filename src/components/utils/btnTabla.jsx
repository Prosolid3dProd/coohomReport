import { Button, Popconfirm } from "antd"

const PopUpDelete = ({ confirmar }) => {
        return (
                <Popconfirm
                        title='Eliminar'
                        description='¿Quieres eliminar la fila?'
                        okType="default"
                        okText={<span className="w-[25px]">Si</span>}
                        cancelText={<span danger className="w-[25px]">No</span>}
                        onConfirm={confirmar}
                >
                        <Button
                                className="text-red border-red w-[65px] grid place-content-center cursor-pointer transition-all ease-out duration-350"
                        >
                                Eliminar
                        </Button>
                </Popconfirm>
        )

}

// const Danger = ({ text = 'Eliminar' }) => {
//         return (
//                 <Button
//                         className="text-red w-[65px] grid place-content-center cursor-pointer transition-all ease-out duration-350 hover:text-blue/75"
//                 >
//                         {text}
//                 </Button>
//         )
// }

export {
        PopUpDelete
}