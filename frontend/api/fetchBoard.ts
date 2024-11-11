export default async function fetchBoard() {
    const res = await fetch('http://localhost:8000/board');

    const board = await res.json();
    
    return board;
}