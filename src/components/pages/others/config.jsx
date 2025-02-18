
import { Outlet } from 'react-router-dom'

import { Info } from '../../icons';


const Title = ({ name }) => (
    <header className=" flex items-center gap-2 pl-4 border-b border-border">
        <h2 className=" text-sv font-bold">{name}</h2>
        <Info className="text-[20px]" />
    </header>
);


const Config = () => (
    <div className='grid grid-rows-[75px_56px_1fr] overflow-y-scroll
    '>
        <Title name={'Settings'} />
        <Outlet />
    </div>
)

export {
    Config
}
