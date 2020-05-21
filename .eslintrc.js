module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [
        'plugin:react/recommended',
        'google',
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true,
        },
        'ecmaVersion': 2018,
        'sourceType': 'module',
    },
    'plugins': [
        'react',
        'babel'
    ],
    'settings': {
        'react': {
            'createClass': 'createReactClass',
            'pragma': 'React',
            'version': 'detect',
            'flowVersion': '0.53'
        },
        'propWrapperFunctions': [
            'forbidExtraProps',
            { 'property': 'freeze', 'object': 'Object' },
            { 'property': 'myFavoriteWrapper' }
        ],
        'linkComponents': [
            'Hyperlink',
            { 'name': 'Link', 'linkAttribute': 'to' }
        ]
    },
    'rules': {
        'require-jsdoc': 0,
        'max-len': 0,
        'indent': ['error', 4],
        "no-invalid-this": 0,
        "babel/no-invalid-this": 1,
        "react/jsx-key": 0,
        "react/prop-types": 0
    },
};
