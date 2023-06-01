#!/usr/bin/env node
const prompts = require("prompts");
const path = require("path");
const fs = require("fs");
const nunjucks = require("nunjucks");
const kleur = require("kleur");

// 模板地址
let templatePath;

// 参数列表
let folderParamsList = [];
let paramsObject = {};
let globalParmas = {};

// 回调
let callback = {};

/**
 * 参数列表格式化成对象
 */
function initParamsObj(params) {
  return params.reduce((pre, cur) => ((pre[cur] = ""), pre), {});
}

/**
 * 根据参数替换文件夹/文件名称
 * @param {String} pathName 文件夹/文件名称
 * @returns 新的名称
 */
function getReplaceValue(pathName) {
  let newPathName = pathName;
  for (const key of folderParamsList) {
    if (pathName.indexOf(key) >= 0) {
      newPathName = newPathName.replace(
        new RegExp(`${key}`, "g"),
        paramsObject[key]
      );
    }
  }
  return newPathName;
}

/**
 * 模板渲染
 * @param {String} filePath 模板路径
 * @param {Object} context 模板参数
 * @returns {String} 渲染内容
 */
function render(filePath, context) {
  const file = fs.readFileSync(filePath, { encoding: "utf-8" });
  return nunjucks.renderString(file, context);
}

/**
 * 根据模板生成文件
 * @param {String} templateDir 模板文件夹路径
 * @param {String} outDir 输出路径
 */
function productCode(templateDir, outDir) {
  // 遍历模板目录下的文件
  let files = fs.readdirSync(templateDir);
  files.map(function (file) {
    // 模板文件路径
    const templatePath = path.join(templateDir, file);
    // 拿到文件信息对象
    const stats = fs.statSync(templatePath);
    // 输出文件路径
    const newFilePath = path.join(outDir, getReplaceValue(path.basename(file)));
    // 判断是否为文件夹类型
    if (stats.isDirectory()) {
      // 创建文件夹
      fs.mkdirSync(newFilePath);
      callback.newFolder && callback.newFolder(newFilePath);
      return productCode(templatePath, newFilePath); // 递归读取文件夹
    } else if (!["@@config.js", "@@params.js"].includes(path.basename(file))) {
      // 过滤配置文件
      // 创建文件
      const content = render(templatePath, paramsObject);
      fs.writeFileSync(newFilePath, content);
      callback.newFile && callback.newFile(newFilePath);
    }
  });
}

async function newFile(templateName, paramsPath) {
  // 读取配置文件
  const configJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/config.json"), "utf8")
  );
  templatePath = configJson.templatePath;
  // 读取公共参数配置
  try {
    globalParmas = require(path.join(templatePath, "/global.js"))();
  } catch (error) {}
  try {
    callback = require(path.join(templatePath, "/callback.js"));
  } catch (error) {}
  // 命令行输入变量
  let answer = "";

  // 是否已经选定模板
  if (templateName) {
    answer = templateName;
  } else {
    // 获取模板列表
    const templateFiles = fs.readdirSync(templatePath);
    const templateList = templateFiles
      .filter((file) => {
        return !path.extname(`file${file}`);
      })
      .map((file) => ({
        title: file,
        value: file,
      }));
    // 选择模板
    answer = (
      await prompts(
        {
          type: "select",
          name: "template",
          message: "Select One Template",
          choices: templateList,
        },
        {
          onCancel: () => process.exit(),
        }
      )
    ).template;
  }
  const { fileParams, templateParams } = require(path.join(
    templatePath,
    `${answer}/@@config.js`
  ));

  // 是否已经给出参数路径
  const paramsList = fileParams.concat(templateParams);
  const globalParmasList = Object.keys(globalParmas);
  folderParamsList = fileParams.concat(globalParmasList);
  if (paramsPath) {
    paramsPath = path.isAbsolute(paramsPath)
      ? path.resolve(paramsPath)
      : path.join(process.cwd(), paramsPath);
    try {
      const outParamsObject = require(paramsPath)();
      folderParamsList = folderParamsList.concat(
        Object.keys(outParamsObject.fileParams)
      );
      paramsObject = Object.assign(
        {},
        outParamsObject.fileParams,
        outParamsObject.templateParams,
        globalParmas
      );
    } catch (error) {
      console.log(chalk.red(`✖ please check the correctness of the path!`));
      return;
    }
  } else {
    paramsObject = Object.assign({}, initParamsObj(paramsList), globalParmas);
    const propmtList = [];
    for (const key of paramsList) {
      propmtList.push({
        name: key,
        type: "text",
        initial: key,
        message: `Enter ${key}`,
      });
    }
    const keyAnswerObject = await prompts(propmtList, {
      onCancel: () => process.exit(),
    });
    paramsObject = { ...paramsObject, ...keyAnswerObject };
  }
  productCode(path.join(templatePath, answer), process.cwd());
  console.log(kleur.green(`✔ new completed!`));
  callback.finish && callback.finish();
}

exports.newFile = newFile;
