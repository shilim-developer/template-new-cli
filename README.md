<h1 align="center">template-new-cli</h1>

<p align="center">
  <img alt="GitHub" src="https://img.shields.io/github/package-json/v
/shilim-developer/template-new-cli"/>
  <a href="https://github.com/shilim-developer/template-new-cli/blob/master/LICENSE">
    <img alt="GitHub" src="https://img.shields.io/github/license/shilim-developer/template-new-cli"/>
  </a>
</p>

<div align="center">
<strong>
<samp>

English | [简体中文](README.zh-Hans.md)

</samp>
</strong>
</div>

## Table of Contents

<details>
  <summary>Click me to Open/Close the directory listing</summary>

- [Introductions](#introductions)
- [Blog](#blog)
- [Features](#features)
- [Install](#install)
- [Template Preparation](#template-preparation)
- [Usage](#usage)
  - [Init](#init)
  - [Normal Create](#normal-create)
  - [Create By ComponentName](#create-by-componentname)
  - [Use Params From Global](#use-params-from-global)
  - [Use Params From File](#use-params-from-file)
- [ChangeLog](#changelog)
- [License](#license)

</details>

## Introductions

CLI to new files by nunjucks template

## Blog

comming soon

## Features

- Generate files through nunjucks templates
- Provide parameters in two ways: command line and JavaScript file

## Install

```sh
npm install template-new-cli -g
```

## Template Preparation
### Template Directory Structure

```
.templates                          
├─ template_file         (Template Name) [Single File Template]
│  └─ @@config.js        (Template Replacement Parameter List Configuration File)
│  └─ @@params.js        (Template Replacement Parameter Object) [optional]
│  └─ file_name.js       (Template File)               
├─ template_folder       (Template Name) [Folder Template]
│  └─ @@config.js        (Template Parameter List Configuration File)
│  └─ component_name     (Template Folder)    
│     └─ file_name.css     
│     └─ file_name.html 
│     └─ file_name.js 
├─ callback.js           (Callback)    
└─ global.js             (Global Parameter)
```
### @@config.js

```javascript
exports.fileParams = ["file_name"];
exports.templateParams = [];
```
### @@params.js
```javascript
module.exports = () => {
  return {
    fileParams:{
      file_name: 'helloworld',
    },
    templateParams:{
      content: 'hello',
    }
  };
};
```
### Template Language 
use  [nunjucks](https://github.com/mozilla/nunjucks)

## Usage

### Init
To confirm the location of `.templates` folder, an initialization operation needs to be performed in the directory where `.templates` folder is located
```sh
tp-new init
```

### Normal Create
Enter the directory where you want to create the file and execute
```sh
tp-new new
```
![normal_new](assets/normal_new.gif)

### Create By ComponentName
Enter the directory where you want to create the file and execute
```sh
tp-new new [Template Name]
```
![template_name_new](assets/template_name_new.gif)

### Use Params From Global
config global.js
```javascript
module.exports = () => {
  return {
    prefix: "tp",
  }
}
```
Enter the directory where you want to create the file and execute
```sh
tp-new new [Template Name]
```
![template_name_new](assets/template_name_new.gif)

### Use Params From File
update @@config.js
```javascript
exports.fileParams = [];
exports.templateParams = [];
```
update @@params.js
```javascript
module.exports = () => {
  return {
    fileParams:{
      file_name: 'helloworld',
    },
    templateParams:{
      
    }
  };
};

```
Enter the directory where you want to create the file and execute
```sh
tp-new new [Template Name] -p [Path Of Params File]
```
![template_name_params_new](assets/template_name_params_new.gif)

## ChangeLog

[ChangeLog](./CHANGELOG.md)

## License

[License MIT](./LICENSE)
