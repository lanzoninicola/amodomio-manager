import configDev from "./amodomio-manager.json";
import configProd from "./amodomio-manager.json";

const getFirebaseConfig = () =>
  process.env.NODE_ENV === "production" ? configDev : configProd;

export default getFirebaseConfig;
