import mustache from "mustache";
import fs from "fs";

export const renderTemplate = (templatePath, variables = {}) => {
  const template = fs.readFileSync(templatePath, "utf8");

  return mustache.render(template, variables);
};
