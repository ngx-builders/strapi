# Strapi (Nx Plugin)

<p align="center">
  <a href="https://strapi.io">
    <img src="https://strapi.io/assets/strapi-logo-dark.svg" width="318px" alt="Strapi logo" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@ngx-builders/strapi">
    <img src="https://img.shields.io/npm/v/strapi/latest.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/package/@ngx-builders/strapi">
    <img src="https://img.shields.io/npm/dm/strapi.svg" alt="Monthly download on NPM" />
  </a>
  <a>
    <img src="https://github.com/ngx-builders/strapi/workflows/Node.js%20CI/badge.svg?branch=master" alt="Node.js CI" />
  </a>
</p>

### Nx plugin for developing [Strapi](https://strapi.io/) application in NX workspace.
***
<br />

## ⏳ Usage

Add this plugin to an Nx workspace:

```
yarn add --dev @ngx-builders/strapi
```

or

```
npm install @ngx-builders/strapi --save-dev
```
<br />

## 🌟 Project schematics

Initialize Strapi in your Nx workspace:-

```
nx g @ngx-builders/strapi:init
```

Generate Strapi application:-

```
nx g @ngx-builders/strapi:app <application-name>
```

<br />

## 🏃 Run your application

```
nx build <application-name>
nx start <application-name>
```
