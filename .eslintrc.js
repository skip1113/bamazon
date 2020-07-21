module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2020": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 11
    },
    "rules": {
        "indent" : [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "max-len": [
            "error",
            {
                "code": 120,
                "ignoreComments": true,
                "ignoreTrailingComments": true
            }
        ],
        "no-console": "off"
    }
};
