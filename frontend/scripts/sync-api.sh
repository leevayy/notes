# GENERATED_FILE_PATH=api/generatedApi.ts
# SCRIPT_PATH=scripts/generateApiFromInterfacesAndRoutes

# rm -f ${GENERATED_FILE_PATH}
# rm -f ${SCRIPT_PATH}.cjs
# tsc --module commonjs ${SCRIPT_PATH}.ts
# mv ${SCRIPT_PATH}.js ${SCRIPT_PATH}.cjs
# node ${SCRIPT_PATH}.cjs

GENERATED_FILE_PATH=api/generatedApi.ts
SCRIPT_PATH=scripts/generateApiFromInterfacesAndRoutes

# Clean up old files
rm -f ${GENERATED_FILE_PATH}
rm -rf dist

# Ensure output directory exists
mkdir -p dist

# Compile TypeScript file to CommonJS with specific options
tsc --outDir dist --module commonjs --target esnext --esModuleInterop \
    --moduleResolution node --strict --skipLibCheck \
    ${SCRIPT_PATH}.ts
# renames all .js files to .cjs
find dist -type f -name "*.js" -exec sh -c 'mv "$0" "${0%.js}.cjs"' {} \;

bash scripts/appendDotCjs.sh

node --experimental-specifier-resolution=node dist/frontend/${SCRIPT_PATH}.cjs
