/* eslint strict:off, global-require:off */

'use strict';

// const dotenv = require('dotenv');
//
//
// dotenv.config({path: '.env'});

module.exports = (wallaby) => {
    return ({
        files: [
            'src/**/*.js',
            'package.json',
            'setup_jest.js',
            '.env',

            '!src/**/*.test.js',
        ],

        tests: [
            'src/**/*.test.js',
        ],

        compilers: {
            '**/*.js': wallaby.compilers.babel(),
        },

        env: {
            type: 'node',
            runner: 'node',
        },

        testFramework: 'jest',

        delays: {
            run: 500,
        },

        // https://github.com/wallabyjs/public/issues/465
        // workers: { initial: 1, regular: 1 },

        setup: (w) => {
            const jestConfig = require('./package.json').jest;
            w.testFramework.configure(jestConfig);
        },
    });
};
