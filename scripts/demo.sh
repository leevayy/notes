npm run kill-demo
cd frontend
nohup npm run dev > ../frontend.log 2>&1 & echo $! > ../frontend.pid
cd ../notes-backend 
nohup deno run dev > ../backend.log 2>&1 & echo $! > ../backend.pid
echo "Frontend and backend started. Don't forget to run npm run kill-demo to stop them."
echo ""
