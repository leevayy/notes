"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("fs/promises");
var routes_1 = require("../../dto/routes");
var OUTPUT_FILE_PATH = "./api/generatedApi.ts";
function generateFetchFunctions() {
    return __awaiter(this, void 0, void 0, function () {
        var fetchFunctions_1, outputContent, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    fetchFunctions_1 = [];
                    Object.entries(routes_1.routes).forEach(function (_a) {
                        var routeName = _a[0], routePath = _a[1];
                        var capitalizedRouteName = routeName.charAt(0).toUpperCase() + routeName.slice(1);
                        var method = "GET";
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
                        var requestDto = "".concat(capitalizedRouteName, "RequestDto");
                        var responseDto = "".concat(capitalizedRouteName, "ResponseDto");
                        var route = String(routePath)
                            .split("/")
                            .map(function (routePart) {
                            return routePart.startsWith(":") ? "{".concat(routePart.slice(1), "}") : routePart;
                        })
                            .join("/");
                        fetchFunctions_1.push("\n/**\n * Auto-generated function for ".concat(routeName, "\n */\nexport async function ").concat(routeName, "(params: interfaces.").concat(requestDto, "): Promise<interfaces.").concat(responseDto, "> {\n    const response: interfaces.").concat(responseDto, " = await notesFetch({\n        url: \"").concat(route, "\", \n        method: \"").concat(method, "\",\n        ").concat(route !== String(routePath) ? "pathParams: params.pathParams," : "", "\n        ").concat(["POST", "PUT"].includes(method) ? "body: params.body," : "", "\n    });\n \n    return response;\n}\n\n"));
                    });
                    outputContent = "// Auto-generated fetch functions\n// Generated on ".concat(new Date().toISOString(), "\nimport { interfaces } from \"@dto/index\";\n\nimport { notesFetch } from \"./fetcher/notesFetch\";\n\n").concat(fetchFunctions_1.join("\n"), "\n");
                    return [4 /*yield*/, (0, promises_1.writeFile)(OUTPUT_FILE_PATH, outputContent, "utf-8")];
                case 1:
                    _a.sent();
                    // eslint-disable-next-line no-console
                    console.log("Fetch functions generated and saved to ".concat(OUTPUT_FILE_PATH));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    // eslint-disable-next-line no-console
                    console.error("Error generating fetch functions:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
generateFetchFunctions();
