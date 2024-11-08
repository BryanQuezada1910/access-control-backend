import mustache from 'mustache';
import fs from 'fs/promises';

export const renderTemplate = async (templatePath, variables = {}) => {
  try {
    const template = await fs.readFile(templatePath, 'utf8');

    return mustache.render(template, variables);
  } catch (error) {
    console.error(`Error reading or rendering template: ${error.message}`);
    throw error;
  }
};
