import { Modal, Button } from "antd";

/**
 *
 *
 * @param { string } texto --> Texto del label
 * @param { HTMLInputElement } input --> Componente Input
 * @return {Component}
 */
const Label = ({ texto, input }) => {
  return (
    <label className="flex gap-2 italic text-slate-400 text-md">
      {texto}
      {input}
    </label>
  );
};

/**
 *
 *
 * @param {string} dfValue --> Valor por defecto del input
 * @return {Component}
 */
const Input = ({ dfValue, plhold }) => {
  return (
    <input
      className="text-black placeholder:text-border focus:placeholder:text-blue placeholder:italic pl-2 focus:shadow-sm focus:text-blue"
      placeholder={plhold}
      defaultValue={dfValue}
    />
  );
};

/**
 *
 * @param {Component} contenido --> JSX code (Tags)
 * @param {Function} okey --> Enviar proceso
 * @param {Function} cancelar --> Cerrar/Cancelar proceso
 * @return {Component}
 */
const TablaModal = ({ contenido, okey, cancelar }) => {
  return (
    <Modal
      title="Basic Modal"
      open={() => true}
      onOk={cancelar}
      destroyOnClose
      onCancel={cancelar}
      footer={[
        <Button key="back" onClick={cancelar} target="_self">
          Cancel
        </Button>,
        <Button target="_self" key="submit" type="default" onClick={okey}>
          Okey
        </Button>,
      ]}
    >
      {contenido}
    </Modal>
  );
};

export { TablaModal, Input, Label };
