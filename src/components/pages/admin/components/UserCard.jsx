import React, { useMemo } from "react";
import { Card, Button, Typography, Tag, Descriptions, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const UserCard = React.memo(({ user, onDelete, onEdit }) => {
    const roleInfo = useMemo(() => ({
        color: user.role === 'admin' ? 'red' : 'blue',
        text: user.role === 'admin' ? 'Administrador' : 'Cliente'
    }), [user.role]);

    const userFields = useMemo(() => [
        { key: 'coefficient', label: 'Coeficiente', value: user.coefficient },
        { key: 'coefficientVenta', label: 'Coef. Venta', value: user.coefficientVenta },
        { key: 'nif', label: 'NIF', value: user.nif },
        { key: 'phone', label: 'Teléfono', value: user.phone },
        { key: 'info1', label: 'Info', value: user.info1 },
    ].filter(field => field.value), [user]);

    return (
        <Card
            hoverable
            styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            {/* Logo Banner */}
            <div style={{ width: '100%', height: '120px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid #e8e8e8' }}>
                {user.logo ? (
                    <img src={user.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '16px' }} />
                ) : (
                    <UserOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                )}
            </div>

            {/* Contenido */}
            <div style={{ padding: '20px', flex: '1', display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <Title level={5} style={{ marginBottom: '4px' }}>{user.name || 'Sin nombre'}</Title>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{user.email}</Text>
                </div>

                <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                    <Tag color={roleInfo.color}>{roleInfo.text}</Tag>
                </div>

                <Descriptions column={1} size="small" bordered style={{ marginBottom: 'auto' }}>
                    {userFields.map(field => (
                        <Descriptions.Item key={field.key} label={field.label}>{field.value}</Descriptions.Item>
                    ))}
                </Descriptions>
            </div>

            {/* Botones */}
            <div style={{ borderTop: '1px solid #f0f0f0', padding: '12px 16px', display: 'flex', justifyContent: 'space-around', gap: '8px' }}>
                <Button type="text" icon={<EditOutlined />} onClick={() => onEdit && onEdit(user)} style={{ flex: 1 }}>
                    Editar
                </Button>
                <Popconfirm
                    title="¿Seguro que quieres eliminar este usuario?"
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                    onConfirm={() => onDelete(user)}
                    okText="Si"
                    cancelText="No"
                >
                    <Button type="text" danger icon={<DeleteOutlined />} style={{ flex: 1 }}>Eliminar</Button>
                </Popconfirm>
            </div>
        </Card>
    );
});

UserCard.displayName = 'UserCard';

export default UserCard;
