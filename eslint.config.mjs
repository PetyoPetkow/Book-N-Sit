import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import pluginPrettier from 'eslint-config-prettier'

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  pluginPrettier,
]
