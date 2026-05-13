import { useEffect } from "react";
import { Card, Divider, Modal } from "antd";
import ProductsForm from "./ProductsForm";
import ProductsTable from "./ProductsTable";
import EditProductModal from "./EditProductModal";
import EncimerasModal from "../../../components/pages/encimeras/encimerasModal";

const ProductsTab = ({
  form,
  editForm,
  order,
  state,
  loading,
  onTypeChange,
  onSetEncimera,
  onOpenSearch,
  onCloseSearch,
  onOpenEdit,
  onCloseEdit,
  onFinish,
  onEditFinish,
  onDelete,
}) => {
  
  useEffect(() => {
    if (state.encimera) {
      form.setFieldsValue({
        descripcion: state.encimera?.name,
        marca: state.encimera?.marca,
        unidad: parseFloat(state.encimera?.price).toFixed(2),
        referencia: state.encimera?.code,
        qty: 1,
      });
      onCloseSearch();
    }
  }, [state.encimera, form, onCloseSearch]);

  return (
    <Card style={{ borderRadius: 0, background: "var(--color-bg-layout)", border: "1px solid var(--color-border)" }}>
      <ProductsForm
        form={form}
        type={state.type}
        onTypeChange={onTypeChange}
        onFinish={onFinish}
        onOpenSearch={onOpenSearch}
      />
      <Divider />
      <ProductsTable
        dataSource={order?.details || []}
        loading={loading}
        onEdit={onOpenEdit}
        onDelete={onDelete}
      />
      <Modal
        title="Seleccionar Complemento"
        open={state.modals.isModalOpen}
        width={1000}
        onCancel={onCloseSearch}
        footer={null}
      >
        <EncimerasModal
          title={"Complementos"}
          setEncimera={onSetEncimera}
        />
      </Modal>
      <EditProductModal
        open={state.modals.isEditModalOpen}
        form={editForm}
        onFinish={onEditFinish}
        onCancel={onCloseEdit}
      />
    </Card>
  );
};

export default ProductsTab;
