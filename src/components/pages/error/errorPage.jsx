import { useNavigate } from "react-router";
import { Result } from "antd";
import AppButton from "../../common/AppButton";

const ErrorPage = () => {
  const navigate = useNavigate();

  const navigateHome = () => navigate("/", { replace: true });

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Result
        status="404"
        title="404"
        subTitle="You are trying to reach an unknown page..."
        extra={<AppButton text="Go Home" onClick={navigateHome} />}
      />
    </div>
  );
};

export default ErrorPage;
