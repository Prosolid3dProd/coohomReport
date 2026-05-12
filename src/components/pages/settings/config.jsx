import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Tabs } from 'antd'

import ojoAbierto from '../../../assets/ojoAbierto.svg';
import ojoCerrado from '../../../assets/ojoCerrado.svg';
import { Info, Exit } from '../../../shared/ui/icons';

import { ButtonAction as BtnAction, ButtonForm, LabelForm } from '../../../shared/ui/Button';
import { getValue, setValue } from '../../../shared/lib/storage';

const Title = ({ name }) => (
    <header style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 16, borderBottom: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: 'var(--font-sv)', fontWeight: 'bold' }}>{name}</h2>
        <Info style={{ fontSize: 20 }} />
    </header>
);

const NavConfig = () => {
    const tabs = [
        { 'Perfil': <Perfil /> },
        { 'Detalles': <Detalles /> },
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
                        children: <>{item}</>,
                    }
                })
            }
        />
    )
}

const Perfil = () => {
    const imgRef = useRef(null)

    const [botonSave, setBotonSave] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [color, setColor] = useState('#1a7af8')
    const [img, setImg] = useState(getValue('Img') || 'https://placehold.co/500X250')

    const changeImg = (windowWidth) => {
        const width = imgRef.current?.offsetWidth || 500
        if (windowWidth < 1024) {
            setImg(getValue('Img') || `https://placehold.co/${width}X250`)
            return
        }
        setImg(getValue('Img') || 'https://placehold.co/500X250')
    }

    useEffect(() => {
        changeImg(window.innerWidth)
        const handleResize = () => changeImg(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const onClick = () => {
        const imgSrc = imgRef.current?.src || img
        setImg(imgSrc)
        setColor('#1a7af8')
        setDisabled(false)
        setBotonSave(false)
        setValue('Img', imgSrc)
    }

    const cancel = () => {
        const savedImg = getValue('Img')
        if (imgRef.current) imgRef.current.src = savedImg
        setImg(savedImg)
        setValue('Img', savedImg)
        setColor('#1a7af8')
        setDisabled(false)
        setBotonSave(false)
    }

    return (
        <SectionBody tabName={'Detalles'}
            content={
                <>
                    <article style={{ height: 400, padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
                        <div style={{ width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, flex: 1 }}>
                            <img ref={imgRef} style={{ width: '100%', height: 250, background: 'var(--color-bg-layout)', objectFit: 'cover' }} src={img} />
                        </div>
                        <header style={{ display: 'flex', flexDirection: 'row', height: 85, alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 32 }}>
                            <h2 style={{ fontWeight: 600 }}>Banner</h2>
                            <div style={{ display: 'flex', flexDirection: 'row', height: 50, gap: 16 }}>
                                {botonSave && (
                                    <>
                                        <BtnAction text={'Cancel'} color='#FF4733' action={cancel} />
                                        <BtnAction text={'Save'} color='#1a7af8' action={onClick} />
                                    </>
                                )}
                                <LabelForm
                                    text={
                                        <>
                                            <input
                                                placeholder="Introduce a file"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                disabled={disabled}
                                                onChange={(e) => {
                                                    const files = e.target.files
                                                    const fileUpload = files[0]
                                                    const fileRead = new FileReader()

                                                    if (files && files.length) {
                                                        fileRead.onload = () => {
                                                            const fileContent = fileRead.result;
                                                            if (imgRef.current) imgRef.current.src = fileContent
                                                        };
                                                        fileRead.readAsDataURL(fileUpload);
                                                        setDisabled(true)
                                                        setColor('#CFCFCF')
                                                        setBotonSave(true)
                                                    }
                                                }}
                                            />
                                            <p>Change</p>
                                        </>
                                    }
                                    color={color}
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
                    <Section
                        text={
                            <NavLink to={'/Login'} style={{ color: 'var(--color-primary)' }}>
                                <span style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 8, alignItems: 'center' }}>
                                    Exit
                                    <Exit style={{ background: 'rgba(37,99,235,0.25)', borderRadius: '50%', height: 30, width: 30, padding: 4 }} />
                                </span>
                            </NavLink>
                        }
                    />
                </>
            }
        />
    )
};

const EditableArticle = ({ text, extraBtn = false, action, input = true }) => {
    const inputRef = useRef(null)

    const [showPassword, setShowPassword] = useState(false);
    const [modoEditar, setModoEditar] = useState(false)
    const [textoBtn, setTextoBtn] = useState('Editar')
    const [value, setVal] = useState(getValue(text))

    const editInput = () => {
        const el = inputRef.current
        if (!el) return

        if (!modoEditar) {
            setModoEditar(true)
            setTextoBtn('Save')
            el.disabled = false
            el.classList.add('inputAble')
            return
        }

        setModoEditar(false)
        setTextoBtn('Editar')
        el.classList.remove('inputAble')
        el.disabled = true
        setValue(text, el.value)
    }

    return (
        <article style={{ display: 'grid', gridTemplateColumns: '100px 1fr', padding: 16, height: 85 }}>
            <header style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <h2 style={{ paddingTop: 4 }}>{text}</h2>
            </header>
            <article style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <div style={{ background: 'var(--color-bg-layout)', display: 'flex', width: 400, borderRadius: 6, outline: '1px solid var(--color-border)', transition: 'all 0.15s', height: 32 }}>
                    {input && (
                        <>
                            <input
                                ref={inputRef}
                                type={showPassword ? 'password' : 'text'}
                                style={{ background: 'transparent', width: '100%', height: '100%', border: 'none', outline: 'none', paddingLeft: 16 }}
                                placeholder={text}
                                defaultValue={value || text}
                                disabled
                            />
                            {extraBtn && (
                                <button type="button" style={{ paddingRight: 16 }} onClick={() => setShowPassword(psw => !psw)}>
                                    {showPassword ? <img src={ojoCerrado} alt="ojoCerrado" /> : <img src={ojoAbierto} alt="ojoAbierto" />}
                                </button>
                            )}
                        </>
                    )}
                </div>
                <ButtonForm
                    text={textoBtn}
                    color={textoBtn === 'Editar' ? '#1a7af8' : '#FFF'}
                    background={textoBtn === 'Editar' ? 'white' : '#1a7af8'}
                    action={editInput}
                />
            </article>
        </article>
    )
}

const Section = ({ text, articles }) => (
    <div style={{ marginBottom: 32 }}>
        <header style={{ background: 'var(--color-bg-layout)', padding: 16, fontSize: 'var(--font-sv)', fontWeight: 600 }}>
            {text}
        </header>
        <section style={{ padding: '0 16px' }}>
            {articles}
        </section>
    </div>
)

const SectionBody = ({ tabName, content }) => (
    <section id={tabName} style={{ padding: 16 }}>
        {content}
    </section>
)

const Detalles = () => (
    <SectionBody tabName={'Detalles'}
        content={<EditableArticle text={'Coeficiente'} />}
    />
)

const Config = () => (
    <div style={{ display: 'grid', gridTemplateRows: '75px 56px 1fr', overflowY: 'scroll' }}>
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
