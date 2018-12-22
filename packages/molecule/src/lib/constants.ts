declare var process: {
  env: {
    NODE_ENV: 'development' | 'production';
  };
};

export const __DEV__ = process.env.NODE_ENV !== 'production';

export const IS_MOLECULE_ELEMENT = true;
