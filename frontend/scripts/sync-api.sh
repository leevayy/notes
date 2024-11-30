GENERATED_FILE_PATH=api/generatedApi.ts
SCRIPT_PATH=scripts/generateApiFromInterfacesAndRoutes

rm -f ${GENERATED_FILE_PATH}
rm -f ${SCRIPT_PATH}.cjs
tsc --module commonjs ${SCRIPT_PATH}.ts
mv ${SCRIPT_PATH}.js ${SCRIPT_PATH}.cjs
node ${SCRIPT_PATH}.cjs
