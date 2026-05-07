const ButtonAction = ({
  text,
  color = "transparent",
  background = "white",
  altura = "full",
  hbg,
  htext,
  action,
}) => {
  return (
    <button
      className="rounded-md w-[75px] md:w-[100px] h-[50px] flex justify-center items-center transition-all ease-out duration-300 outline outline-1"
      style={{
        color: color,
        backgroundColor: background,
        outlineColor: color,
      }}
      onClick={action}
    >
      {text}
    </button>
  );
};

const ButtonForm = ({
  text,
  color = "transparent",
  background = "white",
  altura = "full",
  hbg,
  htext,
  action,
}) => {
  return (
    <button
      className="w-[160px] h-[32px] rounded-lg flex justify-center items-center transition-all ease-out duration-300 outline outline-1"
      style={{
        color: color,
        backgroundColor: background,
        outlineColor: color,
      }}
      onClick={action}
    >
      {text}
    </button>
  );
};

const LabelForm = ({
  text,
  color = "transparent",
  background = "white",
  action,
}) => {
  return (
    <label
      className="w-[75px] md:w-[100px] h-[50px] rounded-lg flex justify-center items-center transition-all ease-out duration-300 outline outline-1"
      style={{
        color: color,
        backgroundColor: background,
        outlineColor: color,
      }}
      onClick={action}
    >
      {text}
    </label>
  );
};

const LabelAction = ({
  text,
  color = "transparent",
  background = "white",
  action,
}) => {
  return (
    <label
      className="rounded-md w-[75px] md:w-[100px] h-[50px] flex justify-center items-center transition-all ease-out duration-300 outline outline-1"
      style={{
        color: color,
        backgroundColor: background,
        outlineColor: color,
      }}
      onClick={action}
    >
      {text}
    </label>
  );
};

export { ButtonAction, LabelAction, ButtonForm, LabelForm };