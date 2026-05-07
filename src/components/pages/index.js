import { Config } from "./settings/config";
import Dashboard from "./dashboard";
import Login from "./auth/login";
import Encimeras from "./encimeras/encimeras";
import ErrorPage from "./error/errorPage";
import { Admin } from "./admin/admin";
import { RedirectLogin } from "./auth/guard";

export {
  Config,
  Dashboard,
  Login,
  Encimeras,
  ErrorPage as Error,
  Admin,
  RedirectLogin,
};
