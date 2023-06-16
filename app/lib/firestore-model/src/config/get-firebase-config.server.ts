import configDev from "./amodomio-manager-dev.json";
import configProd from "./amodomio-manager.json";

const getFirebaseConfig = () =>
  process.env.NODE_ENV === "production" ? configProd : configDev;

export default getFirebaseConfig;
