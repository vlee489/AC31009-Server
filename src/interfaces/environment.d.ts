/**
 * Declares the enviorment variable types for the project
 */
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGO_URI: string;
        NODE_ENV: 'development' | 'production';
        PORT: string;
        SESSIONSECRECT: string;
        TOTPKEY: string;
        CERTKEY: string;
        CERT: string;
        CA: string
      }
    }
  }
  
  export {}