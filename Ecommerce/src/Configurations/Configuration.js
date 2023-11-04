import {environment} from '../../app.json';

const DevConfig = {
  hostUrl: 'www.example.com',
};

const ProdConfig = {
  hostUrl: 'www.example.com',
};

const StageConfig = {
  hostUrl: 'www.example.com',
};

const selectedConfig =
  environment === 'PROD'
    ? ProdConfig
    : environment === 'STAGE'
    ? StageConfig
    : DevConfig;

export const endPoints = {
  login: `${selectedConfig.hostUrl}/v1/endpoint`,
};

export const AppConfigData = {
  ...selectedConfig,
  defaultLanguage: 'Eng',
  defaultTheme: 'light',
};
