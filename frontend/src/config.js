const defaultBackendUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://news-buzz-react-mog3.onrender.com'
    : 'http://localhost:9000';

const config = {
  BACKEND_API: process.env.REACT_APP_BACKEND_API || defaultBackendUrl,
  BACKEND_API_SCRAP: process.env.REACT_APP_BACKEND_API || defaultBackendUrl,
  PWD_SECRET: process.env.REACT_APP_PWD_SECRET || "news-aggregator-secret"
};

export default config;
