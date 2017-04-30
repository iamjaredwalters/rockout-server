module.exports = {
    'extends': 'airbnb',
    'parser': 'babel-eslint',
    'env': {
        node: true,
        jest: true
    },
    'rules': {
        indent: ['error', 4,
            {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
            },
        ],

        'max-len': ['error', 110, 2,
            {
                ignoreUrls: true,
                ignoreComments: false,
                ignoreTrailingComments: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],

        'quote-props': ['error', 'as-needed',
            {
                keywords: false,
                unnecessary: true,
                numbers: true,
            },
        ],

        quotes: ['error', 'single',
            {
                avoidEscape: true,
                allowTemplateLiterals: true,
            },
        ],

        // Always require brackets because it is easier to extend later
        'arrow-body-style': ['error', 'always'],

        // Always require parens because it is more consistent, especially with flow
        'arrow-parens': ['error', 'always'],
    },
};
