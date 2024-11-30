import { writeFile } from "fs/promises";

import { routes } from "../../dto/routes";

const OUTPUT_FILE_PATH = "./api/generatedApi.ts";

async function generateFetchFunctions() {
  try {
    const fetchFunctions: string[] = [];

    Object.entries(routes).forEach(([routeName, routePath]) => {
      const capitalizedRouteName =
        routeName.charAt(0).toUpperCase() + routeName.slice(1);

      let method = "GET";

      if (routeName.startsWith("get")) {
        method = "GET";
      }
      if (routeName.startsWith("create")) {
        method = "POST";
      }
      if (routeName.startsWith("update")) {
        method = "PUT";
      }
      if (routeName.startsWith("delete")) {
        method = "DELETE";
      }

      const requestDto = `${capitalizedRouteName}RequestDto`;
      const responseDto = `${capitalizedRouteName}ResponseDto`;

      const route = String(routePath)
        .split("/")
        .map((routePart) =>
          routePart.startsWith(":") ? `{${routePart.slice(1)}}` : routePart,
        )
        .join("/");

      fetchFunctions.push(
        `
/**
 * Auto-generated function for ${routeName}
 */
export async function ${routeName}(params: interfaces.${requestDto}): Promise<interfaces.${responseDto}> {
    const response: interfaces.${responseDto} = await notesFetch({
        url: "${route}", 
        method: "${method}",
        ${route !== String(routePath) ? "pathParams: params.pathParams," : ""}
        ${["POST", "PUT"].includes(method) ? "body: params.body," : ""}
    });
 
    return response;
}

`,
      );
    });

    const outputContent = `// Auto-generated fetch functions
// Generated on ${new Date().toISOString()}
import { interfaces } from "@dto/index";

import { notesFetch } from "./fetcher/notesFetch";

${fetchFunctions.join("\n")}
`;

    await writeFile(OUTPUT_FILE_PATH, outputContent, "utf-8");
    // eslint-disable-next-line no-console
    console.log(`Fetch functions generated and saved to ${OUTPUT_FILE_PATH}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating fetch functions:", error);
  }
}

generateFetchFunctions();
