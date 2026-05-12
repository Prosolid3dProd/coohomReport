import { useNavigate } from "react-router";
import BtnReport from "../../../shared/ui/ButtonReport";

const ErrorPage = () => {
  const navigate = useNavigate();

  const navigateHome = () => navigate("/", { replace: true });

  return (
    <section style={{ width: "100%", height: "100vh", display: "grid", placeContent: "center" }}>
      <article style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 style={{ fontSize: "var(--font-xxl)", textAlign: "center" }}>Error 404!</h1>
        <p style={{ fontSize: "var(--font-sv)", textAlign: "center", fontStyle: "italic", marginBottom: 40 }}>
          You are trying to reach an unknown page...
        </p>
        <BtnReport click={navigateHome} title={"Go Home"} />
      </article>
    </section>
  );
};

export default ErrorPage;
