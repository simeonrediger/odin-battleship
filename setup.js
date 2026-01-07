const devDependencies = [
    'webpack',
    'webpack-cli',
    'webpack-merge',
    'webpack-dev-server',
    'html-webpack-plugin',
    'css-loader',
    'style-loader',
    'eslint',
    '@eslint/js',
    'globals',
    'jest',
    'babel-jest',
    '@babel/core',
    '@babel/preset-env',
];

const exactDevDependencies = ['prettier'];

const hasDevDependencies =
    typeof devDependencies !== 'undefined' && devDependencies.length > 0;

const hasExactDevDependencies =
    typeof exactDevDependencies !== 'undefined' &&
    exactDevDependencies.length > 0;

let command = '   ';

if (hasDevDependencies) {
    command += 'npm install --save-dev ' + devDependencies.join(' ');
}

if (hasExactDevDependencies) {
    if (command) {
        command += ' \\\n&& ';
    }

    command +=
        'npm install --save-dev --save-exact ' + exactDevDependencies.join(' ');
}

if (command) {
    command += ' \\\n&& ';
}

command += 'npx prettier . --write';
command += ' \\\n&& ';
command += 'git rm --cached TODO.md';

const filepath = import.meta.url;
const filename = new URL(filepath).pathname.split('/').pop();

const cyan = '\x1b[96m%s\x1b[0m';
const magenta = '\x1b[95m%s\x1b[0m';

console.log(
    cyan + magenta + cyan + cyan,
    '\nRun the following command:\n',
    command,
    '\nThen update the README, package name, and page template title.',
    `\nFinally, delete ${filename}, stage all, and commit "Complete setup".\n`,
);
