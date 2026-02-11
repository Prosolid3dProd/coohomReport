import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Card, Typography, Space, Flex, Input, Button, Row, Col, Divider, message, Spin } from 'antd';
import { FileAddOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
// import { jwtDecode } from "jwt-decode"; // No longer needed directly here

import { Info, Exit } from '../../icons';
// import { getLocalToken } from '../../../data/localStorage'; // No longer needed
// import { getUsers, updateUser } from '../../../handlers/user'; // updateUser used via context
import { useUser } from '../../../context/UserContext';

const Title = ({ name }) => (
    <>
        <Space align="center" style={{ padding: '0 16px', marginTop: 16 }}>
            <Typography.Title level={3} style={{ margin: 0 }}>{name}</Typography.Title>
            <Info style={{ fontSize: 20 }} />
        </Space>
        <Divider style={{ margin: '12px 0' }} />
    </>
);

const Config = () => {
    const { user, loading, updateUser } = useUser();

    // Wrapper to match previous signature if needed, or pass updateUser directly
    const handleUpdate = async (field, value) => {
        await updateUser({ [field]: value });
    };

    return (
        <div style={{ height: '100%', overflowY: 'auto' }}>
            <Title name={'Settings'} />
            {loading ? (
                <Flex justify="center" align="center" style={{ padding: 40 }}>
                    <Spin size="large" />
                </Flex>
            ) : (
                <Perfil user={user || {}} onUpdate={handleUpdate} />
            )}
            <Outlet />
        </div>
    );
};

const Perfil = ({ user, onUpdate }) => {
    const [botonSave, setBotonSave] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [imgWidth, setImgWidth] = useState(500);
    const [img, setImg] = useState(user?.logo || `https://placehold.co/${imgWidth}X250`);
    const imgRef = useRef(null);

    useEffect(() => {
        if (user?.logo) {
            setImg(user.logo);
        } else {
            setImg(`https://placehold.co/${imgWidth}X250`);
        }
    }, [user, imgWidth]);

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

    const handleSaveLogo = () => {
        onUpdate('logo', img);
        setDisabled(false);
        setBotonSave(false);
    };

    const handleCancelLogo = () => {
        setImg(user?.logo || `https://placehold.co/${imgWidth}X250`);
        setDisabled(false);
        setBotonSave(false);
    };

    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
            <Flex vertical gap="large" style={{ width: '100%' }}>
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
                                        <Button danger onClick={handleCancelLogo}>Cancel</Button>
                                        <Button type="primary" onClick={handleSaveLogo}>Save</Button>
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
                    <EditableArticle
                        text='Nombre'
                        field='name'
                        valueProp={user?.name}
                        onSave={onUpdate}
                    />
                    <EditableArticle
                        text='NIF'
                        field='nif'
                        valueProp={user?.nif}
                        onSave={onUpdate}
                    />
                    <EditableArticle
                        text='Rol'
                        valueProp={user?.role}
                        input={false}
                    />
                </Section>

                <Section text="Privacidad">
                    <EditableArticle
                        text='Contraseña'
                        field='password'
                        isPassword={true}
                        onSave={onUpdate}
                        placeholder="Nueva contraseña"
                    />
                </Section>

                <Section text="Configuración Venta">
                    <EditableArticle
                        text='Coef. Venta'
                        field='coefficientVenta'
                        valueProp={user?.coefficientVenta}
                        onSave={onUpdate}
                    />
                </Section>

                <Card>
                    <NavLink to={'/Login'}>
                        <Button danger icon={<Exit />}>Logout</Button>
                    </NavLink>
                </Card>
            </Flex>
        </div>
    )
};


const EditableArticle = ({ text, field, isPassword = false, input = true, valueProp = '', onSave, placeholder }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setLocalValue] = useState(valueProp);

    useEffect(() => {
        setLocalValue(valueProp);
    }, [valueProp]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Save logic
            if (onSave && field) {
                onSave(field, value);
            }
            setIsEditing(false);
        } else {
            setIsEditing(true);
            // If password, maybe clear it? For now keep empty if undefined
            if (isPassword) setLocalValue('');
        }
    };

    // For password, we don't start with the hash, typically empty
    const displayValue = isPassword && !isEditing ? '********' : value;

    return (
        <Row align="middle" gutter={[16, 16]} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Col xs={24} md={4}>
                <Typography.Text strong>{text}</Typography.Text>
            </Col>
            <Col xs={24} md={20}>
                <Row gutter={8} align="middle">
                    <Col flex="auto">
                        {input ? (
                            isPassword ? (
                                <Input.Password
                                    value={value || ""}
                                    onChange={(e) => setLocalValue(e.target.value)}
                                    disabled={!isEditing}
                                    placeholder={placeholder || text}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            ) : (
                                <Input
                                    value={value || ""}
                                    onChange={(e) => setLocalValue(e.target.value)}
                                    disabled={!isEditing}
                                    placeholder={placeholder || text}
                                />
                            )
                        ) : (
                            <Typography.Text>{displayValue || "N/A"}</Typography.Text>
                        )}
                    </Col>
                    {input && (
                        <Col>
                            <Button
                                type={isEditing ? "primary" : "default"}
                                onClick={handleEditToggle}
                            >
                                {isEditing ? 'Save' : 'Editar'}
                            </Button>
                        </Col>
                    )}
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

export {
    Config,
    Perfil
}
