npx ts-to-zod ../dto/interfaces.ts zod/generated/generated_interfaces.ts
# sed -i '' 's/"zod"/"https:\/\/deno.land\/x\/zod\/mod.ts"/g' zod/interfaces.ts
# echo "Changed import from \"zod\" to \"https://deno.land/x/zod/mod.ts\""
# echo "Done"
