const BASE_STYLE = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease",
  cursor: "pointer",
  border: "none",
  background: "transparent",
};

const VARIANT_STYLE = {
  action:      { width: 100, height: 50, borderRadius: 6, outline: "1px solid currentColor" },
  form:        { width: 160, height: 32, borderRadius: 8, outline: "1px solid currentColor" },
  label:       { width: 100, height: 50, borderRadius: 8, outline: "1px solid currentColor" },
  labelAction: { width: 100, height: 50, borderRadius: 6, outline: "1px solid currentColor" },
};

const TAGS = { action: "button", form: "button", label: "label", labelAction: "label" };

export const Button = ({ text, variant = "action", color = "transparent", background = "white", action, children }) => {
  const Tag = TAGS[variant] || "button";
  return (
    <Tag
      style={{ ...BASE_STYLE, ...VARIANT_STYLE[variant], color, backgroundColor: background, outlineColor: color }}
      onClick={action}
    >
      {text || children}
    </Tag>
  );
};

export const ButtonAction = (props) => <Button {...props} variant="action" />;
export const ButtonForm   = (props) => <Button {...props} variant="form" />;
export const LabelForm    = (props) => <Button {...props} variant="label" />;
export const LabelAction  = (props) => <Button {...props} variant="labelAction" />;
