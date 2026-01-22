export default {
    moduleNameMapper: {
        '^.+\\.(css|less|scss|sass)$':
            '<rootDir>/tests/__mocks__/style-mock.js',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
};
