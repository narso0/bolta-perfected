module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@screens': './src/screens',
            '@lib': './src/lib',
            '@context': './src/context',
            '@navigation': './src/navigation',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
