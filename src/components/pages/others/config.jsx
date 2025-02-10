import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Tabs } from 'antd'

import ojoAbierto from '../../../assets/ojoAbierto.svg';
import ojoCerrado from '../../../assets/ojoCerrado.svg';
import { Info, Exit } from '../../icons';

import { BtnAction } from '../../utils';
import { getValue, setValue } from '../../../data/session';
import { ButtonForm, LabelForm } from '../../utils/btnAction';

const Title = ({ name }) => (
    <header className=" flex items-center gap-2 pl-4 border-b border-border">
        <h2 className=" text-sv font-bold">{name}</h2>
        <Info className="text-[20px]" />
    </header>
);

const NavConfig = () => {
    const tabs = [
        {
            'Perfil': <Perfil />
        },
        {
            'Detalles': <Detalles />
        }
    ]

    return (
        <Tabs
            defaultActiveKey='1'
            size='large'
            centered
            items={
                tabs.map((obj, i) => {
                    const [item, key] = [Object.values(obj), Object.keys(obj)]
                    return {
                        label: `${key}`,
                        key: String(i + 1),
                        children: <>{item}</>
                    }
                })
            }
        />
    )
}

const Perfil = () => {

    const [botonSave, setBotonSave] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [color, setColor] = useState('#1a7af8')
    const [imgWidth, setImgWidth] = useState(document.getElementById('img'))
    const [img, setImg] = useState(getValue('Img') || `https://placehold.co/${imgWidth || '500'}X250`)

    useEffect(() => {
        setImgWidth(img => img = document.getElementById('img')?.width)
        setImg(img => img = `https://placehold.co/${imgWidth || '500'}X250`)
    }, [window.location])

    useEffect(() => {
        setImgWidth(img => img = document.getElementById('img')?.width)
    })


    const changeImg = (event) => {
        setImgWidth(img => img = document.getElementById('img')?.width)

        if (event < 1024) {//Lg Breakpoint
            setImg(img => img = getValue('Img') || `https://placehold.co/${imgWidth}X250`)
            return
        }

        setImg(img => img = getValue('Img') || `https://placehold.co/500X250`)
    }

    useEffect(() => {
        window.onload = () => {
            changeImg(window.innerWidth)
        }
        window.onresize = () => {
            changeImg(window.innerWidth)
        }
    })

    const onClick = () => {
        const imgSrc = document.getElementById('img').src
        setImg(img => img = imgSrc)
        setColor(c => c = '#1a7af8')
        setDisabled(d => d = false)
        setBotonSave(bool => bool = false)
        setValue('Img', imgSrc)
    }

    const cancel = () => {
        document.getElementById('img').src = getValue('Img')
        const imgSrc = document.getElementById('img').src
        setValue('Img', imgSrc)

        setColor(c => c = '#1a7af8')
        setDisabled(d => d = false)
        setBotonSave(btn => btn = false)
    }

    return (
        <SectionBody tabName={'Detalles'}
            content={
                <>
                    <article className='h-[400px] py-4 flex flex-col items-center gap-4 w-full'>
                        <div className='w-full lg:w-[500px] flex flex-col items-center justify-center gap-4 flex-1 mr-l '>
                            <img className='w-full h-[250px] bg-gray object-cover' id='img' src={img} />
                        </div>
                        <header className='flex flex-row h-[85px] items-center justify-between w-full p-8'>
                            <h2 className='font-semibold '>Banner</h2>
                            <div className='flex flex-row h-[50px] gap-4'>
                                {
                                    botonSave && (
                                        <>
                                            <BtnAction text={'Cancel'} color='#FF4733' action={cancel} />
                                            <BtnAction text={'Save'} color='#1a7af8' action={onClick} />
                                        </>
                                    )
                                }
                                <LabelForm text={
                                    <>
                                        <input
                                            placeholder="Introduce a file"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            disabled={disabled}
                                            onChange={(e) => {

                                                const files = e.target.files
                                                const fileUpload = files[0]
                                                const fileRead = new FileReader()

                                                if (files && files.length) {

                                                    fileRead.onload = () => {
                                                        const fileContent = fileRead.result;
                                                        document.getElementById('img').src = fileContent
                                                    };

                                                    fileRead.readAsDataURL(fileUpload);

                                                    setDisabled(d => d = true)
                                                    setColor(color => color = '#CFCFCF')
                                                    setBotonSave(bool => bool = true)
                                                }
                                            }}

                                        />
                                        <p>Change</p>
                                    </>
                                }
                                    color={color}
                                    altura={'[50px]'}
                                />
                            </div>
                        </header>
                    </article>
                    <Section
                        text={'User'}
                        articles={
                            <>
                                <EditableArticle text={'Nombre'} />
                                <EditableArticle text={'Apellido'} />
                                <EditableArticle text={'Dirección'} />
                            </>
                        }
                    />
                    <Section
                        text={'Privacidad'}
                        articles={
                            <>
                                <EditableArticle text={'Contraseña'} extraBtn={true} />
                                <EditableArticle text={'Teléfono'} extraBtn={false} />
                            </>
                        }
                    />
                    <Section text={<NavLink to={'/Login'} className={'text-blue'}><span className='flex flex-row justify-start gap-2 items-center self-start '>Exit<Exit className='bg-blue-600/25 rounded-full h-[30px] w-[30px] p-1'/></span></NavLink>} />
                </>
            }
        />
    )
};


const EditableArticle = ({ text, extraBtn = false, action, input = true }) => {

    const [showPassword, setShowPassword] = useState(false);
    const [modoEditar, setModoEditar] = useState(false)
    const [textoBtn, setTextoBtn] = useState('Editar')
    const [value, setVal] = useState(getValue(text))

    const editInput = () => {
        const input = document.getElementById(`${text}`)

        if (!modoEditar) {
            setModoEditar(editar => editar = true)
            setTextoBtn(texto => texto = 'Save')
            input.disabled = false
            input.classList.add('inputAble')
            return
        }

        setModoEditar(editar => editar = false)
        setTextoBtn(texto => texto = 'Editar')
        input.classList.remove('inputAble')

        input.disabled = true
        setValue(text, input.value)
    }

    return (
        <article className='grid grid-cols-12 lg:grid-cols-[100px_1fr] gap-4 lg:gap-0 p-4 h-[85px]'>
            <header className='col-span-2 lg:col-span-1 flex justify-start items-start'>
                <h2 className='pt-1'>{text}</h2>
            </header>
            <article className="flex w-full col-start-3 lg:col-start-2 col-span-11 lg:flex lg:justify-between">
                <div className='bg-gray flex w-[400px] rounded-md outline outline-border outline-1 transition-all duration-150 lg:w-[400px] h-[32px]'>
                    {
                        input
                        && (
                            <>
                                <input id={text} type={showPassword ? 'password' : 'text'}
                                    className={`self-start bg-transparent w-full h-full focus:outline-none text-start pl-4`}
                                    placeholder={text}
                                    defaultValue={value || text}
                                    disabled
                                />
                                {
                                    extraBtn && (
                                        <button type="button" className='pr-4' onClick={() => setShowPassword(psw => psw = !psw)}>
                                            {showPassword ? <img src={ojoCerrado} alt="ojoCerrado" /> : <img src={ojoAbierto} alt="ojoAbierto" />}
                                        </button>
                                    )
                                }
                            </>
                        )
                    }
                </div>
                <ButtonForm text={textoBtn} color={`${textoBtn === 'Editar' ? '#1a7af8' : '#FFF'}`} background={`${textoBtn === 'Editar' ? 'white' : '#1a7af8'}`} altura='[65px]' action={editInput} />
            </article>
        </article>
    )
}

const Section = ({ text, articles }) => {
    return (
        <div className='mb-8'>
            <header className='bg-gray p-4 text-sv font-semibold'>
                {text}
            </header>
            <section className='px-4 divide-y-[1px] divide-border'>
                {
                    articles
                }
            </section>
        </div>
    )
}

const SectionBody = ({ tabName, content }) => {
    return (
        <section id={tabName} className='p-4 divide-y-[1px] divide-border'>
            {content}
        </section>
    )
}

const Detalles = () => {
    return (
        <SectionBody tabName={'Detalles'}
            content={
                <>
                    <EditableArticle text={'Coeficiente'} />
                </>
            }
        />
    )
}

const Config = () => (
    <div className='grid grid-rows-[75px_56px_1fr] overflow-y-scroll
    '>
        <Title name={'Settings'} />
        <NavConfig />
        <Outlet />
    </div>
)

export {
    Config,
    Perfil,
    Detalles,
}
