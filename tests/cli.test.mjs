import { runner, KEYS } from "clet";
import path from "path";
import { test } from "vitest";
import globalInit from "../.templates/global";
import { delDir } from "../src/util.cjs";
const global = globalInit();

const deleteMiddleware = async (_, next) => {
  delDir(path.resolve("src/example"), false);
  await next();
};

const execPath = path.join(process.cwd(), "src/example");

await runner().spawn("npm link");
test("Normal Create", async () => {
  return runner()
    .use(deleteMiddleware)
    .cwd(execPath)
    .spawn("tp-new new")
    .stdin(/Select One Template/, KEYS.ENTER)
    .stdin(/file_name/, "shilim")
    .stdin(/content/, "content")
    .file("shilim.js", "content");
});

test("Create By ComponentName File", async () => {
  return runner()
    .use(deleteMiddleware)
    .cwd(execPath)
    .spawn("tp-new new template_file")
    .stdin(/file_name/, "shilim")
    .stdin(/content/, "content")
    .file("shilim.js", "content");
});

test("Create By ComponentName Folder", async () => {
  return runner()
    .use(deleteMiddleware)
    .cwd(execPath)
    .spawn("tp-new new template_folder")
    .stdin(/component_name/, "shilim")
    .stdin(/file_name/, "index")
    .file("shilim")
    .file("shilim/index.css")
    .file("shilim/index.html")
    .file("shilim/index.js");
});

test("Use Params From Global", async () => {
  return runner()
    .use(deleteMiddleware)
    .cwd(execPath)
    .spawn("tp-new new template_file")
    .stdin(/file_name/, "shilim")
    .stdin(/content/, KEYS.ENTER)
    .file(`${global.prefix}-shilim.js`);
});

test("Use Params From File", async () => {
  return runner()
    .use(deleteMiddleware)
    .cwd(execPath)
    .spawn("tp-new new template_file", [
      "-p ../../.templates/template_file/@@params.js",
    ])
    .file(`helloworld.js`)
    .file("helloworld.js", "hello");
});

test("Use Params From File", async () => {
  return runner()
    .use(deleteMiddleware)
    .cwd(execPath)
    .spawn("tp-new new template_file", [
      "-p ../../.templates/template_file/@@params.js",
    ])
    .file(`helloworld.js`)
    .file("helloworld.js", "hello");
});

test("New Folder Callback", async () => {
  return runner()
    .use(deleteMiddleware)
    .cwd(execPath)
    .spawn("tp-new new template_folder")
    .stdin(/component_name/, "shilim")
    .stdin(/file_name/, "shilim")
    .stdout(new RegExp(path.join(execPath, "shilim").replace(/\\/g, "\\\\")));
});

test("New File Callback", async () => {
  return runner()
    .use(deleteMiddleware)
    .cwd(execPath)
    .spawn("tp-new new template_file", [
      "-p ../../.templates/template_file/@@params.js",
    ])
    .stdout(
      new RegExp(path.join(execPath, "helloworld.js").replace(/\\/g, "\\\\"))
    )
    .stdout(
      new RegExp(path.join(execPath, "tp-helloworld.js").replace(/\\/g, "\\\\"))
    );
});

test("Finish Callback", async () => {
  return runner()
    .use(deleteMiddleware)
    .cwd(execPath)
    .spawn("tp-new new template_file", [
      "-p ../../.templates/template_file/@@params.js",
    ])
    .stdout(/finish/);
});
