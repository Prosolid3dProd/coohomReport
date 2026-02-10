import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Tabs, Card, Typography, Space, Input, Button, Row, Col, Divider } from 'antd';
import { FileAddOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';

import { Info, Exit } from '../../icons';
import { getValue, setValue } from '../../../data/session';

const Title = ({ name }) => (
    <>
        <Space align="center" style={{ padding: '0 16px', marginTop: 16 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>{name}</Typography.Title>
            <Info style={{ fontSize: 20 }} />
        </Space>
        <Divider style={{ margin: '12px 0' }} />
    </>
);

const NavConfig = () => {
    const items = [
        {
            label: 'Perfil',
            key: '1',
            children: <Perfil />,
        },
        {
            label: 'Detalles',
            key: '2',
            children: <Detalles />,
        }
    ];

    return (
        <Tabs
            defaultActiveKey='1'
            size='large'
            centered
            items={items}
        />
    )
}

const Perfil = () => {
    const [botonSave, setBotonSave] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [imgWidth, setImgWidth] = useState(500);
    const [img, setImg] = useState(getValue('Img') || `https://placehold.co/${imgWidth}X250`);
    const imgRef = useRef(null);

    useEffect(() => {
        const updateWidth = () => {
            if (imgRef.current) {
                const newWidth = imgRef.current.offsetWidth || 500;
                setImgWidth(newWidth);
            }
        };

        window.addEventListener('resize', updateWidth);
        updateWidth();

        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    useEffect(() => {
        const savedImg = getValue('Img');
        if (savedImg) {
            setImg(savedImg);
        } else {
            setImg(`https://placehold.co/${imgWidth}X250`);
        }
    }, [imgWidth]);

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length) {
            const fileUpload = files[0];
            const fileRead = new FileReader();
            fileRead.onload = () => {
                const fileContent = fileRead.result;
                setImg(fileContent);
                setDisabled(true);
                setBotonSave(true);
            };
            fileRead.readAsDataURL(fileUpload);
        }
    };

    const handleSave = () => {
        setValue('Img', img);
        setDisabled(false);
        setBotonSave(false);
    };

    const handleCancel = () => {
        const savedImg = getValue('Img');
        setImg(savedImg || `https://placehold.co/${imgWidth}X250`);
        setDisabled(false);
        setBotonSave(false);
    };

    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: '100%', maxWidth: 500 }} ref={imgRef}>
                            <img
                                src={img}
                                alt="Banner"
                                style={{ width: '100%', height: 250, objectFit: 'cover', backgroundColor: '#f0f2f5' }}
                            />
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                            <Typography.Title level={4} style={{ margin: 0 }}>Banner</Typography.Title>
                            <Space>
                                {botonSave && (
                                    <>
                                        <Button danger onClick={handleCancel}>Cancel</Button>
                                        <Button type="primary" onClick={handleSave}>Save</Button>
                                    </>
                                )}
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            opacity: 0,
                                            width: '100%',
                                            height: '100%',
                                            cursor: disabled ? 'not-allowed' : 'pointer'
                                        }}
                                        disabled={disabled}
                                        onChange={handleFileChange}
                                    />
                                    <Button icon={<FileAddOutlined />} disabled={disabled}>Change</Button>
                                </div>
                            </Space>
                        </div>
                    </div>
                </Card>

                <Section text="User">
                    <EditableArticle text='Nombre' />
                    <EditableArticle text='Apellido' />
                    <EditableArticle text='Dirección' />
                </Section>

                <Section text="Privacidad">
                    <EditableArticle text='Contraseña' isPassword={true} />
                    <EditableArticle text='Teléfono' />
                </Section>

                <Card>
                    <NavLink to={'/Login'}>
                        <Button danger icon={<Exit />}>Exit</Button>
                    </NavLink>
                </Card>
            </Space>
        </div>
    )
};


const EditableArticle = ({ text, isPassword = false, input = true }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setLocalValue] = useState(getValue(text));

    const handleEditToggle = () => {
        if (isEditing) {
            setValue(text, value);
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    return (
        <Row align="middle" gutter={[16, 16]} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Col xs={24} md={4}>
                <Typography.Text strong>{text}</Typography.Text>
            </Col>
            <Col xs={24} md={20}>
                <Row gutter={8} align="middle">
                    <Col flex="auto">
                        {input && (
                            isPassword ? (
                                <Input.Password
                                    value={value || ""}
                                    onChange={(e) => setLocalValue(e.target.value)}
                                    disabled={!isEditing}
                                    placeholder={text}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            ) : (
                                <Input
                                    value={value || ""}
                                    onChange={(e) => setLocalValue(e.target.value)}
                                    disabled={!isEditing}
                                    placeholder={text}
                                />
                            )
                        )}
                    </Col>
                    <Col>
                        <Button
                            type={isEditing ? "primary" : "default"}
                            onClick={handleEditToggle}
                        >
                            {isEditing ? 'Save' : 'Editar'}
                        </Button>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

const Section = ({ text, children }) => {
    return (
        <Card title={text} size="small">
            {children}
        </Card>
    )
}

const Detalles = () => {
    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
            <Section text="Detalles">
                <EditableArticle text={'Coeficiente'} />
            </Section>
        </div>
    )
}

const Config = () => (
    <div style={{ height: '100%', overflowY: 'auto' }}>
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
