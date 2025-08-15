const config = {
  appId: 'DEINE.PACKAGE.ID',
  appName: 'Audio-Recorder',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlays: false,   // <— WICHTIG
      style: 'LIGHT',    // weiße Symbole
    },
  },
};
export default config;
