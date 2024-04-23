import { useNavigate } from "react-router";
import { BtnReport } from "../../utils";

const ErrorPage = () => {
  const navigate = useNavigate();

  const navigateHome = () => navigate("/", { replace: true });

  return (
    <>
      <section className="col-span-2 row-span-2 w-full h-full relative grid place-content-center">
        <article className="row-start-2 flex flex-col items-center z-50">
          <h1 className="text-xxl text-center">Error 404!</h1>
          <p className="text-sv text-center md:text-lg italic text-slate mb-10">
            You are trying to reach an unknown page...
          </p>
          <BtnReport click={navigateHome} title={'Go Home'} />
        </article>
      </section>
    </>
  );
};

export default ErrorPage;
