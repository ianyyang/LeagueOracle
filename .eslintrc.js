module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'node': true,
    },
    'extends': [
        'plugin:react/recommended',
        'google',
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true,
        },
        'ecmaVersion': 2018,
        'sourceType': 'module',
    },
    'plugins': [
        'react',
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
        'indent': ['error', 4]
    },
};
